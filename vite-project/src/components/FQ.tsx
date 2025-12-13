import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is the billing process? ",
    answer:
      "Once you select a service plan, we generate an invoice based on the agreed terms. After payment is processed, your services will be activated and confirmed.",
  },
  {
    question: " How are your outsourcing service charges calculated?",
    answer:
      "Service charges vary depending on the number of employees, the level of service required, and future collaboration opportunities.",
  },
  {
    question: " WhatG��s the cost structure for HR consulting?",
    answer:
      "Our pricing is flexible and depends on your business needs and the scope of work. Reach out to us for a personalized quote. ",
  },
  {
    question: " Do you send candidates directly to employers?",
    answer:
      "No, employers must shortlist CVs from our dashboard and call candidates for interviews themselves.",
  },
  {
    question: " Can I track the status of applications?",
    answer:
      "Yes, our system allows you to monitor all applications, manage stages of recruitment, and shortlist candidates easily.",
  },
  {
    question: " How long does it take to fill a vacancy?",
    answer:
      "While timelines may vary by position, we typically present a pool of relevant candidates within a few working days.",
  },
  {
    question: "What outsourcing services do you offer?",
    answer:
      "We handle end-to-end employee lifecycle managementG��recruitment, onboarding, payroll, SSF/CIT deposits, compliance documentation, and exit settlements.",
  },
  {
    question: " How does outsourcing benefit my business?",
    answer:
      "Outsourcing reduces costs, improves HR efficiency, ensures compliance, and allows you to focus on your core business functions.",
  },
  {
    question: " Do you provide post-hiring or HR support?",
    answer:
      "Yes, we support you beyond hiring with services like payroll, compliance management, documentation, and final settlements. ",
  },
  {
    question: "  Do you assist with HR policy creation? ",
    answer:
      "Absolutely, Our consultants can help you develop or improve your HR policies, company guidelines, and compliance documents. ",
  },
  {
    question: " What industries do you specialize in? ",
    answer:
      "We cater to a wide range of industries including IT, education, hospitality, manufacturing, finance, and more.",
  },
  {
    question: " Is there a minimum employee requirement for outsourcing?",
    answer:
      "No, we offer flexible plans suitable for businesses of all sizesG��from startups to large enterprises.",
  },
  {
    question: "Can I customize or upgrade my service plan later?",
    answer:
      "Yes, our plans are flexible. You can upgrade or adjust your package as your business grows or your needs change.",
  },
  {
    question: " How do I get started with your services?",
    answer:
      "Simply register on our platform, select your desired services, and our team will guide you through the onboarding process.",
  },
];

export default function FQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" mx-auto p-9">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-600">
        Frequently Asked Questions
      </h2>
      <div className="grid md:grid-cols-2 gap-5 max-h-[50vh] overflow-y-auto md:max-h-full ">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg shadow-sm overflow-y-auto"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full text-left p-4 font-medium text-gray-900 hover:bg-gray-100"
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-black" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-800" />
              )}
            </button>
            {openIndex === index && (
              <div className="p-4 border-t text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
