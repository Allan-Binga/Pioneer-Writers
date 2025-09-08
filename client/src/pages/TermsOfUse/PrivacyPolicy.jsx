import LandingNav from "../../components/LandingNav";
import Footer from "../../components/Footer";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col relative overflow-hidden">
      <LandingNav />

      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating Particles - Layer 1 (Large) */}
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

        {/* Floating Particles - Layer 2 (Medium) */}
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

        {/* Floating Particles - Layer 3 (Small & Scattered) */}
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

        {/* Additional colorful particles */}
        <div
          className="absolute top-52 left-1/8 w-3 h-3 bg-gradient-to-br from-lime-300 to-green-400 rounded-full animate-bounce opacity-55"
          style={{ animationDelay: "1.1s" }}
        ></div>
        <div
          className="absolute top-72 right-1/8 w-2 h-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-pulse opacity-45"
          style={{ animationDelay: "2.9s" }}
        ></div>
        <div
          className="absolute bottom-52 left-3/5 w-4 h-4 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-full animate-bounce opacity-40"
          style={{ animationDelay: "0.4s" }}
        ></div>
        <div
          className="absolute top-96 right-2/5 w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "3.4s" }}
        ></div>

        {/* Corner accent particles */}
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
      </div>

      <main className="flex-grow relative z-10">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-10 mt-14">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg">
              Your privacy is important to us
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 relative z-20">
            <div className="prose prose-gray max-w-none">
              {/* Introduction */}
              <section className="mb-10">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  This privacy policy has been compiled to better serve those
                  who are concerned with how their 'Personally identifiable
                  information' (PII) is being used online. PII, as used in US
                  privacy law and information security, is information that can
                  be used on its own or with other information to identify,
                  contact, or locate a single person, or to identify an
                  individual in context.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Please read our privacy policy carefully to get a clear
                  understanding of how we collect, use, protect or otherwise
                  handle your Personally Identifiable Information in accordance
                  with our website.
                </p>
              </section>

              {/* Section 1 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  What personal information do we collect?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  When ordering or registering on our site, as appropriate, you
                  may be asked to enter your name, email address, mailing
                  address, phone number, credit card information or other
                  details to help you with your experience.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  When do we collect information?
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We collect information from you when you register on our site,
                  place an order, fill out a form or enter information on our
                  site.
                </p>
              </section>

              {/* Section 3 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  How do we use your information?
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  We may use the information we collect from you when you
                  register, make a purchase, sign up for our newsletter, respond
                  to a survey or marketing communication, surf the website, or
                  use certain other site features in the following ways:
                </p>
                <ul className="text-gray-700 space-y-3 leading-relaxed">
                  <li>
                    To personalize user's experience and to allow us to deliver
                    the type of content and product offerings in which you are
                    most interested.
                  </li>
                  <li>
                    To allow us to better service you in responding to your
                    customer service requests.
                  </li>
                  <li>To quickly process your transactions.</li>
                  <li>
                    To send periodic emails regarding your order or other
                    products and services.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  How do we protect visitor information?
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>
                    Our website is scanned regularly for security holes and
                    known vulnerabilities to make your visit to our site as safe
                    as possible.
                  </p>
                  <p>
                    We use regular Malware Scanning services offered by SiteLock
                    Limited, a leading web security company.
                  </p>
                  <p>
                    Your personal information is contained behind secured
                    networks and is only accessible by a limited number of
                    persons who have special access rights to such systems and
                    are required to keep the information confidential. In
                    addition, all sensitive/credit information you supply is
                    encrypted via Secure Socket Layer (SSL) technology.
                  </p>
                  <p>
                    We implement a variety of security measures when a user
                    places an order enters, submits, or accesses their
                    information to maintain the safety of your personal
                    information.
                  </p>
                  <p>
                    All transactions are processed through a gateway provider
                    and are not stored or processed on our servers.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Do we use 'cookies'?
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>We do not use cookies for tracking purposes.</p>
                  <p>
                    You can choose to have your computer warn you each time a
                    cookie is being sent, or you can choose to turn off all
                    cookies. You do this through your browser (like Google
                    Chrome) settings. Each browser is a little bit different, so
                    look at your browser's Help menu to learn the correct way to
                    modify your cookies.
                  </p>
                  <p>
                    If you disable cookies, some features will be disabled that
                    make your site experience more efficient and some of our
                    services will not function properly. However, you can still
                    place orders.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Third Party Disclosure
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We do not sell, trade, or otherwise transfer to outside
                  parties your personally identifiable information.
                </p>
              </section>

              {/* Section 7 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Third Party Links
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We do not include or offer third party products or services on
                  our website.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  California Online Privacy Protection Act (CalOPPA)
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  CalOPPA is the first state law in the nation to require
                  commercial websites and online services to post a privacy
                  policy. The law's reach stretches well beyond California to
                  require a person or company in the United States (and
                  conceivably the world) that operates websites collecting
                  personally identifiable information from California consumers
                  to post a conspicuous privacy policy on its website stating
                  exactly the information being collected and those individuals
                  with whom it is being shared, and to comply with this policy.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Do Not Track Signals
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>
                    We honor do not track signals and do not track, plant
                    cookies, or use advertising when a Do Not Track (DNT)
                    browser mechanism is in place.
                  </p>
                  <p>
                    It's also important to note that we do not allow third-party
                    behavioral tracking.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  COPPA (Children Online Privacy Protection Act)
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>
                    When it comes to the collection of personal information from
                    children under 13, the Children's Online Privacy Protection
                    Act (COPPA) puts parents in control. The Federal Trade
                    Commission, the nation's consumer protection agency,
                    enforces the COPPA Rule, which spells out what operators of
                    websites and online services must do to protect children's
                    privacy and safety online.
                  </p>
                  <p>We do not specifically market to children under 13.</p>
                </div>
              </section>

              {/* Section 11 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Fair Information Practices
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>
                    The Fair Information Practices Principles form the backbone
                    of privacy law in the United States and the concepts they
                    include have played a significant role in the development of
                    data protection laws around the globe. Understanding the
                    Fair Information Practice Principles and how they should be
                    implemented is critical to comply with the various privacy
                    laws that protect personal information.
                  </p>
                  <p>
                    In order to be in line with Fair Information Practices we
                    will take the following responsive action, should a data
                    breach occur:
                  </p>
                  <ul className="space-y-2">
                    <li>
                      We will notify the users via email within 1 business day
                    </li>
                    <li>
                      We will notify users via phone call within 1 business day
                    </li>
                  </ul>
                  <p>
                    We also agree to the individual redress principle, which
                    requires that individuals have a right to pursue legally
                    enforceable rights against data collectors and processors
                    who fail to adhere to the law. This principle requires not
                    only that individuals have enforceable rights against data
                    users, but also that individuals have recourse to courts or
                    a government agency to investigate and/or prosecute
                    non-compliance by data processors.
                  </p>
                </div>
              </section>

              {/* Section 12 */}
              <section className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  CAN-SPAM Act
                </h2>
                <div className="text-gray-700 space-y-4 leading-relaxed">
                  <p>
                    The CAN-SPAM Act is a law that sets the rules for commercial
                    email, establishes requirements for commercial messages,
                    gives recipients the right to have emails stopped from being
                    sent to them, and spells out tough penalties for violations.
                  </p>

                  <div>
                    <p className="font-semibold mb-2">
                      We collect your email address in order to:
                    </p>
                    <ul className="space-y-2">
                      <li>
                        Send information, respond to inquiries, and/or other
                        requests or questions
                      </li>
                      <li>
                        Process orders and send information and updates on
                        orders
                      </li>
                      <li>
                        Send you additional information related to your product
                        and/or service
                      </li>
                      <li>
                        Market to our mailing list or continue to send emails to
                        our clients after the original transaction has occurred
                      </li>
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">
                      To be in accordance with CAN-SPAM we agree to the
                      following:
                    </p>
                    <ul className="space-y-2">
                      <li>
                        NOT use false, or misleading subjects or email addresses
                      </li>
                      <li>
                        Identify the message as an advertisement in some
                        reasonable way
                      </li>
                      <li>
                        Include the physical address of our business or site
                        headquarters
                      </li>
                      <li>
                        Monitor third-party email marketing services for
                        compliance, if one is used
                      </li>
                      <li>Honor opt-out/unsubscribe requests quickly</li>
                      <li>
                        Allow users to unsubscribe by using the link at the
                        bottom of each email
                      </li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-200">
                    <p className="font-semibold text-purple-900 mb-2">
                      Unsubscribe
                    </p>
                    <p className="text-purple-800">
                      If at any time you would like to unsubscribe from
                      receiving future emails, you can follow the instructions
                      at the bottom of each email and we will promptly remove
                      you from ALL correspondence.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
