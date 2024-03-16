const BASE_URL=process.env.REACT_APP_BASE_URL

export const categories={
    CATEGORIES_API:BASE_URL+"/course/showAllCategory",
    
};

export const endpoints = {
    SENDOTP_API: BASE_URL + "/auth/sendOtp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  };