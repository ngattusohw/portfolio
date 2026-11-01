import { ArrowDown, ArrowUpRight } from "lucide-react";
import "./RomanHero.css";
import CuriosityWorkbench from "./CuriosityWorkbench";

export default function RomanHero() {
  return (
    <section id="hero" className="retro-hero" aria-labelledby="hero-title">
      <div className="folio-container hero-stage">
        <div className="hero-copy">
          <p className="hero-greeting">
            <span aria-hidden="true">&gt;_</span> Hey, I’m Nick Gattuso III.
          </p>
          <h1 id="hero-title">
            Curiosity,
            <br />
            put to <span>work.</span>
          </h1>
          <p className="hero-intro">
            I build software, lead engineering teams, and occasionally rebuild
            the app that came with my sauna.
          </p>
          <div className="hero-actions">
            <a className="folio-button" href="#projects">
              Explore my work <ArrowDown size={16} aria-hidden="true" />
            </a>
            <a className="hero-secondary" href="#contact">
              Say hello <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-socials">
            <a
              href="https://github.com/ngattusohw"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/nicholas-gattuso/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
            <a href="/blog">Field notes ↗</a>
          </div>
        </div>
        <CuriosityWorkbench />
        <div className="hero-bottom-note">
          <span>People. Learning. The urge to make things work better.</span>
          <a href="#projects" aria-label="Scroll to selected projects">
            <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="hero-roles-wrap">
        <div className="folio-container hero-roles">
          <p className="folio-kicker">
            <span className="role-dot" aria-hidden="true" /> What I’m working on
          </p>
          <a
            href="https://collectsoftware.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hero-company">Collect Software</span>
            <span>President</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            href="https://somethings.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="hero-company">Somethings</span>
            <span>Founding team · Head of Engineering</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
