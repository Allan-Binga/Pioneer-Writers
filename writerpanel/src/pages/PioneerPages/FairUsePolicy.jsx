import LandingNav from "../../components/LandingNav";
import Footer from "../../components/Footer";

function FairUsePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col relative overflow-hidden">
      <LandingNav />

      {/* Background Particles - Above content */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Enhanced Floating Particles - Layer 1 (Large) */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-bounce opacity-60 shadow-lg"></div>
        <div className="absolute top-32 right-28 w-5 h-5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-pulse opacity-50 shadow-md"></div>
        <div
          className="absolute top-1/3 left-1/4 w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full animate-bounce opacity-40 shadow-lg"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse opacity-45 shadow-md"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute top-1/4 right-1/2 w-5 h-5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-bounce opacity-50 shadow-lg"
          style={{ animationDelay: "0.8s" }}
        ></div>

        {/* Enhanced Floating Particles - Layer 2 (Medium) */}
        <div
          className="absolute top-40 left-10 w-3 h-3 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-40 right-16 w-4 h-4 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-full animate-pulse opacity-35"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-60 left-1/3 w-3 h-3 bg-gradient-to-br from-indigo-400 to-blue-600 rounded-full animate-bounce opacity-45"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-60 left-20 w-5 h-5 bg-gradient-to-br from-lime-400 to-green-600 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-3 h-3 bg-gradient-to-br from-rose-400 to-red-500 rounded-full animate-bounce opacity-45"
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "2.7s" }}
        ></div>

        {/* Enhanced Floating Particles - Layer 3 (Small & Scattered) */}
        <div
          className="absolute top-16 left-1/2 w-2 h-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "0.8s" }}
        ></div>
        <div
          className="absolute top-80 right-40 w-3 h-3 bg-gradient-to-br from-red-400 to-pink-500 rounded-full animate-pulse opacity-35"
          style={{ animationDelay: "1.8s" }}
        ></div>
        <div
          className="absolute bottom-20 left-40 w-2 h-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "2.3s" }}
        ></div>
        <div
          className="absolute top-1/4 right-1/4 w-3 h-3 bg-gradient-to-br from-fuchsia-400 to-violet-500 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/5 w-4 h-4 bg-gradient-to-br from-emerald-300 to-teal-500 rounded-full animate-bounce opacity-35"
          style={{ animationDelay: "2.8s" }}
        ></div>

        {/* New Colorful Particles - Layer 4 */}
        <div
          className="absolute top-28 right-1/5 w-2 h-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "0.3s" }}
        ></div>
        <div
          className="absolute top-3/4 left-1/6 w-3 h-3 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full animate-bounce opacity-45"
          style={{ animationDelay: "1.7s" }}
        ></div>
        <div
          className="absolute bottom-16 right-1/6 w-2 h-2 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "2.1s" }}
        ></div>
        <div
          className="absolute top-44 left-3/4 w-3 h-3 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full animate-bounce opacity-35"
          style={{ animationDelay: "3.2s" }}
        ></div>
        <div
          className="absolute bottom-44 right-3/4 w-2 h-2 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "0.7s" }}
        ></div>

        {/* New Colorful Particles - Layer 5 (Bright & Vibrant) */}
        <div
          className="absolute top-52 left-1/8 w-3 h-3 bg-gradient-to-br from-lime-300 to-green-400 rounded-full animate-bounce opacity-55"
          style={{ animationDelay: "1.1s" }}
        ></div>
        <div
          className="absolute top-72 right-1/8 w-2 h-2 bg-gradient-to-br from-coral-400 to-orange-500 rounded-full animate-pulse opacity-45"
          style={{ animationDelay: "2.9s" }}
        ></div>
        <div
          className="absolute bottom-52 left-3/5 w-4 h-4 bg-gradient-to-br from-magenta-400 to-fuchsia-500 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "0.4s" }}
        ></div>
        <div
          className="absolute top-96 right-2/5 w-2 h-2 bg-gradient-to-br from-turquoise-400 to-cyan-500 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "3.4s" }}
        ></div>
        <div
          className="absolute bottom-32 left-2/3 w-3 h-3 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-full animate-bounce opacity-35"
          style={{ animationDelay: "1.6s" }}
        ></div>

        {/* New Colorful Particles - Layer 6 (Rainbow Mix) */}
        <div
          className="absolute top-36 left-5/6 w-2 h-2 bg-gradient-to-br from-red-300 to-pink-400 rounded-full animate-pulse opacity-60"
          style={{ animationDelay: "0.9s" }}
        ></div>
        <div
          className="absolute top-64 right-5/6 w-3 h-3 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full animate-bounce opacity-45"
          style={{ animationDelay: "2.2s" }}
        ></div>
        <div
          className="absolute bottom-64 left-1/12 w-2 h-2 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "1.9s" }}
        ></div>
        <div
          className="absolute top-88 right-1/12 w-4 h-4 bg-gradient-to-br from-green-300 to-teal-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "3.7s" }}
        ></div>
        <div
          className="absolute bottom-88 left-11/12 w-2 h-2 bg-gradient-to-br from-violet-300 to-purple-400 rounded-full animate-pulse opacity-55"
          style={{ animationDelay: "0.2s" }}
        ></div>

        {/* Enhanced Corner accent particles */}
        <div
          className="absolute top-8 left-8 w-3 h-3 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full animate-bounce opacity-30"
          style={{ animationDelay: "1.4s" }}
        ></div>
        <div
          className="absolute top-8 right-8 w-2 h-2 bg-gradient-to-br from-violet-300 to-purple-400 rounded-full animate-pulse opacity-35"
          style={{ animationDelay: "2.6s" }}
        ></div>
        <div
          className="absolute bottom-8 left-8 w-2 h-2 bg-gradient-to-br from-emerald-300 to-green-400 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "0.9s" }}
        ></div>
        <div
          className="absolute bottom-8 right-8 w-3 h-3 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full animate-pulse opacity-30"
          style={{ animationDelay: "1.9s" }}
        ></div>

        {/* Enhanced Center area accent particles */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full animate-pulse opacity-25"
          style={{ animationDelay: "2.4s" }}
        ></div>
        <div
          className="absolute top-1/3 left-1/3 w-2 h-2 bg-gradient-to-br from-indigo-300 to-blue-400 rounded-full animate-bounce opacity-35"
          style={{ animationDelay: "3.1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/5 w-2 h-2 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "0.6s" }}
        ></div>

        {/* Additional scattered colorful particles */}
        <div
          className="absolute top-12 left-1/3 w-1 h-1 bg-gradient-to-br from-red-400 to-rose-500 rounded-full animate-bounce opacity-45"
          style={{ animationDelay: "1.3s" }}
        ></div>
        <div
          className="absolute top-56 right-1/7 w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-40"
          style={{ animationDelay: "2.8s" }}
        ></div>
        <div
          className="absolute bottom-12 left-2/3 w-1 h-1 bg-gradient-to-br from-lime-400 to-green-500 rounded-full animate-bounce opacity-50"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="absolute top-24 right-2/3 w-3 h-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full animate-pulse opacity-35"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute bottom-56 left-1/7 w-2 h-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-bounce opacity-45"
          style={{ animationDelay: "1.8s" }}
        ></div>
      </div>

      <main className="flex-grow relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-10 mt-14">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms and Conditions
            </h1>
            {/* <p className="text-gray-600 text-lg">Last Updated: [Insert Date]</p> */}
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 relative z-20">
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Welcome to <b>Pioneer Writers</b>. By accessing or using our
                website, blog, application, or services (collectively, the
                "Services"), you agree to be bound by these Terms and Conditions
                ("Terms"). Please read them carefully before using our Services.
              </p>

              {/* Section 1 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Eligibility
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 18 years old, or the age of majority in
                  your jurisdiction, to use our Services. By using our Services,
                  you represent and warrant that you meet these requirements.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Accounts and Registration
                </h2>
                <ul className="text-gray-700 space-y-3 leading-relaxed">
                  <li>
                    To access certain features, you may be required to register
                    and create an account.
                  </li>
                  <li>
                    You agree to provide accurate, current, and complete
                    information during registration.
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account login credentials and all activities under your
                    account.
                  </li>
                  <li>
                    We reserve the right to suspend or terminate accounts that
                    provide false information or violate these Terms.
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Acceptable Use
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  You agree not to:
                </p>
                <ul className="text-gray-700 space-y-3 leading-relaxed">
                  <li>
                    Use the Services for unlawful, harmful, or fraudulent
                    activities.
                  </li>
                  <li>
                    Upload or transmit viruses, malware, or other harmful code.
                  </li>
                  <li>
                    Interfere with the security, availability, or operation of
                    the Services.
                  </li>
                  <li>
                    Attempt to access data or accounts that do not belong to
                    you.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Purchases and Payments
                </h2>
                <ul className="text-gray-700 space-y-3 leading-relaxed">
                  <li>
                    If you purchase products or services through our site, you
                    agree to provide valid payment information.
                  </li>
                  <li>
                    Payments are processed securely through third-party
                    gateways; we do not store your credit card details.
                  </li>
                  <li>
                    All purchases are final unless otherwise stated in a
                    specific refund policy.
                  </li>
                </ul>
              </section>

              {/* Section 5 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Intellectual Property
                </h2>
                <ul className="text-gray-700 space-y-3 leading-relaxed">
                  <li>
                    All content on the Services, including text, graphics,
                    logos, and software, is owned by or licensed to us.
                  </li>
                  <li>
                    You may not copy, modify, distribute, sell, or exploit our
                    content without prior written consent.
                  </li>
                  <li>
                    You retain ownership of content you submit but grant us a
                    worldwide, non-exclusive license to use it in connection
                    with providing our Services.
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Privacy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy
                  Policy to understand how we collect, use, and protect your
                  personal information. By using the Services, you consent to
                  our Privacy Policy.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Third-Party Services
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Our Services may contain links to third-party websites. We are
                  not responsible for the content, policies, or practices of
                  third parties.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Disclaimers
                </h2>
                <ul className="text-gray-700 space-y-3 leading-relaxed">
                  <li>Our Services are provided "as is" and "as available."</li>
                  <li>
                    We make no warranties, express or implied, regarding the
                    availability, reliability, or suitability of the Services.
                  </li>
                  <li>
                    To the fullest extent permitted by law, we disclaim all
                    liability for damages arising from your use of the Services.
                  </li>
                </ul>
              </section>

              {/* Section 9 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We shall not be liable for any indirect, incidental, or
                  consequential damages arising from your use of the Services,
                  even if we have been advised of the possibility of such
                  damages.
                </p>
              </section>

              {/* Section 10 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  10. Termination
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may suspend or terminate your account or access to the
                  Services at our discretion if you violate these Terms or use
                  the Services in a manner that could harm us or others.
                </p>
              </section>

              {/* Section 11 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  11. Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed under the laws
                  of [Insert State/Country], without regard to conflict of law
                  principles.
                </p>
              </section>

              {/* Section 12 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  12. Changes to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update these Terms from time to time. We will notify
                  users by updating the "Last Updated" date above. Continued use
                  of the Services after changes indicates acceptance of the new
                  Terms.
                </p>
              </section>

              {/* Section 13 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  13. Contact Us
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-2">
                    If you have any questions about these Terms, please contact
                    us at:
                  </p>
                  <div className="pl-4 border-l-4 border-purple-200">
                    <p>PioneerWriters</p>
                    <p>team@pioneerwriters.com</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Animated Background Waves - Now positioned below the content */}
      <div className="relative z-0 overflow-hidden pointer-events-none">
        {/* Top wave */}
        <svg
          className="w-full h-[200px] opacity-15"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
          </defs>
          <path
            d="M0,200 Q250,50 500,200 T1000,200 L1000,0 L0,0 Z"
            fill="url(#wave1)"
            className="animate-pulse"
          />
        </svg>

        {/* Bottom wave */}
        <svg
          className="w-full h-[200px] opacity-10 -mt-20"
          viewBox="0 0 1000 200"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
          <path
            d="M0,0 Q250,150 500,0 T1000,0 L1000,200 L0,200 Z"
            fill="url(#wave2)"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>
      </div>

      <Footer />
    </div>
  );
}

export default FairUsePolicy;
