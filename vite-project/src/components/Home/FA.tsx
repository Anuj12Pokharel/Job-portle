import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How do I get started with Joblink360?",
    answer: "Joblink360 is completely free for job seekers. You can register on the platform, set up your professional profile (including a photo and updated CV), and instantly start applying for jobs or tracking your applications all from your dashboard."
  },
  {
    question: "What types of jobs are available on the platform?",
    answer: "We feature a highly diversified range of opportunities across Nepal, not just the Kathmandu Valley. Our listings include Full-time, Part-time, Internships, Government jobs, and specialized roles in IT, HR, Marketing, Engineering, and more."
  },
  {
    question: "How does the job application process work?",
    answer: "Once registered, you can browse listings and apply multiple times to relevant jobs. You'll receive a confirmation message after applying, and you can easily track your application status within the 'Applied Jobs' tab in your dashboard."
  },
  {
    question: "Can I update my profile or resume after applying?",
    answer: "We highly encourage updating your profile at least once a month for better visibility to employers. However, once you submit an application to a specific job, that snapshot of your resume is sent and cannot be edited for that application."
  },
  {
    question: "Does Joblink360 provide training or support?",
    answer: "Yes! Beyond job listings, we offer professional training programs in critical areas such as Customer Service, HR, Microsoft Office, and MIS. For technical support with the platform, you can reach out via our contact form or call 01-4502062."
  },
  {
    question: "I forgot my password, how can I recover my account?",
    answer: "Simply click on the 'Forgot Password' link on the login page. A secure reset link will be automatically dispatched to your registered email address."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-cyan-600">
        Frequently Asked Questions
      </h2>

      {/* Column layout prevents empty space issue */}
      <div className="columns-1 md:columns-2 gap-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-6 break-inside-avoid border rounded-lg shadow-sm bg-white"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="flex justify-between items-center w-full p-4 text-left font-medium text-gray-900 hover:bg-gray-100"
            >
              <span>{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>

            {openIndex === index && (
              <div className="p-4 border-t text-gray-600">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
