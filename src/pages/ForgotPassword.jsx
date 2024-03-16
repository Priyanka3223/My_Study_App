import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getPasswordResetToken } from '../services/operations/authAPI';
import { FaLongArrowAltLeft } from 'react-icons/fa';

const ForgotPassword = () => {
    const {loading}=useSelector((state)=>state.auth);
    const [emailSent, setemailSent] = useState(false);
    const [email, setemail] = useState("");
    const dispatch=useDispatch();
    const handleOnSubmit=(e)=>{
      e.preventDefault();
      dispatch(getPasswordResetToken(email,setemailSent))

    };

  return (
    <div className='mt-[10%] text-white flex justify-center items-center'>
      {
        loading?(<div>Loading...</div>):
        (<div>
          <h1 className=' text-[1.8rem] font-semibold '>{
            !emailSent?"Reset your Password":"Check your Email"
            }</h1>
            <p className='text-richblack-100 text-[1rem] w-[30rem]'>
              {
                !emailSent?"Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery":
                `We have sent the reset email to ${email}`
              }
            </p>
            <form className='w-full flex flex-col' onSubmit={handleOnSubmit}>
              {
                !emailSent && (
                  <label >
                    <p className='text-richblack-100 mt-8 mb-1 text-[0.8rem] '>Email Address<sup className="text-pink-200">*</sup></p>
                    <input className=' bg-richblack-800 px-2 py-2 mt-1 w-[30rem] rounded-md' required type="email" 
                    value={email} style={{
                      boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                    }}
                     onChange={(e)=>setemail(e.target.value)}
                    placeholder='Enter Your Email Address' />
                  </label>
                )
              }
              <button type='submit' className=' mt-6 bg-yellow-50  text-richblack-700 py-2  rounded-md'>
                {
                  !emailSent?"Reset Password":"Resend Email"
                }
              </button>
            </form>
            <div className='flex mt-4 gap-2 '>
              <FaLongArrowAltLeft/>
              <Link className='text-richblack-100 text-[0.8rem]' to="/login">Back to login</Link>
            </div>
        </div>)
      }
    </div>
  )
}

export default ForgotPassword
