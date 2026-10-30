import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
const navigation = [
  ["Work", "projects"],
  ["About", "about"],
  ["Experience", "experience"],
  ["Journal", "blog"],
];
export default function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [open]);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="folio-container header-inner">
        <a
          className="site-wordmark"
          href="/#hero"
          aria-label="Nick Gattuso home"
          onClick={() => setOpen(false)}
        >
          NG<span>III</span>
          <i aria-hidden="true" />
        </a>
        <nav className="desktop-navigation" aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <a href={`/#${id}`} key={id}>
              {label}
            </a>
          ))}
          <a className="nav-contact" href="/#contact">
            Let’s talk <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
        <button
          ref={menuButton}
          className="mobile-menu-button"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {[...navigation, ["Let’s talk", "contact"]].map(([label, id]) => (
          <a key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
            {label}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </header>
  );
}
