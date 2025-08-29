import React from 'react'
import mission from '../../assets/background-image.jpg'
import association from '../../assets/association.png'
import joblink from '../../assets/logo.jpeg'
import leaf from '../../assets/leaf.png'
import tennis from '../../assets/tennis.png'
import coff from '../../assets/coff.png'
import FQ from '../../components/FQ'
import Serviceslider from '../../components/Serviceslider'


const Services = () => {
    const logos = [association, joblink, leaf, tennis, coff];
  return (
    <div className='p-9'>
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
              <div>
                <h1 className='text-center mt-9 font-bold text-3xl text-cyan-600'>Some of our happy clients</h1>
                <div className="flex overflow-hidden">
        <div className="flex space-x-16 animate-marquee py-12 px-14">
          {logos.concat(logos).map((logo, index) => ( // duplicate for infinite scroll
            <img
              key={index}
              src={logo}
              alt="client logo"
              className="h-16 w-auto object-contain "
            />
          ))}
        </div>
      </div>
              </div>
              <Serviceslider/>
               
                    <div className="flex flex-col lg:flex-row-reverse items-center md:gap-8  rounded-xl shadow-xl border border-gray-200 p-6 text-justify mt-11">
                      <div className="flex-1">
                        <div>
              <h1 className="text-cyan-600 text-xl font-bold ">01- Strong Online Presence </h1>  <p className='mt-2'>
                We receive an average of 10000+ visits to our website, increasing the 
visibility of your job postings.
              </p>
            </div>
            <div>
              <h1 className="text-cyan-600 text-xl font-bold mt-4 ">02- Large Talent Pool </h1> <p className='mt-2'>
                Access a database of over 5,000+ active and qualified jobseekers ready for 
new opportunities. 
              </p>
            </div>
            <div>
              <h1 className="text-cyan-600 text-xl font-bold mt-4">03– Proven Hiring Success </h1><p className='mt-2'>
                 More than 1000+ candidates have been successfully placed across various 
companies through our platform.
adherence. 
              </p>
            </div>
            <div>
              <h1 className="text-cyan-600 text-xl font-bold mt-4">04– Trusted by Employers</h1> <p className='mt-2'>
                 We’ve collaborated with 100+ companies across multiple industries, earning 
their trust and satisfaction.
              </p>
            </div>
               <div>
              <h1 className="text-cyan-600 text-xl font-bold mt-4 ">05– Industry Expertise </h1> 
              <p className='mt-2'>
                With over a decade of hands-on experience, we bring expert knowledge and 
reliability to every partnership. 
              </p>
</div>
           
                      </div>
                      <div className=" px-9 lg:flex flex-1 flex-col hidden  ">
                        <h1 className='font-bold text-3xl text-cyan-600'> Why work with us? </h1>
                        
                        <p className='mt-2 text-lg'> Benefits of working with us </p>
                      </div>
                    </div>
                    <div className='text-center py-14 bg-teal-600 mt-5 w-full text-white rounded-s-sm shadow-xl border border-teal-800  '>
                     <h1 className='text-2xl font-bold'> Have questions ? Our experts are here to help.</h1>
                     <p className='mt-1 text-xl font-semibold'>contact us: 01-4502062</p>
                    </div>
                    <FQ/>
    </div>
  )
}

export default Services