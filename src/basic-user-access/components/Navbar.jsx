import { cn } from "../lib/utils";
import { Menu, X, Facebook, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock/unlock body scroll when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // ✅ Fix: Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        document.body.style.overflow = "unset";
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Semi-transparent overlay (outside nav) */}
      <div
        onClick={() => setIsMenuOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/50 z-30 transition-opacity duration-300 md:hidden",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      ></div>

      <nav
        className={cn(
          "fixed w-full z-40 transition-all duration-300",
          isScrolled
            ? "py-3 bg-background/70 backdrop-blur-md shadow-sm"
            : "py-5"
        )}
      >
        <div className="container flex items-center justify-between">
          <a href="#hero" className="flex items-center">
            <img src={assets.logo} alt="Logo" className="h-10 w-auto" />
          </a>

          {/* right side controls */}
          <div className="flex items-center space-x-4">
            {/* desktop nav */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item, key) => (
                <a
                  key={key}
                  href={item.href}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300 text-l"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Theme toggle inside navbar */}
            <ThemeToggle />

            {/* mobile nav trigger */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden p-2 text-foreground z-50"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Mobile side-drawer menu */}
          <div
            className={cn(
              "fixed top-0 left-0 h-screen w-3/4 bg-background z-40 flex flex-col justify-between p-8 transition-transform duration-300 md:hidden",
              isMenuOpen ? "transform-none" : "-translate-x-full"
            )}
          >
            {/* Header with logo and close button */}
            <div>
              <div className="flex items-center justify-between w-full mb-8">
                <a href="#hero" className="flex items-center">
                  <img src={assets.logo} alt="Logo" className="h-10 w-auto" />
                </a>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-foreground"
                  aria-label="Close Menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Menu items */}
              <div className="flex flex-col space-y-6">
                {navItems.map((item, key) => (
                  <a
                    key={key}
                    href={item.href}
                    className="text-l font-semibold text-foreground/90 hover:text-primary transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer-style section at bottom */}
            <div className="mt-10 border-t border-gray-400 pt-6 text-sm text-foreground/80 space-y-4">
              <p className="text-xs leading-relaxed">
                © 2025 Project E-Alerto: A Road Damage Reporting and Project
                Tracking Platform Developed for the Quezon City Department of
                Engineering.
              </p>

              <div className="flex flex-col space-y-2">
                <a
                  href="https://quezoncity.gov.ph/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Globe size={16} /> Quezon City Government
                </a>
                <a
                  href="https://www.facebook.com/QuezonCityDepartmentofEngineering"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Facebook size={16} /> QCDE Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
