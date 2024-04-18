import React from 'react'
import styles from "./../page.module.css";

const Keyboard = ({keyboardColors} : {keyboardColors: string[]}) => {

    const topRow = [];
    const middleRow = [];
    const bottomRow = [];

    const topRowChar = 'qwertyuiop'.split('');
    const middleRowChar = 'asdfghjkl'.split('');
    const bottomRowChar = 'zxcvbnm'.split('');

    for (let i = 0; i < 26; i++) {
        const buttonStyle = {
            backgroundColor: keyboardColors[i]
        }
        if (i < 10) {
            topRow.push(<div className={styles.button} style={buttonStyle} key={i}>{topRowChar[i]}</div>)
        }
        else if (i < 19) {
            middleRow.push(<div className={styles.button} style={buttonStyle} key={i}>{middleRowChar[i-10]}</div>)
        }
        else {
            bottomRow.push(<div className={styles.button} style={buttonStyle} key={i}>{bottomRowChar[i-19]}</div>)
        }
    }

  return (
        <ul className={styles.keyboard}>
            <li className={styles.keyboardRow}>
                {topRow}
            </li>
            <li className={styles.keyboardRow}>
                {middleRow}
            </li>
            <li className={styles.keyboardRow}>
                {bottomRow}
            </li>
        </ul>
  )
}

export default Keyboard