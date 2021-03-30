import Container from "@components/Container";
import React, { useEffect, useState } from "react";

export default function Page404() {
  const [joke, setJoke] = useState(null);

  useEffect(() => {
    if (!joke) {
      fetch(
        "https://us-central1-dadsofunny.cloudfunctions.net/DadJokes/random/type/programming"
      )
        .then((res) => res.json())
        .then((joke) => setJoke(joke[0]))
        .catch((err) => console.log(err));
    }
  }, [joke]);

  function Joke() {
    return (
      <div className="404__jokeContent">
        <h4>Meanwhile, here is a joke that you might like.</h4>
        <h5>{joke.setup}</h5>
        <em>{joke.punchline}</em>
      </div>
    );
  }

  return (
    <Container className="page404">
      <div className="page404__general">
        <h2>Are You Lost ?</h2>
        <h4>404 Page Not Found</h4>
        <p>
          Check that you typed the address correctly, go back to our home page
          or try using our site search to find something specific.
        </p>
        <a href="/" className="btn btn--large btn--brand page404__home">
          Go back to the Home page
        </a>
      </div>
      <div className="page404__joke">{joke ? <Joke /> : null}</div>
    </Container>
  );
}
