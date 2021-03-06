import React, { useEffect, useState } from "react";
import ExamTimeIllustration from "@svgs/examTime.svg";
import isScreenLargerThan from "@utils/screenSize";
import TextWithIcon from "@components/TextWithIcon";
import getIconPaths from "@utils/iconDetails";

export default function Hero({ setShowLoginOptions }) {
  const [isScreenWide, setIsScreenWide] = useState(false);

  useEffect(() => {
    if (isScreenLargerThan(768)) {
      setIsScreenWide(true);
    }
  }, []);

  return (
    <section className="hero maximumWidth">
      {isScreenWide ? (
        <ExamTimeIllustration className="hero__illustration" />
      ) : (
        ""
      )}
      <div className="content hero__content flex">
        <div className="hero__taglineWrap">
          <h1 className="hero__tagline">
            We care
            <br /> about your time.
          </h1>
          <p className="hero__subTagLine">
            And will help you save it by providing quality notes, that are easy
            to refer and understand.
          </p>

          <button
            type="button"
            className="hero__cta btn btn--accent btn--large"
            onClick={() => setShowLoginOptions(true)}
          >
            <TextWithIcon
              textContent="Let's NoteIT"
              pathData={getIconPaths("login")}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              iconWidth="2rem"
            />
          </button>
        </div>

        <div className="hero__mockupWrap">
          <img
            src="https://res.cloudinary.com/rdaahal/image/upload/v1611655367/noteit/images/notesScreen_iuhveh.png"
            alt="notes screen sample"
            className="hero__mockup"
            width="480px"
          />
          <i className="fas fa-play font-3x desktop"></i>
        </div>
      </div>
    </section>
  );
}
