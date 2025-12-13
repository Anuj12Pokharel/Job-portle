import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: " How can I register on Joblink360? ",
    answer:
      "Creating an account on Joblink360 is simple. Whether you're looking to switch careers or land your dream job, click here to get started. Employers looking to post job openings can click here to register and begin hiring.",
  },
  {
    question: " Is there any cost involved for job seekers?",
    answer:
      "No, using Joblink360 as a job seeker is completely free. There are no hidden charges or subscription fees. ",
  },
  {
    question: "  How do I apply for jobs through Joblink360?",
    answer:
      "After signing up and logging into your dashboard, you can browse job listings and apply directly. Keeping your profile updated increases your chances of selection.",
  },
  {
    question: "  Can I apply for more than one job at once?",
    answer:
      "Absolutely! You can apply to multiple job postings. Just make sure your CV is relevant to the position for better chances. ",
  },
  {
    question: "  How frequently should I update my profile?",
    answer:
      "We recommend updating your profile at least once a month. Fresh profiles are more likely to attract employer attention. ",
  },
  {
    question: " Do I need to upload a photo on my profile?",
    answer:
      "Yes, adding a professional photo can make your profile more appealing and trustworthy to potential employers.",
  },
  {
    question: "Can I apply for jobs without creating an account?",
    answer:
      "No, you must register first. Having an account helps you track applications, set job alerts, and receive personalized job suggestions.",
  },
  {
    question: "  What types of jobs are available on Joblink360?",
    answer:
      "Joblink360 features a wide variety of roles including IT, HR, marketing, admin, engineering, government jobs, part-time roles, internships, and more.",
  },
  {
    question: "  Are jobs only limited to Kathmandu Valley? ",
    answer:
      "No. We connect candidates and employers across Nepal, not just within Kathmandu Valley. ",
  },
  {
    question: "  Are part-time or internship positions offered? ",
    answer:
      "Yes, we regularly list part-time jobs and internships that are perfect for students or those new to the job market. ",
  },
  {
    question: " What happens after I apply for a job? ",
    answer:
      "YouG��ll receive a confirmation message, and you can track your application status under the GǣApplied JobsGǥ section in your dashboard. ",
  },
  {
    question: " Can I edit my resume after submitting a job application?",
    answer:
      "Unfortunately, you canG��t change your resume after submission. Always double-check before hitting 'apply.' ",
  },
  {
    question: " What should I do if I forget my password?",
    answer:
      "Click on the 'Forgot Password' option on the login page. YouG��ll get a reset link sent to your email. ",
  },
  {
    question: "  Who do I contact for technical support or site issues? ",
    answer:
      "If you run into any issues, feel free to reach out via our contact form or call us at 01-4502062. Our support team is here to help.",
  },
  {
    question: "   Does Joblink360 offer professional training programs? ",
    answer:
      "Yes, we provide training in key areas like Customer Service, HR, Microsoft Office (Excel & Word), and MIS to boost your career growth.",
  },
];

export default function FA() {
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
