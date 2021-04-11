import React from "react";
import ExamTimeIllustration from "@svgs/examTime.svg";
import LoginButton from "@components/Buttons/LoginButton";

export default function Hero({ setShowLoginOptions }) {
  return (
    <section className="hero maximumWidth">
      <ExamTimeIllustration className="hero__illustration" />
      <div className="content hero__content flex">
        <div className="hero__taglineWrap">
          <h2 className="hero__tagline">
            We care
            <br /> about your time.
          </h2>
          <p className="hero__subTagLine">
            And will help you get the most out of it by providing{" "}
            <a href="#info">a bit more</a> than just the reference notes.
          </p>

          <LoginButton size="large" setShowLoginOptions={setShowLoginOptions} />
        </div>

        <div className="hero__mockupWrap">
          <img
            src="https://res.cloudinary.com/rdaahal/image/upload/v1611655367/noteit/images/notesScreen_iuhveh.png"
            alt="notes screen sample"
            className="hero__mockup"
            width="480px"
          />
        </div>
      </div>
    </section>
  );
}
