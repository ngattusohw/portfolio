import { ArrowDown, ArrowUpRight } from "lucide-react";
import "./RomanHero.css";

function ArchitecturalStudy() {
  return (
    <svg
      className="architectural-study"
      viewBox="0 0 560 570"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="stone-hatching"
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 7L7 0" stroke="#8c7c65" strokeWidth=".5" opacity=".32" />
        </pattern>
        <linearGradient
          id="stone-face"
          x1="100"
          y1="100"
          x2="450"
          y2="500"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e9dfcf" />
          <stop offset="1" stopColor="#cabb9f" />
        </linearGradient>
      </defs>
      <circle cx="345" cy="215" r="154" fill="#8c3d32" />
      <circle
        cx="345"
        cy="215"
        r="180"
        stroke="#b3a592"
        strokeDasharray="2 7"
      />
      <path
        d="M35 470H530M96 30V510M465 30V510M32 120H526"
        stroke="#c8bcaa"
        strokeWidth=".8"
      />
      <path d="M96 465L197 411H482L390 465Z" fill="#d5c9b5" />
      <path
        d="M111 446V194C111 94 186 50 269 50L334 84C249 84 184 140 184 229V446Z"
        fill="#c4b599"
        stroke="#766a57"
      />
      <path
        d="M184 446V229C184 140 249 84 334 84C417 84 465 140 465 229V446H390V230C390 189 369 163 334 163C297 163 270 189 270 230V446Z"
        fill="url(#stone-face)"
        stroke="#766a57"
        strokeWidth="1.2"
      />
      <path
        d="M270 446V230C270 189 297 163 334 163L299 145C261 145 233 174 233 217V446Z"
        fill="#a7987e"
        stroke="#766a57"
      />
      <path
        d="M111 446V194C111 94 186 50 269 50L334 84C249 84 184 140 184 229V446Z"
        fill="url(#stone-hatching)"
      />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path
          key={i}
          d={`M184 ${261 + i * 25}H270M390 ${261 + i * 25}H465`}
          stroke="#a5967e"
          strokeWidth=".8"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${193 + i * 13} ${180 - i * 14}L${267 + i * 12} ${202 - i * 9}`}
          stroke="#a5967e"
          strokeWidth=".8"
        />
      ))}
      <path
        d="M184 245H270M390 245H465M175 249H279V262H175ZM381 249H474V262H381Z"
        fill="#dfd2bd"
        stroke="#877960"
      />
      <path
        d="M172 429H281V449H172ZM380 429H477V449H380ZM159 449H489V465H159Z"
        fill="#e3d6c0"
        stroke="#877960"
      />
      <path d="M270 446H390V465H270Z" fill="#b9a98d" />
      <path
        d="M68 485H502M68 479V491M502 479V491M45 75V465M39 75H51M39 465H51"
        stroke="#817461"
        strokeWidth=".7"
      />
      <path
        d="M324 76L333 66L343 77M324 165L334 176L344 165"
        stroke="#817461"
        strokeWidth=".7"
      />
      <text
        x="281"
        y="515"
        textAnchor="middle"
        fill="#756b5c"
        fontSize="10"
        letterSpacing="3"
        fontFamily="monospace"
      >
        FORM / FUNCTION / FOUNDATION
      </text>
      <text
        x="45"
        y="551"
        fill="#8c3d32"
        fontSize="11"
        letterSpacing="2"
        fontFamily="monospace"
      >
        FIG. 01
      </text>
      <text
        x="516"
        y="551"
        textAnchor="end"
        fill="#756b5c"
        fontSize="10"
        letterSpacing="1"
        fontFamily="monospace"
      >
        AN ARCHITECTURAL STUDY
      </text>
    </svg>
  );
}

export default function RomanHero() {
  return (
    <section id="hero" className="roman-hero" aria-labelledby="hero-title">
      <div className="folio-container">
        <div className="hero-topline">
          <span>Nick Gattuso III</span>
          <span>Engineer. Founder. Builder.</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="folio-kicker">
              A considered approach to ambitious ideas
            </p>
            <h1 id="hero-title">
              Built with
              <br />
              <em>intention.</em>
            </h1>
            <p className="hero-intro">
              I build software and lead the teams behind it. From the first idea
              to the systems that keep it running.
            </p>
            <div className="hero-actions">
              <a className="folio-button" href="#projects">
                Explore the work <ArrowDown size={17} aria-hidden="true" />
              </a>
              <a className="folio-text-link" href="#about">
                A little about me <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="hero-art">
            <ArchitecturalStudy />
          </div>
        </div>
        <div className="hero-roles">
          <span className="folio-kicker">Currently building at</span>
          <a
            href="https://collectsoftware.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Collect Software <span>President</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a
            href="https://somethings.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Somethings <span>Founding team · Head of Engineering</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
