import { useState } from "react";
import LandingNav from "../../components/LandingNav";
import Footer from "../../components/Footer";
import FAQImage from "../../assets/faqs.webp";

function Faqs() {
  // State to track which FAQ is open (null means all are closed)
  const [openFaq, setOpenFaq] = useState(null);

  // FAQ data organized into categories
  const faqData = [
    {
      category: "General Order Information",
      questions: [
        {
          question: "What grade levels do you do?",
          answer:
            "Pioneer Writers does papers for every academic level, including high school and Ph.D. We also provide help in all domains, including Medicine and Rocket Science. We also write content for blogs and websites.",
        },
        {
          question: "How much do I need to pay for my essay?",
          answer:
            "The pricing depends on the urgency of the work, academic level, and the number of pages/slides. We charge as low as $12. We are always open to providing coupon codes to ensure you can afford our services even when the times are tough.",
        },
        {
          question: "What is the best essay-writing platform?",
          answer:
            "Pioneer Writers is the best essay writing platform online. We ensure that the client’s interests come first. Therefore, our customer team is always online to handle your queries, and we hire the best professionals to handle your assignments. Our writers are native English Speakers and are constantly trained to ensure they are well-versed with the latest formatting and research methods.",
        },
        {
          question: "Can I get free essays on Pioneer Writers?",
          answer:
            "No, all our essays and articles are paid for. However, we provide affordable prices for our clients to ensure everyone can afford to order with us and benefit from our passionate team of professionals. We also offer discount coupons of up to 50% to our loyal and new customers. All you need to do is reach out to our customer support team or subscribe to our newsletters to receive them in your emails.",
        },
        {
          question: "How do Pioneer Writers work?",
          answer:
            "Pioneer Writers provides academic help and content writing services to clients worldwide. We do research projects, dissertations, PowerPoint slides, solve math problems, write articles, and more. All you need to do is sign up with us, then place an order and pay for us to assign the order to the most suitable writer. According to the guidelines, all papers are written from scratch by professionals in the specific domain. We ensure that all the instructions are followed accordingly and that they are correctly formatted. We do not condone any plagiarism cases.",
        },
        {
          question: "Are Pioneer Writers’ services legit?",
          answer:
            "Pioneer Writers is a genuine company with many completed orders. We have provided academic services to several students. Some of these clients have already graduated with top-quality grades. We have clients from top universities, including Harvard, Yale, and many more. To prove this, check out our reviews on Sitejabber; most of them are verified by the company, meaning they have been written by clients who have ordered with us. We may not have many reviews on there, but the few we have are legit.",
        },
        {
          question:
            "My essay requires using a specific book and many other sources. Is that okay?",
          answer:
            "You are free to provide the writer with the required book. It can be an eBook or any other. You can even send the pages required as pictures or screenshots. Do not forget to attach the name of the book for reference. You will have to pay more if we source the book for you. Our customer support team can guide you on this.",
        },
        {
          question: "Can Pioneer Writers take and complete my online class?",
          answer:
            "Absolutely! Pioneer Writers can log in to your online class portal and handle your assignments on your behalf at a fee. We have laid measures to ensure that your online class is dealt with under the supervision of our team and that your assignments are completed and submitted on time. Also, our team ensures that your information does not leak at all and that there is no suspicion by your school. We have completed over 200 classes and achieved the best grades. Try us today.",
        },
      ],
    },
    {
      category: "Writer Information",
      questions: [
        {
          question: "Who are your writers/experts?",
          answer:
            "All Pioneer Writers experts are passionate top professionals in their respective fields qualified from top universities in the US and the UK. We vet all our writers and perform due diligence to ensure that the degrees and diplomas submitted are genuine. This is why we prefer to assign the work to the writers on our own since we know the strengths and weaknesses of our experts. Order today to enjoy the top cream in the essay and article writing industry.",
        },
        {
          question: "Where is my writer from?",
          answer:
            "We hire Native English Writers as our writers. Therefore, all our writers are based in the US, UK, Canada and Australia.",
        },
      ],
    },
    {
      category:
        "Payment, Order Cancellation, Plagiarism, and Confidentiality Issues",
      questions: [
        {
          question: "Is it safe to order essays online?",
          answer:
            "Absolutely! Pioneer Writers provides the best quality online essay writing services and ensures your information is safe. Never should you worry about blackmail or fraud cases once you order with us.",
        },
        {
          question:
            "Do I need to pay more to get the best essay or customer support?",
          answer:
            "No, we provide equal treatment to all our clients. We ensure that every Pioneer Writers customer can access customer support 24/7, talk to their writer at any time, access us on Text Messages, Whatsapp, and other social media anytime, and get a reply within the shortest time possible. Unlike on our competitor sites, you will need to pay more for VIP support. Any amount you pay qualifies you to get a native English speaker as your writer. You do not need to worry.",
        },
        {
          question: "Is Pioneer Writers safe & confidential?",
          answer:
            "Ordering with us is 100% safe and confidential as we ensure your details are well protected from everyone, including the quality management team and the writing experts. When you order with us, your name does not reflect anywhere. We also do not share nor sell contact details with any third party. This is to prevent fraud and other scam cases. All our payments are also processed on PayPal. This means that you, as a buyer, are protected by the PayPal buyer protection clause. We strongly advise you not to share personal information like emails and contacts with the writers through the order chat section for safety.",
        },
        {
          question: "Is quality work guaranteed?",
          answer:
            "Once you place an order with us, you are guaranteed quality, well-formatted work. We allow unlimited revisions to ensure that the final product is according to your liking. Feel free to ask for slight changes to ensure your work achieves the best grade.",
        },
        {
          question: "Do Pioneer Writers provide plagiarism-free work?",
          answer:
            "Yes, all our essays and articles are written from scratch. We also pass the papers through Grammarly and Turnitin to prevent any cases of plagiarism. We also provide plagiarism reports to clients on request to ascertain originality.",
        },
        {
          question: "Do I have a money-back guarantee?",
          answer:
            "Yes, you do. Rarely, clients may not be satisfied with the submission; in these instances, we will gladly refund. All you need to do is contact the customer support team for guidance. However, we advise you to try the unlimited revisions option before raising a dispute.",
        },
        {
          question: "What payment methods do Pioneer Writers accept?",
          answer:
            "We accept all payment methods, including PayPal, credit cards, debit cards, visa, and Master cards. All these methods are processed through PayPal.",
        },
      ],
    },
  ];

  // Toggle FAQ item
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      <LandingNav />
      <section className="relative bg-gradient-to-br from-purple-400 to-purple-500 overflow-hidden">
        {/* Main Content Container */}
        <div className="container mx-auto px-6 py-16 lg:py-24 mt-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl lg:text-5xl font-bold">
                Frequently Asked Questions
              </h1>
              <div className="space-y-4 text-white/90">
                <p className="text-lg leading-relaxed">
                  This section contains a wealth of information concerning
                  Pioneer Writers and its services. If you cannot find an answer
                  to your question, kindly contact us via the chat box at the
                  bottom right of this page.
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
                  src={FAQImage}
                  alt="FAQ"
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

      {/* Interactive FAQ Section */}
      <section className="container mx-auto px-6 py-12">
        {faqData.map((category, catIndex) => (
          <div key={catIndex} className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, index) => {
                const faqIndex = `${catIndex}-${index}`;
                return (
                  <div
                    key={faqIndex}
                    className="border-b border-gray-200 bg-white rounded-lg shadow-sm"
                  >
                    <button
                      className="w-full text-left py-4 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => toggleFaq(faqIndex)}
                    >
                      <span className="font-semibold text-gray-800">
                        {faq.question}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                          openFaq === faqIndex ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openFaq === faqIndex && (
                      <div className="px-6 py-4 text-gray-600 font-stretch-semi-expanded">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Contact Support Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">
            Can't find what you're looking for?
          </p>
          <a href="/contact-us">
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-700 hover:to-emerald-800 cursor-pointer text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Contact Support
            </button>
          </a>
        </div>
      </section>

      {/* Promotional CTA Section */}
      <section className="relative bg-gradient-to-r from-purple-400 to-purple-500 py-16 overflow-hidden">
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

export default Faqs;
