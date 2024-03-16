import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';

const UpdatePassword = () => {
    const dispatch=useDispatch();
    const location=useLocation();

    const [showPassword, setshowPassword] = useState(false)
    const [showConfirmPassword, setshowConfirmPassword] = useState(false)
    const {loading}=useSelector((state)=>state.auth);
    const [formData, setformData] = useState({
        password:"",
        confirmPassword:""
    })
    
    const {password,confirmPassword}=formData;
    const handleOnChange=(e)=>{
        setformData((prev)=>(
            {
                ...prev,
                [e.target.name]:e.target.value
            }
        ))
    }
    const handleOnSubmit=(e)=>{
        e.preventDefault();
        const token=location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token))
    }
  return (
    <div className='text-richblack-5'>
      {
        loading?(
            <div>Loading...</div>
        ):(
            <div>
                <h1>Choose new Password</h1>
                <p>Almost done. Enter your new password and youre all set.</p>
                <form onSubmit={handleOnSubmit}>
                    <label>
                        <p>New Password<sup className="text-pink-200">*</sup></p>
                        <input className='text-richblack-900' type={showPassword?"text":"password"} required
                        name='password' value={password} onChange={handleOnChange} />
                        <span onClick={()=>setshowPassword((prev)=> !prev)}>
                            {
                                showPassword?<AiFillEyeInvisible fontSize={24}/>:<AiFillEye fontSize={24}/>
                            }
                        </span>
                    </label>
                    <label>
                        <p>Confirm New Password<sup className="text-pink-200">*</sup></p>
                        <input className='text-richblack-900' type={showConfirmPassword?"text":"password"} required
                        name='confirmPassword' value={confirmPassword} onChange={handleOnChange} />
                        <span onClick={()=>setshowConfirmPassword((prev)=> !prev)}>
                            {
                                showConfirmPassword?<AiFillEyeInvisible fontSize={24}/>:<AiFillEye fontSize={24}/>
                            }
                        </span>
                    </label>
                    <button type='submit'>
                        Reset Password
                    </button>
                </form>
                <div className='flex mt-4 gap-2 '>
              <FaLongArrowAltLeft/>
              <Link className='text-richblack-100 text-[0.8rem]' to="/login">Back to login</Link>
            </div>
            </div>
        )
      }
    </div>
  )
}

export default UpdatePassword
