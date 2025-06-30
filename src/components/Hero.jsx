import React from "react";
import Manimage from "../assets/manimage.png";
import RoundedImage from "../assets/roundedimage.png";

export default function Hero() {
  return (
    <div className="hero flex flex-row relative">
      <div className="flex flex-col gap-5 pt-50 pl-35 w-[45%]">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-1 font-medium text-2xl">
            <h3>Best Agency in </h3>
            <h3 className="text-blue-600">India</h3>
          </div>
          <h1 className="text-5xl font-medium">Digital Agency</h1>
          <h1 className="text-4xl font-light tracking-wide">& Solutions.</h1>
        </div>
        <p className="text-gray-400 w-[400px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt.
        </p>
        <div className="flex flex-row item-center gap-8 mt-5">
          <div className="flex flex-row items-center gap-3 justify-center bg-blue-600 text-white w-[194px] h-[50px] rounded-4xl">
            <button className="text-xl">Contact</button>
            <buttom className="mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                class="bi bi-arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
              </svg>
            </buttom>
          </div>
          <div className="flex flex-row items-center gap-2">
            <h6 className="text-xl font-medium">See Live Demo</h6>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="blue"
              class="bi bi-play-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="background w-[55%] relative">
        <img
          className="w-[52%] mt-15 ml-45 relative z-[100]"
          src={Manimage}
          alt="man image"
        />
        <img
          className="absolute top-0 right-0"
          src={RoundedImage}
          alt="rounded image"
        />
        <div className="bg-green-300 absolute opacity-15 w-[200px] h-[750px] top-[-80px] left-70 rotate-25"></div>
        {/* <div className='bg-green-300 absolute opacity-15 w-[300px] h-[820px] top-[-80px] left-170 rotate-25'></div> */}
      </div>
    </div>
  );
}
