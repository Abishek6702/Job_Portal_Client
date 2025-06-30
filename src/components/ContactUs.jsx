import React from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Globe,
  FacebookIcon,
  GitBranchIcon,
  Github,
} from "lucide-react";

const icons = [
  { component: FacebookIcon, href: "#" },
  { component: Globe, href: "#" }, // Use Globe as a placeholder for Google
  { component: Instagram, href: "#" },
  { component: Github, href: "#" },
  { component: Twitter, href: "#" },
];
const ContactUs = () => (
  <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto my-16 px-8 rounded-2xl shadow-md ">
    {/* Left Side */}
    <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10  px-4">
      <p className="text-blue-600 font-semibold text-2xl mb-2">Contact Us</p>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-snug">
        We Would Love To <br /> Hear From You
      </h2>
      <p className="text-gray-600 mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi.
      </p>

      {/* Social Icons */}
      <div className="flex items-center space-x-4 mb-6">
        {icons.map(({ component: Icon, href }, i) => (
          <a
            key={i}
            href={href}
            className="bg-blue-100 hover:bg-blue-200 p-3 rounded-full text-blue-600"
          >
            <Icon className="w-5 h-5" />
          </a>
        ))}
      </div>

      {/* Call Us Button */}
      <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full flex items-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.1117 12.259C12.4658 10.9047 14.5977 10.7799 16.0152 11.9717L17.0395 12.8346C18.2085 13.8183 18.3273 15.5917 17.303 16.7944C16.7444 17.4407 15.9581 17.8466 15.1078 17.9278C11.8348 18.3686 8.40133 16.7914 4.80538 13.1952C1.20943 9.59895 -0.368634 6.16419 0.0721925 2.89191C0.0951002 2.63587 0.148305 2.38346 0.230692 2.13996C0.42132 1.5806 0.757833 1.08229 1.20546 0.696514C2.40907 -0.32688 4.18129 -0.208987 5.16497 0.961031L6.02681 1.98541C7.22051 3.40113 7.09668 5.5341 5.74251 6.88839L5.00746 7.6225C4.81149 7.81883 4.74733 8.11109 4.84302 8.37147C5.11049 9.10261 5.79303 10.016 6.88865 11.1117C7.98527 12.2085 8.89862 12.8901 9.62871 13.1585C9.88926 13.254 10.1815 13.1894 10.3776 12.9931L11.1117 12.259Z"
            fill="white"
          />
        </svg>
        Call Us: 1234567890
      </button>
    </div>

    {/* Right Side: Form */}
    <div className="md:w-1/2 w-full bg-white/10 backdrop-blur-lg p-10 rounded-3xl  border-white/20">
      <form className="space-y-3 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-md font-semibold">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 rounded-xl bg-white/90 text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-md font-semibold">Contact Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              className="p-3 rounded-xl bg-white/90 text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-md font-semibold">Email Address</label>
          <input
            type="email"
            placeholder="example@mail.com"
            className="p-3 rounded-xl bg-white/90 text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 text-md font-semibold">Your Message</label>
          <textarea
            placeholder="Type your message..."
            rows={5}
            className="p-3 rounded-xl bg-white/90 text-black border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center transition shadow-md hover:shadow-lg"
        >
          <i className="fas fa-paper-plane mr-2"></i> Send Message
        </button>
      </form>
    </div>
  </section>
);

export default ContactUs;
