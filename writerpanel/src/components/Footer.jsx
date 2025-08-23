import PioneerLogo from "../assets/logo.jpg";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          {/* Left Section: Logo and Links (closer) */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
            <div className="flex items-center space-x-3">
              <img
                src={PioneerLogo}
                alt="Company Logo"
                className="w-20 h-20 object-contain lg:w-20 lg:h-20"
              />
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-xs">
              <a
                href="/about"
                title="About Us"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                About
              </a>

              <a
                href="/contact"
                title="Contact Us"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Contact Us
              </a>
              <a
                href="/privacy-policy"
                title="Privacy Policy"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="/cancellation-policy"
                title="Cancellation Policy"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                Cancellation Policy
              </a>
            </div>
          </div>

          {/* Right Section: Socials */}
          <div className="flex flex-col items-center space-y-4">
            <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/pioneerwriters"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-md"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/pioneer-writers/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition-all duration-200 hover:scale-110 shadow-md"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/pioneerwriters/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-110 shadow-md"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.25-.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </a>

              {/* Twitter/X */}
              <a
                href="https://x.com/pioneerwriters_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-200 hover:scale-110 shadow-md"
                aria-label="Twitter"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2017 - 2025{" "}
              <span className="font-semibold text-gray-800">
                www.pioneerwriters.com
              </span>
              , All rights reserved.
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Quality, timely and plagiarism-free work.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
