import React, { Component } from "react";
import JokeList from "./JokeList-rf";

/** App component. Renders list of jokes. */

export default function App () {
  JokeList.defaultProps = {
    numJokesToGet: 5
  }
  return (
    <div className="App">
      <JokeList />
    </div>
  );
}

