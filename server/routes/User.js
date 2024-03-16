const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controller/Auth")

const {
    resetPassToken,
    resetPassword,
} = require("../controller/ResetPassword")

const { auth } = require("../middlewares/auth")

router.post("/login",login);
router.post("/signup",signUp);
router.post("/sendOtp",sendOTP);
router.post("/changePassword",auth,changePassword);
router.post("/reset-password-token",resetPassToken);
router.post("/reset-password",resetPassword);

module.exports=router;