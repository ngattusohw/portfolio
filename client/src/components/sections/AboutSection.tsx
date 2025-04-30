export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary font-mono mb-2">Who I Am</p>
          <h2 className="text-3xl md:text-4xl font-sans font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-secondary mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-slide-up opacity-0">
            <h3 className="text-2xl font-bold font-sans mb-6">Turning ideas into digital reality</h3>
            <p className="text-slate-700 mb-6">
              As an entrepreneur and engineer, I've built a career on creating innovative solutions and 
              leading teams to deliver exceptional products. With expertise spanning from front-end 
              development to system architecture, I bring a holistic approach to every project.
            </p>
            <p className="text-slate-700 mb-6">
              My passion lies at the intersection of technology and business strategy. I've founded multiple 
              companies, led engineering teams at both startups and enterprise organizations, and continuously 
              seek opportunities to solve complex problems through elegant technical solutions.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Technical Skills
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li>Full-Stack Development</li>
                  <li>System Architecture</li>
                  <li>Cloud Infrastructure</li>
                  <li>Technical Leadership</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Business Skills
                </h4>
                <ul className="space-y-2 text-slate-700">
                  <li>Entrepreneurship</li>
                  <li>Product Strategy</li>
                  <li>Team Management</li>
                  <li>Business Development</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-accent rounded-xl opacity-30 blur-lg"></div>
              <svg 
                className="relative w-full max-w-md h-[400px] rounded-lg"
                viewBox="0 0 400 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="400" height="400" rx="8" fill="#F1F5F9" />
                <path d="M200 80C131.2 80 76 135.2 76 204C76 272.8 131.2 328 200 328C268.8 328 324 272.8 324 204C324 135.2 268.8 80 200 80ZM200 100C227.6 100 251.2 112.4 267.2 131.6C262.8 136.8 254.8 139.6 246.8 137.2C240.8 135.2 236.4 130.8 231.2 127.6C226 124.4 220.8 121.2 215.2 120.4C201.6 118.4 187.6 125.6 174.4 121.2C169.2 119.6 165.2 116.4 160.8 114C155.6 110.8 149.6 108.8 144 110.4C138 112 134 117.2 130 122C128 124.4 126 126.8 123.6 129.2C137.2 111.6 157.2 100 200 100ZM120 188.4C120.8 176.4 132 170 143.2 167.6C154.4 165.2 166.4 166 176.8 172C179.6 173.6 182 175.6 185.2 176.4C190 177.6 194.8 177.2 199.6 176.4C212.8 174 225.6 168.4 239.2 166.8C248.8 165.6 259.2 167.2 266.8 173.2C273.2 178.4 276.8 186.4 279.6 194.4C282.4 202.4 285.2 210.8 291.2 216.8C294.4 220 298.4 222.4 301.6 225.6C304.8 229.2 307.2 233.6 308 238.4C308.8 242.8 308 247.2 307.2 251.6C314.8 237.2 320 221.2 320 204C320 154.8 289.6 111.6 241.6 93.2C242.8 94.8 243.6 96.8 244.4 98.8C247.2 105.6 247.2 113.2 244.4 120C240.8 128.8 232.8 135.2 228 143.6C224 150.4 221.6 159.2 225.2 166.8C228.8 174.4 238 177.6 240.8 185.6C242.8 191.2 240.8 197.2 238 202.4C235.2 207.6 231.6 212 228.8 217.2C222.8 228 220.4 241.2 226 252.8C231.6 264.4 245.6 272 258.4 270C264.4 269.2 270 266.4 276 266.4C282 266.4 288.4 270.8 289.2 276.8C277.2 295.6 258 309.6 236 315.6C236 314.8 236 314 236 313.2C236 304.8 235.6 295.2 230 288.4C227.2 284.8 223.2 282.4 219.2 280C210.8 274.8 202.4 269.6 196.4 262C189.6 252.8 187.2 240.8 188.8 229.6C190 221.2 194 213.6 196.8 205.6C199.6 197.6 201.6 188.8 198.8 180.8C196 172.8 188.8 167.2 182 161.6C174.8 155.6 167.6 148.8 164.4 139.6C161.2 130.4 162 119.6 166.8 111.2C142.8 127.2 126 152.8 120 188.4ZM172.8 312.8C179.2 314.8 180 306.8 181.2 302C182.8 295.6 185.2 288.8 190 284C196 278 205.2 275.6 213.6 276.4C214.8 276.4 216 276.8 217.2 276.8C217.2 277.2 216.8 277.6 216.8 278C207.6 289.2 192 293.6 178.8 300.4C172.8 303.6 165.2 309.2 172.8 312.8ZM200 324C189.2 324 178.8 322.4 168.8 319.6C170.4 317.6 172.4 316.4 174.8 315.6C187.2 311.6 200.4 309.2 212.4 304C219.6 300.8 226.4 296.4 231.6 290.4C236.8 284.4 240 276.4 239.6 268.4C258.8 266.8 274.8 252 280 233.6C281.6 228.4 282.4 222.8 281.6 217.6C280.8 212.4 278 207.2 273.6 204.4C266.8 200 257.6 201.6 250 198.4C246 196.8 242.8 193.6 240 190C234.4 182.8 230.4 171.6 235.6 164C239.2 159.2 245.2 157.2 250.8 154.8C256.4 152.4 262.4 149.2 264.8 143.6C267.2 138 266 131.2 263.2 126C260.4 120.8 256 116.8 252 112.8C278 128.4 296 163.2 296 204C296 271.2 251.6 324 200 324Z" fill="#0066CC" fillOpacity="0.4"/>
                <path d="M131.2 193.6C140.8 194.4 148.8 199.6 156.8 204.8C162 208 167.6 211.6 172.8 215.2C178 218.8 183.2 223.2 186 229.2C189.6 236.8 188.8 245.6 188 254C187.2 262.4 186.4 271.6 190.8 278.8C197.2 289.6 211.6 293.2 224.8 294.8C238 296 252 295.6 264 299.6C269.6 301.6 274.8 304.4 279.6 307.6C272 310.8 264 313.2 256 314.8C254.8 308 249.6 302.8 243.2 300.4C236.8 298 229.6 298.4 222.8 298.8C212.8 299.6 202 300 194 294.4C186 288.8 183.2 278.8 179.6 269.6C176 260.4 170.8 251.2 162.4 246C154 240.8 142.8 240.4 133.6 244.4C127.6 247.2 122.8 251.6 118 256.4C112.8 261.6 107.6 267.2 100.8 270.4C98.8 271.2 96.8 272 94.8 272.4C94.4 272.4 94 272.4 93.6 272.4C102.8 253.2 116.8 236.8 131.2 193.6Z" fill="#0066CC" fillOpacity="0.4"/>
                <path d="M259.6 320.8C220.4 337.2 175.2 335.6 137.6 315.6C137.6 315.6 151.6 306.4 153.6 304.8C178.8 285.6 152.8 276.4 142.8 304C142.4 304.8 142 305.6 141.6 306.4C126.8 295.2 114 281.2 104 266C120.8 260.8 130.8 243.6 121.6 228.4C114.4 215.6 96.8 211.6 84 214.8C81.2 215.6 78.4 216.4 76 217.6C76 204 78.8 191.2 84 179.2C86 183.2 88.4 186.8 92 189.6C95.6 192.4 100 194 104.4 194.8C112.8 196.4 121.6 194 128.8 188.8C136 183.6 141.2 176 146 168.4C150.8 160.8 155.6 152.8 162.8 147.6C170 142.4 180.4 140.8 187.6 145.6C193.6 149.6 196.4 156.8 198.4 163.6C200.4 170.4 202 177.6 205.6 183.6C209.2 189.6 214.8 194.4 221.2 197.2C227.6 200 234.8 201.2 242 201.6C249.2 202 256.8 201.6 264 201.6C284.8 202 304.8 215.6 309.2 236C309.6 238 309.6 240 310 242C296.8 279.2 277.2 307.6 259.6 320.8Z" fill="#0066CC" fillOpacity="0.4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
