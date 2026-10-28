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
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-roman-bg p-4 roman-scene">
      <div className="absolute inset-0 scanlines"></div>
      
      <div className="w-full flex justify-center items-end relative z-10">
        {/* Left Column */}
        <div className="pixel-column">
          <div className="pixel-column-top"></div>
          <div className="pixel-column-body"></div>
          <div className="pixel-column-base"></div>
        </div>

        {/* Coliseum */}
        <div className="mx-8">
          <pre className="font-mono text-center text-roman-gold leading-tight text-xs coliseum">
            {coliseumArt}
          </pre>
          <div className="mt-4 text-center">
             <h1 className="font-pixel text-4xl text-roman-parchment mb-2 animate-fade-in-up">
              Nick Gattuso
            </h1>
            <p className="font-pixel text-lg text-roman-gold animate-fade-in-up delay-100">
              Architect of Digital Empires
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="pixel-column">
          <div className="pixel-column-top"></div>
          <div className="pixel-column-body"></div>
          <div className="pixel-column-base"></div>
        </div>
      </div>
    </section>
  );
} 