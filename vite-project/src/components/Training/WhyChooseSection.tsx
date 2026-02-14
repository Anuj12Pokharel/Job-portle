import React from "react";
import { Target, Users, HandHeart, BookOpen, Network } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Build In-Demand Skills",
    description:
      "Get equipped with practical, job-ready skills aligned with today's industry needs.",
  },
  {
    icon: Users,
    title: "Learn from Industry Experts",
    description:
      "Train under professionals who bring real-world insights and experience to the classroom.",
  },
  {
    icon: HandHeart,
    title: "Hands-On Training",
    description:
      "Dive into practical sessions, case studies, and live projects that prepare you for real work environments.",
  },
  {
    icon: BookOpen,
    title: "Personalized Learning Paths",
    description:
      "Choose from a variety of courses designed to suit your career aspirations and learning level.",
  },
  {
    icon: Network,
    title: "Grow Your Network",
    description:
      "Meet fellow learners, share ideas, and create lasting professional connections.",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-8xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-600">
              Why Choose Training at JobLink360?
            </h2>
            <p className="text-lg text-black max-w-2xl mx-auto">
              Discover what makes our training programs stand out and how we
              help you achieve your career goals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="mb-3">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-10 w-10 text-cyan-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
