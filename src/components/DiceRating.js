import React from 'react';

const DiceRating = ({ value, onChange }) => {
    const diceImages = [
        'src/assets/dice1.png',
        'src/assets/dice2.png',
        'src/assets/dice3.png',
        'src/assets/dice4.png',
        'src/assets/dice5.png',
        'src/assets/dice6.png',
    ]; // Array of dice image paths

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
                        margin: '0 5px' // Add some margin between dice
                    }}
                />
            ))}
        </div>
    );
};

export default DiceRating;
