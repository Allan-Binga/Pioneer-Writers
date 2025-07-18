import PrestigeLogo from "../assets/logo.jpg";

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left: Links and Copyright */}
        <div className="text-sm text-center md:text-left mb-3 md:mb-0 space-y-1">
          <p>
            © 2017 - 2025{" "}
            <span className="font-semibold text-gray-800">
              www.pioneerwriters.com
            </span>
            , All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-gray-600 text-xs">
            <a href="/privacy-policy" className="hover:text-black transition">
              Privacy Policy
            </a>
            <a
              href="/cancellation-policy"
              className="hover:text-black transition"
            >
              Cancellation Policy
            </a>
            <a href="/blog" className="hover:text-black transition">
              Blog
            </a>
            <a href="/about" className="hover:text-black transition">
              About
            </a>
            <a href="/contact" className="hover:text-black transition">
              Contact Us
            </a>
          </div>
        </div>

        {/* Right: Logo */}
        <div className="mt-3 md:mt-0">
          <img
            src={PrestigeLogo}
            alt="Company Logo"
            className="w-16 h-16 object-contain md:w-20 md:h-20"
          />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
