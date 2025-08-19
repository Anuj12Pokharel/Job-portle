import React from 'react'
import RegisterForm from '../components/RegisterForm'
import Navbar from '../components/Navbar'

const JobseekerRegister = () => {
  return (
   <>
   <Navbar/>
    <div className='mt-7'>
        <RegisterForm/>
    </div>
   </>
  )
}

export default JobseekerRegister