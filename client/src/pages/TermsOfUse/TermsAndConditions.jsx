import LandingNav from "../../components/LandingNav";
import Footer from "../../components/Footer";

function TermsAndConditions() {
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

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <a
          href="#"
          className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors duration-200"
          aria-label="WhatsApp us"
        >
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488" />
          </svg>
          <span className="text-sm font-medium">WhatsApp us</span>
        </a>
      </div>
      <Footer />
    </div>
  );
}

export default TermsAndConditions;
