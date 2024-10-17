import React, { useState, useEffect } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import Asset from './Asset'; // Optional spinner or error handler
import { useCurrentUser } from '../contexts/CurrentUserContext';
import DiceRating from './DiceRating';
import styles from "../styles/Rating.module.css"

const Rating = ({ gameId }) => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [userRating, setUserRating] = useState(null); // Stores the user's selected rating
    const [editingRatingId, setEditingRatingId] = useState(null); // Rating being edited
    const [editingValue, setEditingValue] = useState(null);
    const currentUser = useCurrentUser();

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const { data } = await axiosReq.get(`/ratings/?game=${gameId}`);
                setRatings(data.results);
                // Calculate average rating
                if (data.results.length > 0) {
                    const total = data.results.reduce((sum, rating) => sum + rating.rating, 0);
                    const avg = total / data.results.length;
                    setAverageRating(avg.toFixed(1)); // Round to 1 decimal
                } else {
                    // If there are no ratings, set average rating to 0 or some default message
                    setAverageRating(0);
                }
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

        const existingRating = ratings.find((rating) => rating.owner === currentUser.username);

        // If an existing rating is found, update the editing state instead of submitting a new rating
        if (existingRating) {
            alert('You have already rated this game. Please edit your existing rating.');
            setEditingRatingId(existingRating.id); // Set the ID for editing
            setEditingValue(existingRating.rating); // Pre-fill the editing value
            return;
        }

        try {
            const { data } = await axiosReq.post('/ratings/', {
                rating: userRating,
                game: gameId
            });
            setRatings((prevRatings) => [...prevRatings, data]);

            // Update average rating
            const newAvg = ((averageRating * ratings.length) + userRating) / (ratings.length + 1);
            setAverageRating(newAvg.toFixed(1));
            setUserRating(null); // Reset user rating after submission
        } catch (err) {
            console.error('Error submitting rating:', err);
        }
    };

    const handleEditRating = async (ratingId) => {
        try {
            console.log(`Updating rating with ID: ${ratingId}, new value: ${editingValue}`);
            const { data } = await axiosReq.put(`/ratings/${ratingId}/`, {
                rating: editingValue,
                game: gameId
            });
            console.log('Updated data received:', data);
            setRatings((prevRatings) =>
                prevRatings.map((rating) =>
                    rating.id === ratingId ? { ...rating, rating: data.rating } : rating
                )
            );

            const total = ratings.reduce((sum, rating) => sum + rating.rating, 0) - (ratings.find(r => r.id === ratingId).rating) + editingValue;
            const newAvg = total / ratings.length;
            setAverageRating(newAvg.toFixed(1)); // Round to 1 decimal

            // Reset editing states
            setEditingRatingId(null);
            setEditingValue(null);
        } catch (err) {
            console.error('Error editing rating:', err);

            if (err.response) {
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
                console.error('Response headers:', err.response.headers);
            } else if (err.request) {
                console.error('No response received:', err.request);
            } else {
                console.error('Error setting up the request:', err.message);
            }
        }
    };

    const handleDeleteRating = async (ratingId) => {
        try {
            await axiosReq.delete(`/ratings/${ratingId}/`);
            window.location.reload();
        } catch (err) {
            console.error('Error deleting rating:', err);
        }
    };

    if (loading) return <Asset spinner />; // Display a spinner while loading
    if (error) return <div>There was an error loading the ratings.</div>;

    const userHasRated = ratings.some((rating) => rating.owner === currentUser?.username);

    return (
        <div>
            <h4>
                Average Rating: {ratings.length > 0 ? `${isNaN(averageRating) ? 0 : averageRating}/6` : 'No ratings yet'}
            </h4>
            <div>
                {ratings.length > 0 ? (
                    <ul>
                        {ratings.map((rating) => (
                            <li key={rating.id}>
                                <img
                                    src={rating.profile_image}
                                    alt={`${rating.owner}'s profile`}
                                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px' }}  // Styling the image
                                />
                                {rating.owner}: {rating.rating}/6
                                {rating.owner === currentUser?.username && (
                                    <div>
                                        <button
                                            className={`${styles.Button}`}
                                            onClick={() => {
                                                setEditingRatingId(rating.id);
                                                setEditingValue(rating.rating);
                                            }}>
                                            Edit
                                        </button>
                                        <button
                                            className={`${styles.Button}`}
                                            onClick={() => handleDeleteRating(rating.id)}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No ratings yet for this game.</p>
                )}
            </div>
            {currentUser && !userHasRated && (
                <form onSubmit={handleSubmitRating}>
                    <h5>Submit your rating:</h5>
                    <DiceRating value={userRating} onChange={setUserRating} />
                    <button className={`${styles.Button}`} type="submit">Submit Rating</button>
                </form>
            )}
            {editingRatingId && (
                <div>
                    <h5>Edit your rating:</h5>
                    <DiceRating value={editingValue} onChange={setEditingValue} />
                    <button
                        className={`${styles.Button}`}
                        onClick={() => handleEditRating(editingRatingId)}>Update Rating</button>
                </div>
            )}
        </div>
    );
};

export default Rating;
