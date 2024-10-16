import React from 'react';
import dice1 from '../assets/dice1.png';
import dice2 from '../assets/dice2.png';
import dice3 from '../assets/dice3.png';
import dice4 from '../assets/dice4.png';
import dice5 from '../assets/dice5.png';
import dice6 from '../assets/dice6.png';

const DiceRating = ({ value, onChange }) => {
    const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

    return (
        <div>
            {diceImages.map((dice, index) => (
                <img
                    key={index}
                    src={dice}
                    alt={`Dice ${index + 1}`}
                    onClick={() => onChange(index + 1)} // onClick updates the rating
                    style={{
                        cursor: 'pointer',
                        opacity: index < value ? 1 : 0.5, // Highlight selected dice
                        width: '50px', // Set a width
                        height: '50px', // Set a height
                        margin: '8px 5px' // Add some margin between dice
                    }}
                />
            ))}
        </div>
    );
};

export default DiceRating;
