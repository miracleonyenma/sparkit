import React from "react";
import { SVGProps } from "react";

export type TSVGElementProps = SVGProps<SVGSVGElement>;

const SparkitIcon: React.FC<TSVGElementProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="805"
      height="805"
      fill="none"
      viewBox="0 0 805 805"
      {...props}
    >
      <path
        fill="currentColor"
        d="M551.169 321.536H631.074V429.563H551.169z"
        opacity="0.6"
        transform="rotate(45 551.169 321.536)"
      ></path>
      <path
        fill="currentColor"
        d="M362.381 287h79.905v199.762H682v79.904H122.667v-79.904h183.037L196.979 378.037l56.501-56.502 108.901 108.902V287z"
      ></path>
    </svg>
  );
};

export default SparkitIcon;
