import { ArrowUpRight } from "lucide-react";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="folio-section about-section"
      aria-labelledby="about-title"
    >
      <div className="folio-container about-grid">
        <div className="about-heading">
          <p className="folio-kicker">II / The person behind the work</p>
          <h2 id="about-title">
            A builder,
            <br />
            at <em>heart.</em>
          </h2>
          <span className="about-monogram" aria-hidden="true">
            NG<span>III</span>
          </span>
          <p className="about-location">Based in Red Bank, New Jersey.</p>
        </div>
        <div className="about-copy">
          <p className="about-lead">
            Good software takes more than good code. It takes an understanding
            of the people who use it, and the team that brings it to life.
          </p>
          <p>
            I'm President of{" "}
            <a
              href="https://collectsoftware.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Collect Software
            </a>{" "}
            and a founding team member and Head of Engineering at{" "}
            <a
              href="https://somethings.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Somethings
            </a>
            . At Collect, we build custom web, mobile, and enterprise software,
            integrate AI into business workflows, and provide senior technical
            consulting. At Somethings, I lead engineering for a platform
            connecting young people with mental health support.
          </p>
          <p>
            My background includes engineering roles at IBM and Wells Fargo,
            co-founding Mira Therapeutics and Life Skills Software, and building
            across digital health, education, and financial services. My work
            spans hands-on development, system architecture, and leading onshore
            and offshore teams.
          </p>
          <div className="practice-grid">
            <div>
              <h3>Engineering</h3>
              <ul>
                <li>Full-stack development</li>
                <li>System architecture</li>
                <li>Cloud infrastructure</li>
                <li>Technical leadership</li>
              </ul>
            </div>
            <div>
              <h3>Building businesses</h3>
              <ul>
                <li>Entrepreneurship</li>
                <li>Product strategy</li>
                <li>Team management</li>
                <li>Business development</li>
              </ul>
            </div>
          </div>
          <a
            className="folio-text-link"
            href="https://www.linkedin.com/in/nicholas-gattuso/"
            target="_blank"
            rel="noopener noreferrer"
          >
            More on LinkedIn <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
