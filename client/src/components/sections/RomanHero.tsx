import { ArrowUpRight } from "lucide-react";
import "./RomanHero.css";
import CuriosityWorkbench from "./CuriosityWorkbench";

export default function RomanHero() {
  return (
    <>
      <CuriosityWorkbench />
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
    </>
  );
}
