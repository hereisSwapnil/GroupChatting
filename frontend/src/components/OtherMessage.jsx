import React from "react";

const OtherMessage = ({ message, image, name }) => {
  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg">
      <div className="flex flex-row items-center gap-[10px]">
        <img alt="" src={image} className="size-10 rounded-full object-cover" />

        <div className="relative text-sm bg-white py-2 px-4 shadow rounded-xl max-w-[70%]">
          <div className="text-xs mb-1 font-bold">{name}</div>
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default OtherMessage;
