import { ArrowDown, Info } from "lucide-react";
import { assets } from "../../assets/assets";
import { useState } from "react";

export const HeroSection = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 py-12 pt-24 md:pt-18 text-foreground transition-colors duration-300 animate-fade-in"
      style={{
        background: `url(${assets.login_bg}) no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(
            to right,
            hsl(var(--background)/1),
            hsl(var(--background)/1),
            hsl(var(--section)/0.6),
            hsl(var(--background)/0.8),
            hsl(var(--background)/1)
          )`,
        }}
      ></div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        {/* LEFT: Text Content */}
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight opacity-0 animate-fade-in">
            Report Road Damages. Ensure Transparency.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0 opacity-0 animate-fade-in-delay-2">
            A QCitizen-centered platform to report, track, and monitor road
            repair projects—because every QC street deserves transparency.
          </p>

          <div className="pt-4 flex items-center justify-center md:justify-start gap-2 opacity-0 animate-fade-in-delay-3 relative pb-20 md:pb-0">
            <a href="#" className="cosmic-button">
              Download Now
            </a>

            {/* Info Icon with Tooltip */}
            <div
              className="relative flex items-center z-50"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                className="flex items-center justify-center w-7 h-7 rounded-full border border-muted-foreground text-muted-foreground hover:bg-muted transition"
                aria-label="App Info"
              >
                <Info className="w-6 h-6" />
              </button>

              {showTooltip && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg p-3 w-56 z-[60]">
                  Currently available for compatible{" "}
                  <span className="font-semibold text-primary">Android</span>{" "}
                  devices only. iOS version is not yet supported.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Phone*/}
        <div className="relative flex justify-center md:justify-end opacity-0 animate-fade-in-delay-4 order-first md:order-last z-0">
          <img
            src={assets.hero_phone}
            alt="E-Alerto Mobile App"
            width={1080} // actual pixel width of your SVG/PNG
            height={1080} // actual pixel height
            fetchpriority="high"
            decoding="async"
            className="w-80 md:w-[42rem] drop-shadow-xl relative z-10"
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center text-center animate-bounce pointer-events-none z-20">
        <p className="text-sm text-muted-foreground mb-1">Scroll</p>
        <ArrowDown className="h-5 w-5 text-primary" />
      </div>
    </section>
  );
};
