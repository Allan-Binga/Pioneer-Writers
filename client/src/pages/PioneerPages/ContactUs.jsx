import LandingNav from "../../components/LandingNav";
import Footer from "../../components/Footer";
import ContactUsImage from "../../assets/contactusimage.webp";
import { MessagesSquare, Send, MessageCircleQuestionMark } from "lucide-react";

function ContactUs() {
  return (
    <div>
      <LandingNav />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-400 to-teal-500 overflow-hidden">
        {/* Main Content Container */}
        <div className="container mx-auto px-6 py-16 lg:py-24 mt-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Image/Illustration */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative">
                <img
                  src={ContactUsImage}
                  alt="Contact Us"
                  className="w-full max-w-md lg:max-w-lg object-contain"
                />
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold">Contact Us</h1>

              <div className="space-y-4 text-white/90">
                <p className="text-lg leading-relaxed">
                  Please send us your questions, comments, or suggestions - we'd
                  love to hear from you! We've also included a short FAQ below
                  for your convenience.
                </p>

                <p className="text-base leading-relaxed">
                  If you cannot find an answer to your question, kindly contact
                  us via the chat box at the bottom right of this page,
                  WhatsApp, our email: team@pioneerwriters.com, or our 24/7
                  hotline +1-646-980-2326.
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-3 pt-4">
                {/* Facebook */}
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

                {/* Twitter/X */}
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

                {/* Instagram */}
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

                {/* LinkedIn */}
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

      {/* Info Cards Section - Updated to match image design */}
      <section className="relative bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 - Live Chat Support */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center group hover:-translate-y-1">
              <div className="flex justify-center items-center mb-6 w-16 h-16 bg-green-50 rounded-2xl mx-auto group-hover:bg-green-100 transition-colors duration-300">
                <MessagesSquare className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Live Chat Support
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with a live agent for instant answers 24/7.
              </p>
            </div>

            {/* Card 2 - Submit a Request */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center group hover:-translate-y-1">
              <div className="flex justify-center items-center mb-6 w-16 h-16 bg-yellow-50 rounded-2xl mx-auto group-hover:bg-yellow-100 transition-colors duration-300">
                <Send className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Submit a Request
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get expert answers and technical assistance directly to your
                inbox.
              </p>
            </div>

            {/* Card 3 - FAQs Center */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center group hover:-translate-y-1">
              <div className="flex justify-center items-center mb-6 w-16 h-16 bg-blue-50 rounded-2xl mx-auto group-hover:bg-blue-100 transition-colors duration-300">
                <MessageCircleQuestionMark className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                FAQs Center
              </h3>
              <p className="text-gray-600 leading-relaxed">
                24/7 access to a library of frequently asked questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional CTA Section */}
      <section className="relative bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-500 py-16 overflow-hidden">
        {/* Curved Top Border */}
        <div className="absolute top-0 left-0 w-full">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-16"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              fill="rgb(243 244 246)"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
            Join the <span className="text-yellow-300">210,000+</span> Who Have
            Used Pioneer Writers to Save Their Grades.
          </h2>

          <a
            href="/sign-up
"
          >
            <button className="bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-700 hover:to-purple-800 cursor-pointer text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              GET STARTED NOW
            </button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ContactUs;
