import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Users,
  Star,
} from "lucide-react";

const trainingPrograms = [
  {
    id: 1,
    title: "Digital Marketing Mastery",
    image: "/digital-marketing-training-session.jpg",
    duration: "8 weeks",
    students: "150+",
    rating: 4.9,
    category: "Marketing",
    description:
      "Master SEO, social media, content marketing, and analytics to drive business growth.",
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    image: "/web-dev-bootcamp.png",
    duration: "12 weeks",
    students: "200+",
    rating: 4.8,
    category: "Technology",
    description:
      "Learn React, Node.js, databases, and deployment to become a complete web developer.",
  },
  {
    id: 3,
    title: "Data Science & Analytics",
    image: "/data-science-training-with-charts.jpg",
    duration: "10 weeks",
    students: "120+",
    rating: 4.9,
    category: "Data",
    description:
      "Master Python, machine learning, and data visualization for data-driven decisions.",
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    image: "/ui-ux-design-workshop.jpg",
    duration: "6 weeks",
    students: "180+",
    rating: 4.7,
    category: "Design",
    description:
      "Create beautiful, user-friendly interfaces with modern design principles and tools.",
  },
];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % trainingPrograms.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + trainingPrograms.length) % trainingPrograms.length,
    );
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-teal-600 bg-clip-text text-transparent ">
              Training Gallery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive training programs designed to accelerate
              your career growth.
            </p>
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative">
                <img
                  src={trainingPrograms[currentIndex].image}
                  alt={trainingPrograms[currentIndex].title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button className="flex items-center px-4 py-2 bg-white text-sm font-medium rounded shadow hover:bg-gray-200 transition">
                    <Play className="h-4 w-4 mr-2" />
                    Watch Preview
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-200 rounded">
                    {trainingPrograms[currentIndex].category}
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {trainingPrograms[currentIndex].rating}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {trainingPrograms[currentIndex].title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {trainingPrograms[currentIndex].description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {trainingPrograms[currentIndex].duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {trainingPrograms[currentIndex].students}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={prevSlide}
                className="px-3 py-2 border rounded bg-white hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex space-x-2">
                {trainingPrograms.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="px-3 py-2 border rounded bg-white hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trainingPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                    <button className="flex items-center px-4 py-2 bg-white text-sm font-medium rounded shadow hover:bg-gray-200 transition">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-200 rounded">
                      {program.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {program.rating}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {program.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {program.students}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="px-8 py-4 text-lg font-semibold border rounded-lg text-cyan-600 bg-slate-300 hover:bg-gray-400 transition">
              View All Courses
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
