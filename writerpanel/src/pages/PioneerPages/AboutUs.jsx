import LandingNav from "../../components/LandingNav";
import Footer from "../../components/Footer";
import AboutUsImage from "../../assets/aboutus.webp";

function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-400 to-purple-500 overflow-hidden">
        {/* Main Content Container */}
        <div className="container mx-auto px-6 py-16 lg:py-24 mt-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold">About Us</h1>
              <div className="space-y-4 text-white/90">
                <p className="text-md leading-relaxed">
                  Thank you for visiting Pioneer Writers. Suppose you are
                  looking for assistance in academic writing, whether it is an
                  essay you want to write. In that case, dissertation help you
                  have been looking for, or any proofreading and editing
                  services you wanted – You have come to the right place!
                </p>
              </div>
              {/* Social Media Icons */}
              <div className="flex space-x-3 pt-4">
                <a
                  href="https://www.facebook.com/pioneerwriters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 text-white rounded-md flex items-center justify-center hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-md"
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
                <a
                  href="https://x.com/pioneerwriters_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black text-white rounded-md flex items-center justify-center hover:bg-gray-800 transition-all duration-200 hover:scale-110 shadow-md"
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
                <a
                  href="https://www.instagram.com/pioneerwriters/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-110 shadow-md"
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
                <a
                  href="https://www.linkedin.com/company/pioneer-writers/"
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-md flex items-center justify-center transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            {/* Right Side - Image/Illustration */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <img
                  src={AboutUsImage}
                  alt="About Us"
                  className="w-full max-w-md lg:max-w-lg object-contain"
                />
              </div>
            </div>
          </div>
        </div>
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
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-6 bg-gray-50">
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
              <div className="text-5xl md:text-6xl font-bold text-purple-500 mb-2">
                99%
              </div>
              <p className="text-gray-600 font-semibold">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              What is Pioneer Writers? Simple – a writing company found to
              provide quality, timely, and plagiarism-free academic writing and
              editing services.
            </h2>
          </div>

          {/* Detailed Description */}
          <div className="mb-16">
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              We specialise in completing your research and development (R&D)
              projects, content writing projects, professional videos, design
              projects, literature reviews, essays, reports, scientific posters,
              exam notes, statistical analysis, primary and secondary research,
              and Case Studies. Therefore, each assignment is given the
              attention and quality it deserves. Since incorporation, our team
              of expert academic writers has provided custom academic research,
              writing, statistical analysis, editing, and proofreading services
              to thousands of students around the world.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              Regardless of how complex or urgent your requirements may be, our
              team is ready to help you achieve your desired outcomes. We
              maintain the highest standards of quality and professionalism in
              everything we do. Our services have been carefully designed to
              address the diverse needs of our clients across different sectors
              and industries.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                100% Risk Free. Client Privacy Guaranteed.
              </h3>
              <p className="text-gray-600 text-sm">
                Our company maintains strict confidentiality and does not share
                client information with third parties.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Strict Adherence to Instructions & Deadlines.
              </h3>
              <p className="text-gray-600 text-sm">
                We ensure all instructions are followed precisely and deadlines
                are consistently met.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Your Work is Handled by a Qualified Expert.
              </h3>
              <p className="text-gray-600 text-sm">
                We only assign work to professionals with expertise in the
                respective fields.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a href="/sign-in">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-12 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105">
                TRY OUR SERVICES
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gradient-to-r from-teal-400 to-blue-500 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10">
            Join the <span className="text-yellow-300">210,000+</span> Who Have
            Trusted Us to Deliver Excellence.
          </h2>
          <a href="/sign-up">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-105">
              GET STARTED TODAY
            </button>
          </a>
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

export default AboutUs;
