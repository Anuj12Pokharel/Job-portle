import React from "react"
import { Search, MapPin } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-4xl font-bold leading-tight mb-6">
            Find Your Dream Job in <span className="text-cyan-600">Nepal</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with top employers across Nepal. From Kathmandu to remote locations, discover opportunities that
            match your skills and aspirations.
          </p>

          {/* Search Box */}
          
          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span>Popular searches:</span>
            <button className="text-cyan-600 hover:underline">Software Engineer</button>
            <button className="text-cyan-600 hover:underline">Marketing Manager</button>
            <button className="text-cyan-600 hover:underline">Remote Work</button>
            <button className="text-cyan-600 hover:underline">Banking</button>
          </div>
        </div>
      </div>
    </section>
  )
}
