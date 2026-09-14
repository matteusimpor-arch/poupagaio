# Poupagaio

Aplicativo de controle financeiro pessoal, compartilhado e familiar.

**Slogan:** Organize hoje. Voe mais longe.

## Estado atual

- Dashboard responsivo
- Paleta e status financeiros
- Telas de login e cadastro
- Cliente Supabase para navegador e servidor
- Confirmação de e-mail e logout
- Schema inicial com espaços pessoais e compartilhados
- Row Level Security
- Validação automática de lint e build

## Executar localmente

1. Instale as dependências: npm install
2. Copie .env.example para .env.local
3. Preencha a URL e a chave publicável do Supabase
4. A migration em supabase/migrations é aplicada pela integração do Supabase
5. Inicie com npm run dev

## Segurança

Cada novo cadastro recebe automaticamente o espaço privado “Minhas finanças”. Os registros são associados a espaços financeiros, e as políticas RLS limitam o acesso aos participantes autorizados.

Nunca adicione a service role key, senha do banco ou outras credenciais privadas ao repositório.
