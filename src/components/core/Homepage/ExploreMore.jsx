import React, { useState } from 'react';
import {HomePageExplore} from '../../../data/homepage-explore';
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabsName=["Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];

const ExploreMore = () => {
    const [currentTab,setCurrentTab]=useState(tabsName[0]);
    const [courses,setCourses]=useState(HomePageExplore[0].courses);
    const [currentCard, setcurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards=(value)=>{
        setCurrentTab(value);
        const result=HomePageExplore.filter((course)=> course.tag===value);
        setCourses(result[0].courses);
        setcurrentCard(result[0].courses[0].heading);
    }
  return (
    <div>
      <div className='text-4xl font-semibold text-center'>
        Unlock the
        <HighlightText text={"Power of Code"}/>
      </div>
      <p className='text-center text-richblack-300  mt-3 text-[16px]'>Learn to build anything you can imagine</p>
      <div className='flex flex-row bg-richblack-800 mb-5 mt-5 px-1 py-1 rounded-full'>
        {
            tabsName.map((Element,index)=>{
                return(
                    <div className={`text-[16px] flex flex-row items-center gap-2 ${Element===currentTab?"bg-richblack-900 text-richblack-5 font-medium":" text-richblack-200 "} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`} key={index}
                    onClick={()=>{setMyCards(Element)}}>
                        {Element}
                    </div>
                )
            })
        }
      </div>
      <div className='h-[150px]'>
        {/* course card group */}
        <div className='lg:absolute flex flex-wrap left-0 mr-auto ml-auto gap-9 w-full justify-center '>
            {
                courses.map((element,index)=>{
                    return(
                        <CourseCard key={index} cardData={element}
                        setCurrentCard={setcurrentCard} currentCard={currentCard}/>
                    )
                })
            }
        </div>
      </div>
    </div>
  )
}

export default ExploreMore
