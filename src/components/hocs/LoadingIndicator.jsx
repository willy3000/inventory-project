import React from "react";
import { ThreeDots } from "react-loader-spinner";

export default function LoadingIndicator(props) {
  const {
    height = "100",
    width = "100",
    radius = "9",
    color = "#A5B4FC",
  } = props;
  return (
    <div className="w-full flex justify-center items-center">
      <ThreeDots
        visible={true}
        height={height}
        width={width}
        color={color}
        radius={radius}
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
