import React from 'react';
import dice1 from '../assets/dice1.png';
import dice2 from '../assets/dice2.png';
import dice3 from '../assets/dice3.png';
import dice4 from '../assets/dice4.png';
import dice5 from '../assets/dice5.png';
import dice6 from '../assets/dice6.png';
import styles from '../styles/DiceRating.module.css';

// DiceRating asset for the Rating section
const DiceRating = ({ value, onChange }) => {
    const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

    return (
        <div>
            {diceImages.map((dice, index) => (
                <img
                    key={index}
                    src={dice}
                    alt={`Dice ${index + 1}`}
                    onClick={() => onChange(index + 1)}
                    className={`${styles.Dice} ${index < value ? styles.active : ''}`}
                />
            ))}
        </div>
    );
};

export default DiceRating;
