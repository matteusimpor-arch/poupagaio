-- Poupagaio: base multiusuário com isolamento por espaço financeiro.
create extension if not exists "pgcrypto";

create type public.space_kind as enum ('personal', 'shared');
create type public.member_role as enum ('admin', 'member');
create type public.transaction_kind as enum ('income', 'fixed_expense', 'variable_expense', 'installment');
create type public.payment_status as enum ('pending', 'scheduled', 'due_soon', 'due_today', 'late', 'paid', 'cancelled');
create type public.goal_movement_kind as enum ('deposit', 'withdrawal');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.financial_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind public.space_kind not null default 'personal',
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.space_members (
  space_id uuid not null references public.financial_spaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.member_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (space_id, user_id)
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.financial_spaces(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  paid_by uuid references public.profiles(id),
  kind public.transaction_kind not null,
  description text not null,
  amount numeric(14,2) not null check (amount >= 0),
  category text,
  due_date date not null,
  paid_at timestamptz,
  status public.payment_status not null default 'pending',
  recurring boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.financial_spaces(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  name text not null,
  target_amount numeric(14,2) not null check (target_amount > 0),
  target_date date,
  monthly_target numeric(14,2) check (monthly_target >= 0),
  priority smallint not null default 2 check (priority between 1 and 3),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goal_movements (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  kind public.goal_movement_kind not null,
  amount numeric(14,2) not null check (amount > 0),
  movement_date date not null default current_date,
  reason text,
  created_at timestamptz not null default now()
);

create table public.investments (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.financial_spaces(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  name text not null,
  investment_type text not null,
  invested_amount numeric(14,2) not null check (invested_amount >= 0),
  current_value numeric(14,2) check (current_value >= 0),
  transaction_date date not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.financial_spaces(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  name text not null,
  estimated_value numeric(14,2) not null check (estimated_value >= 0),
  reserved_value numeric(14,2) not null default 0 check (reserved_value >= 0),
  desired_date date,
  priority smallint not null default 2 check (priority between 1 and 3),
  status text not null default 'planning',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.monthly_closings (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.financial_spaces(id) on delete cascade,
  reference_month date not null,
  income_target numeric(14,2) not null default 0,
  expense_limit numeric(14,2) not null default 0,
  savings_target numeric(14,2) not null default 0,
  investment_target numeric(14,2) not null default 0,
  final_balance numeric(14,2),
  result text,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (space_id, reference_month)
);

create index transactions_space_due_idx on public.transactions(space_id, due_date);
create index transactions_space_status_idx on public.transactions(space_id, status);
create index goals_space_idx on public.goals(space_id);
create index investments_space_idx on public.investments(space_id);
create index closings_space_month_idx on public.monthly_closings(space_id, reference_month);

create or replace function public.is_space_member(target_space uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.space_members
    where space_id = target_space and user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.financial_spaces enable row level security;
alter table public.space_members enable row level security;
alter table public.transactions enable row level security;
alter table public.goals enable row level security;
alter table public.goal_movements enable row level security;
alter table public.investments enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.monthly_closings enable row level security;

create policy "profile_self_select" on public.profiles for select using (id = auth.uid());
create policy "profile_self_update" on public.profiles for update using (id = auth.uid());

create policy "spaces_member_select" on public.financial_spaces for select using (public.is_space_member(id));
create policy "spaces_owner_update" on public.financial_spaces for update using (owner_id = auth.uid());

create policy "members_member_select" on public.space_members for select using (public.is_space_member(space_id));

create policy "transactions_member_access" on public.transactions for all
using (public.is_space_member(space_id))
with check (public.is_space_member(space_id) and created_by = auth.uid());

create policy "goals_member_access" on public.goals for all
using (public.is_space_member(space_id))
with check (public.is_space_member(space_id) and created_by = auth.uid());

create policy "goal_movements_member_access" on public.goal_movements for all
using (exists(select 1 from public.goals g where g.id = goal_id and public.is_space_member(g.space_id)))
with check (created_by = auth.uid() and exists(select 1 from public.goals g where g.id = goal_id and public.is_space_member(g.space_id)));

create policy "investments_member_access" on public.investments for all
using (public.is_space_member(space_id))
with check (public.is_space_member(space_id) and created_by = auth.uid());

create policy "wishlist_member_access" on public.wishlist_items for all
using (public.is_space_member(space_id))
with check (public.is_space_member(space_id) and created_by = auth.uid());

create policy "closings_member_access" on public.monthly_closings for all
using (public.is_space_member(space_id))
with check (public.is_space_member(space_id));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare new_space_id uuid;
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.financial_spaces (name, kind, owner_id)
  values ('Minhas finanças', 'personal', new.id)
  returning id into new_space_id;

  insert into public.space_members (space_id, user_id, role)
  values (new_space_id, new.id, 'admin');

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
