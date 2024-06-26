import React from "react";

const YourMessage = ({ message }) => {
  return (
    <div className="col-start-1 col-end-8 p-3 rounded-lg">
      <div className="flex flex-row-reverse items-center gap-[10px]">
        {/* <img
          alt=""
          src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
          className="size-10 rounded-full object-cover"
        /> */}
        <div className="relative text-sm bg-white py-2 px-4 shadow rounded-xl max-w-[70%]">
          <div>{message}</div>
        </div>
      </div>
    </div>
  );
};

export default YourMessage;
