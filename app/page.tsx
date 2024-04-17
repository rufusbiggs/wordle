'use client';
import { useEffect, useState } from "react";
import WordRow from "./components/WordRow";
import styles from "./page.module.css";

/** MAYBE I COULD ADD A COOL THING WHICH GIVES YOU AN AI HINT! 
 * 
 * 
 * Remember to spin up mock API!!!!!
 * 
 * 
*/

const WORD_LIST_API_URL = 'http://localhost:3001/words';

interface words {
  id: number,
  word: string
}

export default function Home() {

  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [guessColors, setGuessColors] = useState(Array(6).fill(Array(5).fill('transparent')));
  const [currentGuess, setCurrentGuess] = useState('');

  const checkGuess = (guess: string, solution: string): string[] => {
    const guessColors: string[] = Array(5).fill('grey');

    for (let i = 0; i < 5; i++) {
        if (guess[i] === solution[i]) {
            guessColors[i] = 'green';
        }
    }
    for (let i = 0; i < 5; i++) {
        if (guessColors[i] !== 'green') {
            for (let j = 0; j < 5; j++) {
                if (guess[i] === solution[j]) {
                    guessColors[i] = 'yellow';
                    break;
                }
            }
        }
    }

    return guessColors;
  }


  const updateGuesses = (guess: string, solution: string) => {
    const nextGuessIndex = guesses.findIndex(i => i === '');
    if (nextGuessIndex !== -1) {
      const guessesArray = [...guesses];
      guessesArray[nextGuessIndex] = guess;
      setGuesses(guessesArray);
      const guessColorsArray = [...guessColors];
      guessColorsArray[nextGuessIndex] = checkGuess(guess, solution);
      setGuessColors(guessColorsArray);
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
        const words : words[] = await response.json();
        const randomWord : string = words[Math.floor(Math.random() * words.length)].word;
        setSolution(randomWord);
        console.log(randomWord)
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
        updateGuesses(currentGuess, solution);
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
          <WordRow 
            guessText = {isCurrentGuess ? currentGuess : guess} 
            guessColor = {guessColors[i]}
          />
        )
      })}
      {guessColors.map(colors => {
        return (
          <div>{colors}</div>
        )
      })}
      <p>{solution}</p>
    </main>
  );
}
