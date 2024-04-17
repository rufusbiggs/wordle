'use client';
import { useEffect, useState } from "react";
import WordRow from "./components/WordRow";
import styles from "./page.module.css";

/** MAYBE I COULD ADD A COOL THING WHICH GIVES YOU AN AI HINT! */

const WORD_LIST_API_URL = 'http://localhost:3001/words';

export default function Home() {

  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentGuess, setCurrentGuess] = useState('');

  const updateGuesses = (guess: string) => {
    const nextGuessIndex = guesses.findIndex(i => i === '');
    if (nextGuessIndex !== -1) {
      const guessesArray = [...guesses];
      guessesArray[nextGuessIndex] = guess;
      setGuesses(guessesArray);
    } else {
      console.log(`No more guesses!`);
    }
  }

  useEffect(() => {
    const startGame = async () => {
      try {
        const response = await fetch(WORD_LIST_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch data!')
        }
        const words : string[] = await response.json();
        const randomWord : string = words[Math.floor(Math.random() * words.length)];
        setSolution(randomWord);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

    startGame();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (currentGuess.length !== 5) {
          return;
        }
        /** do the check answer thing 
         * Set Guesses[i] to be input
         * Check if guess is same as solution (text transform)
         * Turn tiles the nexessary colors
         * Move on if not the solution
        */
        updateGuesses(currentGuess);
        setCurrentGuess('');
      }
      else if (event.key === 'Backspace') {
        setCurrentGuess(oldGuess => oldGuess.slice(0, -1));
      }
      else if (currentGuess.length === 5) {
        return;
      }
      else setCurrentGuess(oldGuess => oldGuess + event.key);
    }

    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess])

  // keyboard effect! Function for handling typing, event will be the keyboard press.
  // if event.key == 'Enter' then the guess should be submitted
  // setCurrentGuess(oldGuess => oldGuess + event.key)
  // window.addEventListener('keydown', handleType);
  //
  // return () => window.removeEventListener('keydown', handleType);

  return (
    <main className={styles.main}>
      {/* map over guesses */}
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex(word => word == '');
        return (
          <WordRow inputs = {isCurrentGuess ? currentGuess : guess} />
        )
      })}
    </main>
  );
}
