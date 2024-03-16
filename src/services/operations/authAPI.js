import { toast } from "react-hot-toast"
import { endpoints } from "../apis"
import { setLoading, setToken } from "../../slices/authSlice"
import { setUser } from "../../slices/profileSlice"
import {apiConnector} from "../apiconnector"
import {setProgress} from "../../slices/loadingBarSlice"
const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
  } = endpoints

export function sendOtp(email,navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...")
        dispatch(setLoading(true));
        try {
            const response= await apiConnector("POST",SENDOTP_API,{email,checkUserPresent:true});
            console.log("response in otp"+response);
            console.log(response.data.success);
            if (!response.data.success) {
                throw new Error(response.data.message)
              }
        
              toast.success("OTP Sent Successfully")
              navigate("/verify-email")
        } catch (error) {
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}


export function signUp(accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    otp,
    navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...")
        dispatch(setLoading(true));
        console.log("upr try k")
        try {
          console.log("neeche try k");
          console.log("signupapi"+SIGNUP_API)
            const response= await apiConnector("POST",SIGNUP_API,{accountType,
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                otp});
            console.log("response in signup"+response);
            if (!response.data.success) {
                throw new Error(response.data.message)
              }
        
              toast.success("Signup Successfully")
              navigate("/login")
        } catch (error) {
            console.log("Signup ERROR............", error)
            toast.error("Signup Failed")
            navigate("/signup")
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function login(email, password, navigate) {
    return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))
      try {
        const response = await apiConnector("POST", LOGIN_API, {
          email,
          password,
        })
  
        console.log("LOGIN API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }
        dispatch(setProgress(100))
        toast.success("Login Successful")
        dispatch(setToken(response.data.token))
        const userImage = response.data?.user?.image
          ? response.data.user.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
        dispatch(setUser({ ...response.data.user, image: userImage }))
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("token", JSON.stringify(response.data.token))
        navigate("/dashboard/my-profile")
      } catch (error) {
        dispatch(setProgress(100))
        console.log("LOGIN API ERROR............", error)
        toast.error(error.response.data.message)
      }
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
  

export function getPasswordResetToken(email,setemailSent){
  return async(dispatch)=>{
    dispatch(setLoading(true));
    try {
      const response=await apiConnector("POST",RESETPASSTOKEN_API,{email});
      console.log("reset password token response", response);
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent");
      setemailSent(true);
    } catch (error) {
        console.log("Reset Password token ERROR............", error);
        toast.error("Failed to send reset password token")
    }
    dispatch(setLoading(false));
  }
}


export function resetPassword(password,confirmPassword,token){
  return async(dispatch)=>{
    dispatch(setLoading(true));
    try {
      const response=await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token});
      console.log("reset password response", response);
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("Reset Password successfully");
    } catch (error) {
        console.log("Reset Password ERROR............", error);
        toast.error("Failed to reset password")
    }
    dispatch(setLoading(false));
  }
}