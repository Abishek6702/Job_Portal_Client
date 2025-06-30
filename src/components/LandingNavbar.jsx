import React from "react";
import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <div className="absolute z-1 pl-36 pt-5 pb-5 ">
      <div className="flex flex-row justify-evenly items-center gap-105 w-[100%] h-[70px] ">
        <div>
          <h1 className="text-4xl font-bold">Job Portal</h1>
        </div>
        <div className="flex flex-row gap-10">
          <button className="text-white">Home</button>
          <button className="text-white">About</button>
          <button className="text-white">Portfolio</button>
          <button className="text-white">Services</button>
           <button className="text-white">Contact</button>
           <Link to="/"  className="text-white font-bold p-2 px-3 rounded-2xl bg-blue-600">Login / SignUp</Link>

          {/* <div className="flex flex-row items-center gap-3 w-[170px] h-[44px] bg-blue-600 text-white rounded-4xl justify-center">
            <button className="">Login</button>
            
          </div> */}
        </div>
      </div>
    </div>
  );
}
