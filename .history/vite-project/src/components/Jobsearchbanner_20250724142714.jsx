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
          Linking Talent and Opportunitie
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12 px-4">
        {/* Box 1 */}
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300 text-center">
          <div className="text-4xl mb-4">💼</div>
          <h2 className="text-xl font-semibold mb-2">Top Job Categories</h2>
          <p className="text-gray-600">Explore jobs in IT, Marketing, Finance, and more. Find your perfect fit.</p>
        </div>

        {/* Box 2 */}
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300 text-center">
          <div className="text-4xl mb-4">🏢</div>
          <h2 className="text-xl font-semibold mb-2">Featured Companies</h2>
          <p className="text-gray-600">Apply to jobs from Nepal's top-rated employers hiring now.</p>
        </div>

        {/* Box 3 */}
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-xl font-semibold mb-2">Quick Apply</h2>
          <p className="text-gray-600">Apply to jobs with just one click. No long forms, no hassle.</p>
        </div>
      </div>
    </div>
  )
}

export default Jobsearchbanner