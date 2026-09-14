import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="Poupagaio">
      <span className="brand-image">
        <Image
          src="/logo-poupagaio-principal.png"
          alt=""
          width={96}
          height={96}
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
