import React, { useState, useEffect } from "react";

const ClientFeedback = () => {





  const testimonials = [
    {
      id: 1,
      name: "Ratul Sarkar",
      title: "CEO, Lorem Ipsum",
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      rating: 5,
    },
    {
      id: 1,
      name: " Sarkar",
      title: "CEO, Lorem Ipsum",
      review:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      rating: 4,
    },
  ];

  const avatars = [
    "https://randomuser.me/api/portraits/women/1.jpg",
    "https://randomuser.me/api/portraits/men/2.jpg",
    "https://randomuser.me/api/portraits/women/3.jpg",
    "https://randomuser.me/api/portraits/men/4.jpg",
    "https://randomuser.me/api/portraits/women/5.jpg",
    "https://randomuser.me/api/portraits/men/6.jpg",
    "https://randomuser.me/api/portraits/women/7.jpg",
    "https://randomuser.me/api/portraits/men/8.jpg",
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        setTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentTestimonial, testimonials.length]);

  return (
    <section className="py-16 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <h4 className="text-[#078bf7] font-semibold text-center text-3xl mb-2">
          Services
        </h4>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Our Client Feedback
        </h2>
        <div className="max-w-4xl mx-auto relative">
          
          {/* Decorative avatars */}
          <div className="absolute top-0 left-0 -ml-24 flex flex-wrap justify-center w-24">
            {avatars.slice(0, 4).map((avatar, index) => {
              const top = Math.floor(Math.random() * 40); // 0 to 40px
              const left = Math.floor(Math.random() * 40); // 0 to 40px
              return (
                <img
                  key={index}
                  src={avatar}
                  alt=""
                  className="rounded-full w-12 h-12 m-1 shadow-sm absolute"
                  style={{
                    top: `${top}px`,
                    left: `${left}px`,
                  }}
                />
              );
            })}
          </div>

          <div className="absolute top-0 right-0 -mr-24 flex flex-wrap justify-center w-24">
            {avatars.slice(4).map((avatar, index) => {
              const top = Math.floor(Math.random() * 40);
              const right = Math.floor(Math.random() * 40);
              return (
                <img
                  key={index}
                  src={avatar}
                  alt=""
                  className="rounded-full w-12 h-12 m-1 shadow-sm absolute"
                  style={{
                    top: `${top}px`,
                    right: `${right}px`,
                  }}
                />
              );
            })}
          </div>

          {/* Main testimonial card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 relative z-10">
            {/* Quotation Mark */}
            <div className="text-center text-5xl text-blue-500 ">&ldquo;</div>

            {/* Testimonial Content */}
            <div
              className={`transition-opacity duration-300  ${
                transitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              <div className="text-center text-xl italic text-gray-700 mb-6">
                {testimonials[currentTestimonial].review}
              </div>
              <div className="flex items-center justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
                    </svg>
                  )
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-gray-600">
                  {testimonials[currentTestimonial].title}
                </p>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  currentTestimonial === index ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => {
                  setTransitioning(true);
                  setTimeout(() => {
                    setCurrentTestimonial(index);
                    setTransitioning(false);
                  }, 300);
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientFeedback;
