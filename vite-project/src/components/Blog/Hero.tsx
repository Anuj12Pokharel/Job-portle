import React from "react";

const Hero: React.FC = () => {
  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-labelledby="blog-heading" // for accessibility
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />

      {/* Optional grid pattern */}
      <div
        className="absolute inset-0 
          bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),
          linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
          bg-[size:24px_24px]"
      />

      {/* Main content */}
      <div className="relative container mx-auto text-center">
        {/* Main SEO Heading */}
        <h1
          id="blog-heading"
          className="text-4xl md:text-6xl font-bold mb-6  bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent"
        >
          Career Tips, Job Search Guides &{" "}
          <span className="text-cyan-900 ">Blogs</span>
        </h1>

        {/* Supporting description */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stay updated with the latest insights, resume tips, interview advice,
          and career development stories from industry experts and our
          job-seeking community.
        </p>

        {/* Call to Action (SEO-friendly anchor text) */}
        <a
          href="/blogs"
          className="inline-block mt-6 px-6 py-3 bg-cyan-400 text-white rounded-lg hover:bg-primary/90 transition"
        >
          Explore Career Blogs
        </a>
      </div>
    </section>
  );
};

export default Hero;
