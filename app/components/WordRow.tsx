import React from 'react'
import styles from "./../page.module.css";

const WordRow = ({ inputs } : { inputs : string }) => {
    // create tiles inside row
    // if guess is null we want empty strings in each tile
    // loop through letters in guess and display them in the tiles
    const tiles = [];

    for (let i = 0; i < 5; i++) {
        const char = inputs[i];
        tiles.push(<div className={styles.tile}>{char}</div>);
    }
  
    return (
    <div className={styles.row}>{tiles}</div>
  )
}

export default WordRow