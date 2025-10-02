import React from 'react'
import backgroundImage from  '../assets/back.jpeg';


const Jobsearchbanner = () => {
  return (
    <div>
  <div
      className="relative bg-cover bg-center h-[400px] flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className=" bg-transparent max-w-2xl w-full">
        <h1 className="text-xl md:text-4xl font-bold text-white mb-4">
          Linking Talent and Opportunities
        </h1>
        <div className="flex items-center border border-gray-300 rounded overflow-hidden">
          <input
            type="text"
            placeholder="Explore the best job openings in nepal and apply now "
            className="w-full px-4 py-2 focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-6 py-2 hover:bg-blue-700">
            Search
          </button>
        </div>
      </div>
    </div>
    
    </div>
  )
}

export default Jobsearchbanner