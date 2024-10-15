import React, { useState, useEffect } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import Asset from './Asset'; // Optional spinner or error handler
import { useCurrentUser } from '../contexts/CurrentUserContext';
import DiceRating from './DiceRating';

const Rating = ({ gameId }) => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [userRating, setUserRating] = useState(null); // Stores the user's selected rating
    const currentUser = useCurrentUser();

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const { data } = await axiosReq.get(`/ratings/?game=${gameId}`);
                setRatings(data.results);
                // Calculate average rating
                const total = data.results.reduce((sum, rating) => sum + rating.rating, 0);
                const avg = total / data.results.length || 0;
                setAverageRating(avg.toFixed(1)); // Round to 1 decimal
            } catch (err) {
                setError(true);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRatings();
    }, [gameId]);

    const handleSubmitRating = async (event) => {
        event.preventDefault();
        if (!currentUser) {
            alert('You must be logged in to submit a rating.');
            return;
        }
        if (userRating == null) {
            alert('Please select a rating.');
            return;
        }

        try {
            // Post the rating to the backend
            const { data } = await axiosReq.post('/ratings/', {
                rating: userRating,
                game: gameId
            });
            // Update the ratings list to include the new rating
            setRatings((prevRatings) => [...prevRatings, data]);
            // Recalculate the average rating
            const newTotal = [...ratings, data].reduce((sum, rating) => sum + rating.rating, 0);
            const newAvg = newTotal / [...ratings, data].length;
            setAverageRating(newAvg.toFixed(1));
            setUserRating(null); // Reset the user's selected rating after submission
        } catch (err) {
            console.error('Error submitting rating:', err);
        }
    };

    if (loading) return <Asset spinner />; // Display a spinner while loading
    if (error) return <div>There was an error loading the ratings.</div>;

    return (
        <div>
            <h4>Average Rating: {averageRating}/5</h4>
            <div>
                {ratings.length > 0 ? (
                    <ul>
                        {ratings.map((rating) => (
                            <li key={rating.id}>
                                {rating.owner}: {rating.rating}/5
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No ratings yet for this game.</p>
                )}
            </div>
            {/* Rating submission form */}
            {currentUser && (
                <form onSubmit={handleSubmitRating}>
                    <h5>Submit your rating:</h5>
                    <DiceRating value={userRating} onChange={setUserRating} />
                    <button type="submit">Submit Rating</button>
                </form>
            )}
        </div>
    );
};

export default Rating;
