import LandingNav from "../../components/LandingNav";
import Footer from "../../components/Footer";
import PlaceAnOrderImage from "../../assets/placeorder.webp";
import PayForItImage from "../../assets/payforit.webp";
import WeWorkOnIt from "../../assets/weworkonit.webp";
import YouAceThePaper from "../../assets/youacethepaper.webp";
import AllYouNeed from "../../assets/allyouneed.webp";

function PioneerHome() {
  return (
    <div>
      <LandingNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 overflow-hidden">
        {/* Background Pattern/Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-sm"></div>
          <div className="absolute bottom-32 right-20 w-24 h-24 bg-white rounded-full blur-sm"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white rounded-full blur-sm"></div>
        </div>

        <div className="container mx-auto px-6 py-16 lg:py-24 mt-10 relative z-10">
          <div className="text-center text-white space-y-8">
            {/* Main Headline */}
            <h1 className="text-xl md:text-5xl lg:text-5xl font-bold leading-tight">
              "Finally! An academic help partner{" "}
              <span className="block">you can trust."</span>
            </h1>

            {/* Subheading */}
            <p className="text-sm md:text-2xl lg:text-md text-white/90 max-w-4xl mx-auto leading-relaxed">
              All our experts are native English speakers and graduates of
              prestigious universities in the US.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-full text-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[200px] cursor-pointer">
                ASSIGNMENT HELP
              </button>

              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-full text-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[200px] cursor-pointer">
                FULL CLASS HELP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/*Second Section With Countdowns - Completed Orders, Writers Available, Orders in Progress, Satisfaction Rate*/}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl md:text-6xl font-bold text-green-500 mb-2">
                456791
              </div>
              <p className="text-gray-600 font-semibold">Completed Orders</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-orange-500 mb-2">
                210564
              </div>
              <p className="text-gray-600 font-semibold">Customers Served</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-blue-400 mb-2">
                121
              </div>
              <p className="text-gray-600 font-semibold">Orders In Progress</p>
            </div>
            <div>
              <div className="text-5xl md:text-6xl font-bold text-purple-500 mb-2">
                99%
              </div>
              <p className="text-gray-600 font-semibold">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* What do We Offer Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What do we offer?
            </h2>
          </div>

          {/* Offer Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Assignment Help Card */}
            <div className="text-center p-8 bg-white rounded-lg">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Assignment Help
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  We assist college students who often feel overwhelmed by their
                  coursework and seek help with assignments.
                </p>
                <button className="bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-500 hover:to-purple-500 text-white font-semibold px-6 py-2 rounded-full text-sm transition-all cursor-pointer duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                  GET STARTED
                </button>
              </div>
            </div>

            {/* Full Class Help Card */}
            <div className="text-center p-8 bg-white rounded-lg">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-10 h-10 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Full Class Help
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  We help online students by managing their classes and
                  completing all assignments and discussions for them.
                </p>
                <button className="bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-full text-sm transition-all cursor-pointer duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                  GET STARTED
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How do you get help Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How do you get help?
            </h2>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Step 1: Place an Order */}
            <div className="text-center">
              <div className="mb-4">
                <img
                  src={PlaceAnOrderImage}
                  alt="Place an Order"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  1. Place an Order
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Visit the order page and fill out the form. The price updates
                  as you enter details.
                </p>
              </div>
            </div>

            {/* Step 2: Pay for it */}
            <div className="text-center">
              <div className="mb-4">
                <img
                  src={PayForItImage}
                  alt="Pay for it"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  2. Pay for it
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The price is calculated based on academic level, deadline,
                  pages, and writer quality.
                </p>
              </div>
            </div>

            {/* Step 3: We work on it */}
            <div className="text-center">
              <div className="mb-4">
                <img
                  src={WeWorkOnIt}
                  alt="We work on it"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  3. We work on it
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  After payment, your order is assigned to the best available
                  writer.
                </p>
              </div>
            </div>

            {/* Step 4: You ace the paper */}
            <div className="text-center">
              <div className="mb-4">
                <img
                  src={YouAceThePaper}
                  alt="You ace the paper"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  4. You ace the paper
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A professionally prepared document will be emailed to you
                  before the deadline.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              GET STARTED
            </button>
          </div>
        </div>
      </section>

      {/* We are all you need Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                We are all you need!
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our company connects you with highly qualified experts in your
                  academic field to support you throughout your educational
                  journey. We ensure that all instructions are followed in
                  detail, and the orders are delivered on time.
                </p>

                <p>
                  The entire process is anonymous and risk-free, as your
                  information is not shared with any third parties, including
                  the experts handling your order.
                </p>

                <p>
                  Can you not afford the full payment up front? DON'T STRESS!
                  You can opt to make a{" "}
                  <span className="font-semibold text-gray-800">
                    20% payment upfront
                  </span>
                  , and an invoice for the rest of the payment will be sent to
                  you after the work is done.
                </p>
              </div>

              <div className="pt-4">
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  GET HELP NOW
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center">
              <img
                src={AllYouNeed}
                alt="We are all you need"
                className="w-full max-w-lg h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dotted Divider
      <div className="py-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="border-t-2 border-dotted border-gray-300"></div>
        </div>
      </div> */}

      {/* We are proficient in Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              We are proficient in:
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Column 1 */}
            <div className="space-y-3">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Essays
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Annotated Bibliography
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Assignments
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Case Studies
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Creative Thinking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Formatting
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Online Classes
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Grant Proposal Writing
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Capstone Projects
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Computer Programming (Java, C++, HTML etc.)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Personal Statements
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Presentations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Projects
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Resumes, cover letters and LinkedIn Revamp
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-3">
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Reaction Papers
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Reports
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Research Papers
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Reviews
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Speeches
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Thesis Papers
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Mathematics
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              PLACE AN ORDER →
            </button>
          </div>
        </div>
      </section>

      {/* Join the 210,000+ Section */}
      <section className="py-16 px-6 bg-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Join the <span className="text-yellow-500">210,000+</span> Who Have
            Used Pioneer Writers to Save Their Grades.
          </h2>

          <div className="pt-4">
            <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              GET A DISCOUNT
            </button>
          </div>
        </div>
      </section>

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

export default PioneerHome;
