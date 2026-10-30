import "./RomanHero.css";

export default function RomanHero() {
  const coliseumArt = `
              @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
              @@                                                                                              @@
              @@                                              ..''''''''..                                      @@
              @@                                    ..''..''..''..''..''.''''.                                  @@
              @@                                  '..''..''..''.''''.''''.''.''..                                @@
              @@                                ..''..''..''..'''.''''.''''.''.''..''                            @@
              @@                              ..''..''..''..'''.''''.''''.''.''..''..''                          @@
              @@                              ''..''..''..'''.''''.''''.''.''..''..''.''                        @@
              @@                            ..''..''..''..'''.''''.''''.''.''..''..''.'''                        @@
              @@                          ..''..''..''..'''.''''.''''.''.''..''..''.''''.                        @@
              @@                          ''..''..''..'''.''''.''''.''.''..''..''.''''.''                      @@
              @@                          ''..''..''..'''.''''.''''.''.''..''..''.''''.''                      @@
              @@                        ..''..''..''..'''.''''.''''.''.''..''..''.''''.'''                      @@
              @@                        ''..''..''..'''.''''.''''.''.''..''..''.''''.''''.                     @@
              @@                      ..''..''..''..'''.''''.''''.''.''..''..''.''''.''''.                     @@
              @@                      ''..''..''..'''.''''.''''.''.''..''..''.''''.''''.'''                    @@
              @@                      ''..''..''..'''.''''.''''.''.''..''..''.''''.''''.'''                    @@
_..__..__..__..''_..__..__..__..__..__''._..__..__..__..__..__..''_..__..__..__..__..__..''_..__..__..__..__..__..__
 '''''''''''''''''''''''''''''''''''''''' '''''''''''''''''''''''''''''''''''''''' '''''''''''''''''''''''''''''''
  `;

  return (
    <section id="hero" className="roman-hero roman-scene" aria-labelledby="hero-title">
      <div className="scanlines" aria-hidden="true"></div>

      <div className="roman-hero__scene" aria-hidden="true">
        <div className="roman-hero__column">
          <div className="roman-hero__column-cap"></div>
          <div className="roman-hero__column-shaft"></div>
          <div className="roman-hero__column-cap roman-hero__column-cap--base"></div>
        </div>

        <pre className="roman-hero__art">{coliseumArt.replace(/^\n/, "").trimEnd()}</pre>

        <div className="roman-hero__column">
          <div className="roman-hero__column-cap"></div>
          <div className="roman-hero__column-shaft"></div>
          <div className="roman-hero__column-cap roman-hero__column-cap--base"></div>
        </div>
      </div>

      <div className="roman-hero__content">
        <h1 id="hero-title" className="roman-hero__title">Nick Gattuso</h1>
        <p className="roman-hero__subtitle">Architect of Digital Empires</p>

        <div className="roman-hero__actions">
          <a href="#projects" className="roman-hero__link roman-hero__link--primary">
            View projects <span aria-hidden="true">↗</span>
          </a>
          <a href="#contact" className="roman-hero__link">
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
