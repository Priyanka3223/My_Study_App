import { FcGoogle } from "react-icons/fc"
import { useSelector } from "react-redux"

import frameImg from "../../../assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

function Template({ title, description1, description2, image, formType }) {
  const { loading } = useSelector((state) => state.auth)

  return (
    <div className=" mt-auto mb-auto ">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="flex w-11/12 gap-x-12 mx-auto max-w-maxContent justify-between py-12">
          <div className=" mx-auto w-11/12 max-w-[450px] md:mx-0">
            <h1 className="text-center text-[1.8rem] font-semibold  text-richblack-5">
              {title}
            </h1>
            <p className=" text-center mt-4 text-[1.125rem]">
              <span className="text-richblack-100">{description1}</span>{" "}
              <span className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </span>
            </p>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}
          </div>
          <div className="relative mx-auto w-11/12 max-w-[450px] m-auto">
            <img
              src={frameImg}
              alt="Pattern"
              width={558}
              height={504}
              loading="lazy"
            />
            <img
              src={image}
              alt="Students"
              width={558}
              height={504}
              loading="lazy"
              className="absolute -top-4 right-4 "
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Template
