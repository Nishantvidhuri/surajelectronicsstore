import React from "react";
const sunImageUrl = "/icons/images.png";


const TVLoader = () => {
  return (
    <div className=" w-screen h-screen bg-white flex items-center justify-center">
      <div className="fixed">
        {/* TV Screen */}
        <div className="w-80 h-48 bg-gray-100 rounded-md  border-gray-900 overflow-hidden flex items-center justify-center">
          <img
            src={sunImageUrl}
            alt="Sun Spinner"
            className="w-56 h-30 animate-spin"
            style={{ animationDuration: '1.5s' }}
          />
        </div>


        {/* Bottom Bezel */}
        <div className="absolute bottom-[6px] left-0 right-0 h-2 bg-black"></div>

        {/* TV Stand - Base - Moved Up */}
        <div className="absolute -bottom-[32px] left-1/2 transform -translate-x-1/2 w-40 h-3 bg-gray-900 rounded-md shadow-md"></div>

        {/* TV Stand - Neck - Moved Up */}
        <div className="absolute -bottom-[31px] left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-800 rounded-t-full"></div>

        {/* Side Bezels - Adjusted Bottom */}
        <div className="absolute top-0 bottom-[14px] left-0 w-2 bg-black"></div>
        <div className="absolute top-0 bottom-[14px] right-0 w-2 bg-black"></div>
        {/* Top Bezel */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-black"></div>
      </div>
    </div>
  );
};

export default TVLoader;