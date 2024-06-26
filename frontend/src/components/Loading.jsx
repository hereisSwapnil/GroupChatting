import React from "react";
import { Oval } from "react-loader-spinner";

const Loading = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Oval
        type="TailSpin"
        color="#000000"
        secondaryColor="#000000"
        height={80}
        width={80}
      />
    </div>
  );
};

export default Loading;
