import { ArrowUp } from "lucide-react";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="folio-container">
        <div className="footer-main">
          <a
            className="site-wordmark"
            href="/#hero"
            aria-label="Nick Gattuso home"
          >
            NG<span>III</span>
            <i aria-hidden="true" />
          </a>
          <p>
            Engineering. Entrepreneurship.
            <br />
            An enduring curiosity.
          </p>
          <div className="footer-links">
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
            <a
              href="https://collectsoftware.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Collect Software ↗
            </a>
            <a
              href="https://x.com/NickGattuso"
              target="_blank"
              rel="noopener noreferrer"
            >
              X ↗
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Nick Gattuso III</p>
          <span>Red Bank, New Jersey</span>
          <a href="/#hero">
            Back to top <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
