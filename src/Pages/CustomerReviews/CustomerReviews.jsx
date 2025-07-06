import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import axios from 'axios';
import faq from '../../assets/customer-top.png'

const ProfessionalCardSlider = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [testimonials , setTestimonials] = useState([]);
  

  useEffect( () => {
    axios('./customerReviews.json')
    .then( res => setTestimonials(res.data))
    .catch(error => console.log(error))
  }, [])  

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!sliderRef.current) return;
    
    const slider = sliderRef.current;
    const cardWidth = 320;
    const gap = 32; 
    
    const scrollLeft = currentIndex * (cardWidth + gap);
    
    slider.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
    
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto py-16 px-6 bg-gradient-to-br from-slate-50 to-white">
      <div className="text-center mb-12">
        <img className='w-[30%] my-4 mx-auto' src={faq} alt="" />
        <h2 className="text-3xl font-bold text-[#03373D] mb-4">What our customers are saying</h2>
        <p className="text-lg text-[#606060] max-w-2xl mx-auto">
         Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
        </p>
      </div>

      <div className="relative">
        <div 
          ref={sliderRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: 'calc(50% - 160px)',
            paddingRight: 'calc(50% - 160px)',
            scrollBehavior: 'smooth'
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`
                flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 p-8
                transition-all duration-500 ease-out
                ${index === currentIndex 
                  ? 'scale-110 shadow-2xl border-lime-200 bg-gradient-to-br from-white to-lime-50 z-10' 
                  : 'scale-90 opacity-50'
                }
              `}
            >
              <div className="flex justify-between items-start mb-6">
                <Quote className="w-8 h-8 text-lime-500 opacity-30" />
                <div className="flex gap-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              <blockquote className="text-[#606060] text-base leading-relaxed mb-6 min-h-[120px] flex items-center">
                "{testimonial.content}"
              </blockquote>

              <div className="w-12 h-px bg-gradient-to-r from-lime-500 to-lime-600 mb-6"></div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white text-xl">
                  {testimonial.image}
                </div>
                <div>
                  <h4 className="font-semibold text-[#03373D] text-lg">{testimonial.name}</h4>
                  <p className="text-[#606060] font-medium text-sm">{testimonial.title}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-12 gap-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
            className={`
              transition-all duration-300 rounded-full
              ${index === currentIndex 
                ? 'w-8 h-3 bg-gradient-to-r from-lime-500 to-lime-600' 
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }
              disabled:cursor-not-allowed
            `}
          />
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mt-6">
        <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          {currentIndex + 1} of {testimonials.length}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCardSlider;