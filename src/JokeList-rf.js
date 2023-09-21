import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */
export default function JokeList({numJokesToGet}) {
  
  const [jokes, setJokes] = useState({
    jokes: [],
    isLoading: true
  })

  useEffect( () => {
    
    const getJokes = async()=> {

      try {
        // load jokes one at a time, adding not-yet-seen jokes
        let jokes = [];
        let seenJokes = new Set();

        while (jokes.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...joke } = res.data;

          if (!seenJokes.has(joke.id)) {
            seenJokes.add(joke.id);
            jokes.push({ ...joke, votes: 0 });
          } else {
            console.log("duplicate found!");
          }
        }
        
        setJokes({ jokes, isLoading: false });
      } catch (err) {
        console.error(err);
      }
    }

    getJokes();
    }, [jokes.isLoading, numJokesToGet])

    const vote = (id, delta) => {
      setJokes(jks => {
      const st = {...jks}
      const jokes = st.jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j)

      return {
        jokes,
        isLoading: false
        }
      });
    }

    const generateNewJokes = () => {
      setJokes({
        jokes: [],
        isLoading: true
      })
    }

    let sortedJokes = [...jokes.jokes].sort((a, b) => b.votes - a.votes);

    if (jokes.isLoading) {
      return (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )
    }

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={()=>generateNewJokes()}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(j => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={vote}
          />
        ))}
      </div>
    );

  }

 

