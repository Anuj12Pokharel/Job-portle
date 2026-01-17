import { ArrowRight } from "lucide-react";

const trainings = [
  {
    id: 1,
    title: "Customer Service Assistant",
    description:
      "JobLink360 Customer Service Assistant Training aims to prepare you with the necessary skills and confidence required to succeed in customer-facing positions from diverse industries.",
    link: "#",
  },
  {
    id: 2,
    title: "HR",
    description:
      "JobLink360's HR Training Course is aimed at aspiring HR professionals and professionals looking to acquire advanced human resource management know-how.",
    link: "#",
  },
  {
    id: 3,
    title: "Excel & Word (Basic)",
    description:
      "The Excel & Word (Basic) Training by JobLink360 is ideal for beginners looking to build foundational skills in two of the most essential Microsoft Office applications.",
    link: "#",
  },
  {
    id: 4,
    title: "MIS",
    description:
      "JobLink360's MIS Training Program is specifically designed to mold your capabilities in managing, analyzing, and reporting organizational data using applications like Microsoft Excel, databases, and reporting systems.",
    link: "#",
  },
];

export default function Trainings() {
  return (
    <div className="max-w-8xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Explore <span className="text-cyan-600">JobLink360</span> Trainings
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {trainings.map((training) => (
          <div
            key={training.id}
            className="bg-white p-6 rounded-2xl border-b-8 border-teal-600  shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {training.id}. {training.title}
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {training.description}
            </p>
            <a
              href={training.link}
              className="inline-flex items-center gap-2 text-cyan-600 font-medium border border-cyan-600 px-4 py-2 rounded-lg hover:bg-cyan-600 hover:text-white transition-colors"
            >
              View details
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
