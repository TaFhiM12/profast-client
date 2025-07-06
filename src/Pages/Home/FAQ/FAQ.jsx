import { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, Zap } from 'lucide-react';
import axios from 'axios';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [faqs , setFaqs] = useState([]);

  useEffect( () => {
    axios('./faq.json')
    .then(res => setFaqs(res.data))
    .catch( error => console.log(error))
  } , [])


  const categories = ['All', ...new Set(faqs.map(faq => faq.category))];
  const filteredFaqs = activeCategory === 'All' ? faqs : faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-lime-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-lime-100 rounded-full mb-4">
            <Zap className="w-5 h-5 text-lime-600 mr-2" />
            <span className="text-sm font-medium text-lime-600">Get Answers</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about our platform. Can't find what you're looking for?
            <a href="#contact" className="text-lime-600 hover:text-lime-800 ml-1 font-medium">Contact our team</a>.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-lime-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-lime-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${
                activeIndex === index 
                  ? 'bg-white shadow-lg border-lime-200 border-l-4' 
                  : 'bg-white hover:bg-lime-50'
              } ${faq.highlight ? 'ring-1 ring-lime-300' : ''}`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-start">
                  <HelpCircle className={`w-5 h-5 ${faq.highlight ? 'text-lime-600' : 'text-gray-400'} mr-4 mt-0.5 flex-shrink-0`} />
                  <div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded mb-2 inline-block ${
                      faq.highlight 
                        ? 'bg-lime-100 text-lime-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    activeIndex === index 
                      ? 'transform rotate-180 text-lime-600' 
                      : 'text-gray-400'
                  }`}
                />
              </button>
              <div 
                className={`px-6 pb-6 transition-all duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}
                style={{ marginLeft: '2.25rem' }}
              >
                <div className="prose text-gray-600">
                  <p>{faq.answer}</p>
                </div>
                {faq.highlight && (
                  <div className="mt-4 bg-lime-50 p-4 rounded-lg border border-lime-100">
                    <h4 className="text-sm font-medium text-lime-800 mb-2">Popular options:</h4>
                    <div className="flex flex-wrap gap-2">
                      {faq.category === 'Integrations' 
                        ? ['Slack', 'Salesforce', 'Zapier'].map((item, i) => (
                            <span key={i} className="text-xs bg-white px-3 py-1 rounded-full border border-lime-200 text-lime-700">
                              {item}
                            </span>
                          ))
                        : ['Custom SLA', 'Dedicated Manager', 'Priority Support'].map((item, i) => (
                            <span key={i} className="text-xs bg-white px-3 py-1 rounded-full border border-lime-200 text-lime-700">
                              {item}
                            </span>
                          ))
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-lime-200 p-8 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-lime-100 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-lime-600 mr-2" />
            <span className="text-sm font-medium text-lime-600">Need Help?</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or issues you might have.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Contact Support
            </button>
            <button className="px-6 py-3 border border-lime-300 hover:border-lime-400 text-lime-700 font-medium rounded-lg transition-colors duration-200 bg-white flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Schedule Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;