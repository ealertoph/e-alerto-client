import { ArrowUp, Facebook, Globe } from "lucide-react";
import { assets } from "../../assets/assets";

export const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-6 bg-indigo-900 relative text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left items-center">
        {/* Left: E-Alerto Branding */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <img
            src={assets.logo_white}
            alt="E-Alerto Logo"
            className="h-8 object-contain"
          />
          <p className="text-sm font-medium">
            Empowering QCitizens. Engineering Safer Roads.
          </p>
          <p className="text-xs text-white/70">
            &copy; {new Date().getFullYear()} Project E-Alerto: A Road Damage
            Reporting and Project Tracking Platform Developed for the Quezon City Department of
            Engineering.
          </p>
        </div>

        {/* Center: Official Links */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-semibold uppercase text-white/100">
            Official Links
          </span>
          <a
            href="https://quezoncity.gov.ph/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-white transition-colors text-white/80"
          >
            <Globe size={16} /> Quezon City Government
          </a>
          <a
            href="https://www.facebook.com/QuezonCityDepartmentofEngineering"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-white transition-colors text-white/80"
          >
            <Facebook size={16} /> QCDE Facebook
          </a>
        </div>

        {/* Right: Developer Credit */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="text-xs font-semibold uppercase text-white/70">
            Developed by
          </span>
          <img
            src={assets.digibridge_solutions}
            alt="DigiBridge Solutions Logo"
            className="h-15 object-contain"
          />
        </div>
      </div>

      {/* Back to Top Button */}
      <a
        href="#hero"
        className="absolute right-6 bottom-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        title="Back to top"
      >
        <ArrowUp size={20} />
      </a>
    </footer>
  );
};
