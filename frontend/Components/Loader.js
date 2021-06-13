import React from "react";

export default function Loader() {
  return (
    <div className="loader">
      <svg
        className="loader__svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        shapeRendering="geometricPrecision"
        textRendering="geometricPrecision"
      >
        <defs>
          <linearGradient
            id="eTirUsNK2pd2-fill"
            x1="0"
            y1="250"
            x2="500"
            y2="250"
            spreadMethod="pad"
            gradientUnits="userSpaceOnUse"
          >
            <stop id="eTirUsNK2pd2-fill-0" offset="0%" stopColor="#0970C8" />
            <stop id="eTirUsNK2pd2-fill-1" offset="100%" stopColor="#542C96" />
          </linearGradient>
          <linearGradient
            id="eTirUsNK2pd7-stroke"
            x1="-54"
            y1="0"
            x2="54"
            y2="0"
            spreadMethod="pad"
            gradientUnits="userSpaceOnUse"
          >
            <stop id="eTirUsNK2pd7-stroke-0" offset="0%" stopColor="#0A7BDB" />
            <stop
              id="eTirUsNK2pd7-stroke-1"
              offset="100%"
              stopColor="#542C96"
            />
          </linearGradient>
        </defs>
        <rect
          id="eTirUsNK2pd2"
          width="500"
          height="500"
          rx="50"
          ry="50"
          fill="url(#eTirUsNK2pd2-fill)"
          stroke="none"
          strokeWidth="1"
        />
        <rect
          id="eTirUsNK2pd3"
          width="59"
          height="278"
          rx="29.5"
          ry="29.5"
          transform="translate(267 199)"
          fill="#F4F4F4"
          stroke="none"
          strokeWidth="1"
        />
        <g
          transform="rotate(-45 421.7 -248.2)"
          className="willAnimate"
          style={{ animationName: "eTirUsNK2pd4_tr__tr" }}
        >
          <rect
            id="eTirUsNK2pd4"
            width="59"
            height="278"
            rx="29.5"
            ry="29.5"
            transform="translate(-28.2 -255.6)"
            fill="#F4F4F4"
            stroke="none"
            strokeWidth="1"
          />
        </g>
        <g
          transform="rotate(90 36.2 260.3)"
          className="willAnimate"
          style={{ animationName: "eTirUsNK2pd5_tr__tr" }}
        >
          <rect
            id="eTirUsNK2pd5"
            width="59"
            height="185"
            rx="29.5"
            ry="29.5"
            transform="translate(-29.5 -171.3)"
            fill="#F4F4F4"
            stroke="none"
            strokeWidth="1"
          />
        </g>
        <g
          transform="translate(99.5 477)"
          className="willAnimate"
          style={{ animationName: "eTirUsNK2pd6_ts__ts" }}
        >
          <path
            id="eTirUsNK2pd6"
            d="M70 199h59v248.4a29.5 29.5 0 01-59 0V199z"
            transform="translate(-99.5 -477)"
            fill="#F4F4F4"
            stroke="none"
            strokeWidth="1"
          />
        </g>
        <circle
          id="eTirUsNK2pd7"
          r="41.5"
          transform="matrix(.89 0 0 .89 298.7 224.9)"
          fill="none"
          stroke="url(#eTirUsNK2pd7-stroke)"
          strokeWidth="25"
        />
        <g
          className="willAnimate"
          style={{ animationName: "eTirUsNK2pd8_to__to" }}
        >
          <g
            transform="translate(99.5 150.4)"
            className="willAnimate"
            style={{ animationName: "eTirUsNK2pd8_ts__ts" }}
          >
            <circle
              id="eTirUsNK2pd8"
              r="29.5"
              fill="#F4F4F4"
              stroke="none"
              strokeWidth="1"
            />
          </g>
        </g>
      </svg>
      <h3>The Clock is ticking...</h3>
    </div>
  );
}
