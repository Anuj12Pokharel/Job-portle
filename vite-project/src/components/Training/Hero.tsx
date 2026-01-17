import React from "react";
import { ArrowRight } from "lucide-react";
import training from "../../assets/training.jpg";
const Hero = () => {
  return (
    <section className="relative py-20  bg-gradient-to-br from-blue-500/5 via-gray-50 to-purple-500/5 lg:py-32">
      {/* Background Image */}
      <div
        style={{ backgroundImage: `url(${training})` }}
        className="absolute inset-0 bg-contain bg-center opacity-5"
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent">
            Discover Training Opportunities in Nepal with JobLink360
          </h1>

          <p className="text-xl md:text-2xl text-cyan-500 mb-8 leading-relaxed">
            Upgrade Your Skills Today
          </p>

          {/* Description */}
          <p className="text-lg text-foreground/80 max-w-3xl mx-auto mb-10 leading-relaxed">
            At JobLink360, we offer a wide selection of professional training
            programs across Nepal designed to boost your skills and career
            potential. Whether you're just starting out or looking to advance in
            your field, our expert trainers are here to guide you every step of
            the way. Your desire to learn, combined with our commitment to
            quality education, creates the perfect path to career success.
          </p>

          {/* Button */}
          <button className=" bg-slate-300 inline-flex items-center text-lg px-8 py-4 rounded-2xl bg-primary text-teal-500 font-semibold shadow-md hover:text-teal-600 transition group">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
