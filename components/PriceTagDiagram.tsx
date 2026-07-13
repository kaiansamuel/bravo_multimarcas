export default function PriceTagDiagram() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <svg
        viewBox="0 0 320 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        aria-label="Etiqueta de preço ilustrativa"
      >
        {/* Etiqueta de preço */}
        <rect x="20" y="20" width="280" height="160" rx="4" fill="#2A2318" stroke="#3A3122" strokeWidth="2" />

        {/* Furo do barbante */}
        <circle cx="50" cy="48" r="8" fill="none" stroke="#E8B84B" strokeWidth="2" />
        <line x1="50" y1="20" x2="50" y2="40" stroke="#A79C89" strokeWidth="1" strokeDasharray="3 2" />

        {/* SKU */}
        <text x="80" y="50" fontFamily="var(--font-ibm-plex-mono)" fontSize="11" fill="#A79C89" letterSpacing="2">
          SKU-00847
        </text>

        {/* Nome do produto */}
        <text x="40" y="85" fontFamily="var(--font-oswald)" fontSize="20" fontWeight="600" fill="#F3EFE7" letterSpacing="1">
          CAMISETA BÁSICA
        </text>

        {/* Preço */}
        <text x="40" y="118" fontFamily="var(--font-ibm-plex-mono)" fontSize="28" fontWeight="500" fill="#E8B84B">
          R$ 79,90
        </text>

        {/* Código de barras */}
        <g fill="#A79C89">
          <rect x="40" y="140" width="3" height="24" />
          <rect x="46" y="140" width="1.5" height="24" />
          <rect x="50" y="140" width="4" height="24" />
          <rect x="57" y="140" width="1.5" height="24" />
          <rect x="62" y="140" width="2.5" height="24" />
          <rect x="68" y="140" width="4" height="24" />
          <rect x="75" y="140" width="1.5" height="24" />
          <rect x="80" y="140" width="3" height="24" />
          <rect x="86" y="140" width="2" height="24" />
          <rect x="91" y="140" width="3.5" height="24" />
          <rect x="98" y="140" width="1.5" height="24" />
          <rect x="103" y="140" width="4" height="24" />
          <rect x="110" y="140" width="2" height="24" />
          <rect x="115" y="140" width="3" height="24" />
        </g>

        {/* Status badge */}
        <rect x="200" y="135" width="86" height="28" rx="4" fill="#E8B84B" />
        <text x="216" y="154" fontFamily="var(--font-oswald)" fontSize="12" fontWeight="600" fill="#17130F" letterSpacing="1">
          EM ESTOQUE
        </text>
      </svg>
    </div>
  );
}
