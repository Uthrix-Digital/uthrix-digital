import {
  LOGO_PATH,
  LOGO_VIEWBOX,
  DOT,
} from "../../../public/assets/Videos/logoPath";

const DOT_START_X = 8;
const LETTERS_END_X = 520.5;

export default function Intro() {
  const viewBox = `0 0 ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`;
  const wipeEnd = Math.max(0, (1 - LETTERS_END_X / LOGO_VIEWBOX.w) * 100);

  return (
    <div id="intro-overlay">
      <div
        className="intro-logo"
        style={
          {
            aspectRatio: `${LOGO_VIEWBOX.w} / ${LOGO_VIEWBOX.h}`,
            "--wipe-end": `${wipeEnd}%`,
            "--dot-from": `${DOT_START_X - DOT.cx}px`,
          } as React.CSSProperties
        }
      >
        {/* letters, revealed left to right */}
        <svg
          className="intro-letters"
          viewBox={viewBox}
          role="img"
          aria-label="Uthrix"
        >
          <path d={LOGO_PATH} fill="#fff" fillRule="evenodd" />
        </svg>

        {/* red dot rides the leading edge, ends as the full stop */}
        <svg className="intro-dot" viewBox={viewBox} aria-hidden="true">
          <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} fill={DOT.color} />
        </svg>
      </div>

      <button type="button" data-intro-skip className="intro-skip">
        Skip
      </button>
    </div>
  );
}