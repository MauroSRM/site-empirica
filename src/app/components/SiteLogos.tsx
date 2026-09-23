import React from "react";

const PATHS = [
  "M118.042 1.31399L115.017 4.1688L101.522 17.474L87.8766 3.91358H85.2108H84.653V29.9662L85.2108 30.5239H87.7112L88.2689 29.9662V9.48142L101.163 22.3754H101.797L115.683 8.48885L124.48 0L118.042 1.31399Z",
  "M114.691 11.4692V30.5265H115.249H117.749H118.307V7.85339L114.691 11.4692Z",
  "M77.5359 18.8118C78.1079 18.8023 78.7507 18.6747 79.4502 18.4384L79.5022 18.4195C82.8062 16.9826 84.4841 14.695 84.4841 11.618V10.9374C84.4841 10.323 84.3092 9.48163 83.9405 8.35672L83.9169 8.28583L83.8791 8.21965C82.1586 5.3601 79.9985 3.90906 77.4556 3.90906H64.5093V7.54376L77.5501 7.60992L78.1835 7.75173C79.9749 8.52688 80.8493 9.69905 80.8635 11.3202C80.7075 12.4972 80.5704 12.7477 80.5563 12.7713L80.5137 12.8375C79.7102 14.3689 78.7081 15.1156 77.4509 15.1156H61.3944V8.81991H57.7785V30.5241H61.3944V18.8118H72.8376L84.1958 30.5241H88.256V29.5079L77.5265 18.8118H77.5359Z",
  "M56.2225 19.4416C54.6202 16.5678 52.3419 15.1121 49.4492 15.1121H39.4854L35.7561 18.8082L49.6572 18.8933L50.1535 18.9642C52.271 19.6165 53.2683 20.8501 53.2825 22.8399L53.0462 24.1681C52.3986 25.95 50.8861 26.8149 48.4282 26.8149H29.4366V30.5158H49.8699C50.6829 30.5158 51.718 30.218 53.032 29.6036L53.136 29.5421C55.6884 27.7366 56.9788 25.6711 56.9788 23.4024V22.5516C56.9788 21.4456 56.7235 20.401 56.2178 19.4274L56.2225 19.4416Z",
  "M36.4652 3.91223C35.7751 3.91223 34.8676 4.1202 33.6954 4.54558L33.6292 4.56921L33.5725 4.60702C30.831 6.31329 29.4414 8.44497 29.4414 10.9406V11.6212C29.4414 12.9446 29.8763 14.3153 30.7271 15.7002L30.7979 15.7947C31.9134 17.0472 33.0526 17.9169 34.1775 18.3896L34.5698 18.555L38.1006 15.2606L35.9264 15.0432C33.9884 14.3437 33.0478 13.11 33.0478 11.2809C33.0478 10.4301 33.3834 9.63132 34.0735 8.82782L34.1208 8.76164C34.6643 7.94395 35.9925 7.52802 38.0675 7.52802H60.7223L63.5489 7.5422V3.91223H36.4557H36.4652Z",
  "M0 10.4802V24.4423L12.0955 3.49438L0 10.4802ZM0.330871 25.019L12.4263 32.0001L24.5218 25.019H0.330871ZM12.7572 3.49912L24.8527 24.4471V10.4849L12.7572 3.49912Z",
];

const COLOR_FILLS = ["#597CA3", "#184987", "#184987", "#184987", "#597CA3", "#184987"];

export const LogoWhite = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 32" fill="none"
    className={className}
    style={{ height: 32, width: "auto", display: "block", ...style }}>
    {PATHS.map((d, i) => <path key={i} d={d} fill="white" />)}
  </svg>
);

export const LogoColor = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 125 32" fill="none"
    className={className}
    style={{ height: 32, width: "auto", display: "block", ...style }}>
    {PATHS.map((d, i) => <path key={i} d={d} fill={COLOR_FILLS[i]} />)}
  </svg>
);

export const LogoMark = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32" fill="none"
    className={className}
    style={{ height: 32, width: "auto", display: "block", ...style }}>
    <path d={PATHS[5]} fill={COLOR_FILLS[5]} />
  </svg>
);

export const LogoColorFull = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, flexShrink: 0, ...style }}>
    <LogoColor style={{ height: 29, width: "auto" }} />
    <span style={{
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontSize: 7.5, fontWeight: 400, color: "#184987",
      letterSpacing: "0.22px", lineHeight: 1, whiteSpace: "nowrap", display: "block",
    }}>
      Capital em movimento
    </span>
  </div>
);
