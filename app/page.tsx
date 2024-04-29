'use client';
import { useEffect, useState } from "react";
import WordRow from "./components/WordRow";
import styles from "./page.module.css";
import Keyboard from "./components/Keyboard";

/** MAYBE I COULD ADD A COOL THING WHICH GIVES YOU AN AI HINT! 
 * 
 * Instructions: 
 * * Spin up mock API - npm run mock-api
 * * Run app - npm run dev
 * 
*/

const WORD_LIST_API_URL = 'http://localhost:3001/words';

interface Word {
  id: number,
  word: string
}

export default function Home() {

  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [guessColors, setGuessColors] = useState(Array(6).fill(Array(5).fill('transparent')));
  const [charColors, setCharColors] = useState(Array(26).fill('transparent'));
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [lost, setLost] = useState(true);
  const [guessCount, setGuessCount] = useState(0);

  const checkRowColors = (guess: string, solution: string): string[] => {
    const guessColorsRow = Array(5).fill('grey');
    const upperCaseGuess = guess.toUpperCase();
    for (let i = 0; i < 5; i++) {
        if (upperCaseGuess[i] == solution[i]) {
          guessColorsRow[i] = 'green';
        }
    }
    for (let i = 0; i < 5; i++) {
        if (guessColorsRow[i] !== 'green') {
            for (let j = 0; j < 5; j++) {
                if (upperCaseGuess[i] == solution[j]) {
                  guessColorsRow[i] = 'orange';
                    break;
                }
            }
        }
    }

    return guessColorsRow;
  }

  const checkKeyboardColors = (guess: string, solution: string, letterColors: string[]): string[] => {
    const updatedLetterColors = [...letterColors];
    const alphabet = 'qwertyuiopasdfghjklzxcvbnm'.toUpperCase().split('');  
    const upperCaseGuess = guess.toUpperCase();
    for (let i = 0; i < 5; i++) {
      const letter = upperCaseGuess[i];
      const letterIndex = alphabet.findIndex(char => char === letter);
      if (letter === solution[i]) {
        updatedLetterColors[letterIndex] = 'green';
      }
      else if (solution.includes(letter)) {
        updatedLetterColors[letterIndex] = 'orange';
      }
      else {
        updatedLetterColors[letterIndex] = 'grey';
      }
    }

    return updatedLetterColors;
  }

  const finishGame = (win = false) => {
    setGameOver(true);
    if (win) {
      setLost(false);
    }
  }


  const updateGuesses = (guess: string, solution: string, charColors: string[]) => {
    const nextGuessIndex = guesses.findIndex(i => i === '');
    if (nextGuessIndex !== -1) {
      // update guesses
      const guessesArray = [...guesses];
      guessesArray[nextGuessIndex] = guess;
      setGuesses(guessesArray);
      // update row colors
      const guessColorsArray = [...guessColors];
      guessColorsArray[nextGuessIndex] = checkRowColors(guess, solution);
      setGuessColors(guessColorsArray);
      // update keyboard colors
      const keyboardColors = checkKeyboardColors(guess, solution, charColors)
      setCharColors(keyboardColors);
      // set number of guesses
      const numberOfGuesses = guessCount;
      setGuessCount(numberOfGuesses + 1);
      // check if gameEnds
      if (guess.toUpperCase() === solution) {
        finishGame(true);
      }
      if (guessCount == 5) {
        finishGame();
      }
    } else {
      finishGame();
    }
  }

  useEffect(() => {
    const startGame = async () => {
      try {
        const response = await fetch(WORD_LIST_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch data!')
        }
        const words : Word[] = await response.json();
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
        updateGuesses(currentGuess, solution, charColors);
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
  }, [currentGuess, solution, guesses, charColors, updateGuesses])

  return (
    <main className={styles.main}>
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex(word => word == '');
        return (
          <WordRow 
            key={i}
            guessText = {isCurrentGuess ? currentGuess : guess} 
            guessColor = {guessColors[i]}
          />
        )
      })}
      {gameOver ? lost ? <div>The word was {solution}</div> : <div>Congratulations!</div> : <div></div>}
      <Keyboard keyboardColors = {charColors}/>
    </main>
  );
}
