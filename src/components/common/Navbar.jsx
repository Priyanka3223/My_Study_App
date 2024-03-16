import React, { useEffect,useState } from 'react'
import { Link, matchPath } from 'react-router-dom';
import logo from '../../assets/Logo/Logo-Full-Light.png';
import {NavbarLinks} from '../../data/navbar-links';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import {AiOutlineShoppingCart} from "react-icons/ai";
import {IoIosArrowDropdownCircle} from 'react-icons/io'
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';

const Navbar = () => {
  const {token}=useSelector((state)=>state.auth);
  const {user}=useSelector((state)=>state.profile);
  const {totalItems}=useSelector((state)=>state.cart);


  // const sublinks=[
  //   {
  //     title:"python",
  //     link:"/catalog/python"
  //   },
  //   {
  //     title:"python",
  //     link:"/catalog/python"
  //   }
  // ]

  const [sublinks,setSubLinks]=useState([]);
  const fetchSublinks=async ()=>{
    try{
      const result=await apiConnector("Get",categories.CATEGORIES_API);
      setSubLinks(result.data.allTags );
      console.log(result.data.allTags)
    }
    catch(error){
      console.log("could not fetch the category list")
    }
  }
  useEffect(() => {
    fetchSublinks();
  }, [])
  


  const location=useLocation();
  const matchRoute=(route)=>{
    return matchPath({path:route},location.pathname)
  }
  return (
    <div className=' w-11/12 h-14 justify-center items-center flex border-b-[1px] border-b-richblack-700'>
      <div className='flex w-11/12 max-w-maxContent items-center justify-between '>
        <Link to="/">
          <img src={logo} width={160} height={42} alt="" loading='lazy'/>
        </Link>
        {/* nav links */}
        <nav>
          <ul className='flex gap-6 text-richblack-25'>
            {
              NavbarLinks.map((link,index)=>{
                return(
                  <li key={index}>
                    {
                      link.title==="Catalog"?(
                        // catalog
                      <div className='relative flex justify-center items-center gap-2 group'>
                        <p>{link.title}</p>
                        <IoIosArrowDropdownCircle/>
                        <div className='z-10 invisible absolute left-[50%] p-4
                        translate-x-[-50%] top-0 translate-y-[80%] flex flex-col rounded-md bg-richblack-5 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 w-[300px]'>
                          <div className='absolute left-[50%] translate-x-[80%] translate-y-[-45%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5'></div>
                          {
                            sublinks.length?(
                              sublinks.map((sublink,index)=>{
                                return(
                                  <Link  to={`${sublink.link}`} key={index}>{sublink.name}</Link>
                                )
                              })
                            ):(<div></div>)
                          }
                        </div>
                      </div>
                      ):(
                        <Link to={link?.path}> 
                          <p className={`${matchRoute(link?.path)?"text-yellow-25":"text-richblack-25"}`}>
                            {link.title}
                          </p>
                        </Link>
                      )
                    }
                  </li>
                )
              })
            }
          </ul>
        </nav>
        {/* login/signup */}
        <div className='flex gap-x-4 items-center '>
          {
            user && user?.accountType!=="Instructor" && (
              <Link to="/dashboard/cart" className='relative'>
                <AiOutlineShoppingCart/>
                {
                  totalItems>0 &&(
                    <span>
                      {totalItems}
                    </span>
                  )
                }
              </Link>
            )
          }
          {
            token===null && (
              <Link to="/login" >
                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>Log in</button>
              </Link>
            )
          }
          {
            token===null && (
              <Link to="/signup">
                <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>Sign Up</button>
              </Link>
            )
          }
          {
            token!==null && <ProfileDropDown/>
          }
        </div>
      </div>
    </div>
  )
}

export default Navbar
