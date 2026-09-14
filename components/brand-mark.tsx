import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="Poupagaio">
      <span className="brand-image">
        <Image
          src="/logo-poupagaio.svg"
          alt=""
          width={46}
          height={46}
          priority
        />
      </span>
      {!compact && (
        <span>
          <strong>Poupagaio</strong>
          <small>Organize hoje. Voe mais longe.</small>
        </span>
      )}
    </div>
  );
}
