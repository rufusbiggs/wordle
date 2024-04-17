import React from 'react'
import styles from "./../page.module.css";

const WordRow = ({ guessText, guessColor } : { guessText : string, guessColor : string[] }) => {
    // create tiles inside row
    // if guess is '' we want empty strings in each tile
    // loop through letters in guess and display them in the tiles
    const tiles = [];

    for (let i = 0; i < 5; i++) {
        const char = guessText[i];
        const color = guessColor[i];

        const tileStyle = {
          backgroundColor: color
        }

        tiles.push(
          <div className={styles.tile} style={tileStyle} key={i}>{char}</div>
        );
    }
  
    return (
    <div className={styles.row}>{tiles}</div>
  )
}

export default WordRow