import { ArrowRight } from "lucide-react";

export default function Jobsearch() {
  return (
    <section className="w-full mx-auto px-11 py-6">
      <div className="bg-gradient-to-br from-cyan-500 via-teal-500 to-cyan-600 rounded-3xl p-10 md:p-10 text-white text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          Find Your Dream Job in Nepal Now with JobLink360
        </h1>

        <p className="text-lg md:text-xl leading-relaxed mb-6 max-w-6xl mx-auto opacity-95">
          Ready to move to the next level in your career? Start today with
          JobLink360! create your free profile, upload your resume, and apply
          for hundreds of available jobs in a few easy steps. Whether you're
          looking for jobs in Kathmandu, or anywhere else in Nepal, JobLink360
          is here to help you get connected to your dream job.
        </p>

        {/* Plain Tailwind "button" */}
        <div className="inline-flex items-center justify-center bg-white text-cyan-600 hover:bg-gray-50 px-8 py-2 rounded-lg font-semibold text-lg mb-10 cursor-pointer transition">
          Search Jobs Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-2">10,000+</div>
            <div className="text-sm md:text-base uppercase tracking-wider opacity-90">
              CANDIDATE
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-2">100+</div>
            <div className="text-sm md:text-base uppercase tracking-wider opacity-90">
              JOBS DAILY
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-2">1000+</div>
            <div className="text-sm md:text-base uppercase tracking-wider opacity-90">
              COMPANIES
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold mb-2">2+</div>
            <div className="text-sm md:text-base uppercase tracking-wider opacity-90">
              YEARS
            </div>
          </div>

          <div className="text-center col-span-2 md:col-span-1">
            <div className="text-2xl md:text-3xl font-bold mb-2">1000+</div>
            <div className="text-sm md:text-base uppercase tracking-wider opacity-90">
              DAILY VISITS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
