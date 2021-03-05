import React from "react";

export default function Process() {
  const processes = [
    {
      title: "Sign up for an account",
      description:
        'You can easily sign up via "Facebook" or "Google" and be a member of NoteIT.',
    },
    {
      title: "Get a list of available notes",
      description:
        "We will send you a list of notes based on your faculty and semester.",
    },
    {
      title: "Browse the notes",
      description:
        "Easily view and read notes on up to three different device(s), using the same account.",
    },
    {
      title: "Save the notes",
      description:
        'You can "save" the notes into your account to have easy access later on.',
    },
    {
      title: "Ask questions",
      description:
        'Clear your confusions by chatting with the "note contributor" themselves.',
    },
  ];

  function Processes() {
    return (
      <div className="processContainer__processWrap flex centerContents flex--cr flex--wrap">
        {processes.map((process, index) => {
          const { title, description } = process;
          return (
            <div
              key={index}
              className="processContainer__process card"
              data-process-no={++index}
            >
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section className="processContainer maximumWidth">
      <div className="content">
        <h2 className="heading">This is how it works</h2>
        <Processes />
      </div>
    </section>
  );
}
