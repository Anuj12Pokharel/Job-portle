import React from 'react'
import mission from '../../assets/background-image.jpg'
import FQ from '../../components/FQ'
import Serviceslider from '../../components/Serviceslider'
import LogoSlider from '../../components/LogoSlider'
import Benefitservice from '../../components/Benefitservice'


const Services = () => {
  
  return (
   <>
    <div className='p-6'>
        <div className="flex flex-col lg:flex-row items-center md:gap-8 rounded-xl shadow-xl border border-gray-200 p-8">
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-teal-600">Services</h2>
                  <p className="text-black mt-2 text-justify">
                   JobLink is a comprehensive solution for all your workforce 
management and recruitment requirements. Equipped with 
cutting-edge hiring and management tools, the site enables 
employers to advertise their vacancies efficiently and reach the 
suitable talent. JobLink Job facilitates organisations to attract, 
screen, and recruit quality candidates through its recruitment 
solutions. In addition, the site facilitates outsourcing, whereby 
companies outsource their processes and activities to 
professionals with the aim of improving productivity and lowering 
the cost of operations. Whether planning cooperative events or 
offering professional human resource consulting, JobLink Job 
offers one-stop-shop solutions to all your human resource and 
employment requirements.
                  </p>
                </div>
                <div className="flex-1 flex justify-center">
                  <img
                    src={mission}
                    alt="services"
                    className="rounded-2xl shadow-lg  h-72  object-contain hidden md:block "
                  />
                </div>
              </div>
               </div>
             
              <LogoSlider/>
              <Serviceslider/>
              <Benefitservice/>
               
                
                    <div className='text-center py-14 bg-teal-600 mt-5 w-full text-white rounded-s-sm shadow-xl border border-teal-800  '>
                     <h1 className='text-2xl font-bold'> Have questions ? Our experts are here to help.</h1>
                     <p className='mt-1 text-xl font-semibold'>contact us: 01-4502062</p>
                    </div>
                    <FQ/>
   
   </>
  )
}

export default Services