import React, { useState, useEffect } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import Asset from '../../components/Asset';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import DiceRating from '../../components/DiceRating';
import styles from "../../styles/Rating.module.css"

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Rating = ({ gameId }) => {
    const [ratings, setRatings] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [userRating, setUserRating] = useState(null);
    const [editingRatingId, setEditingRatingId] = useState(null);
    const [editingValue, setEditingValue] = useState(null);
    const currentUser = useCurrentUser();

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const { data } = await axiosReq.get(`/ratings/?game=${gameId}`);
                setRatings(data.results);
                const showDeletedToast = localStorage.getItem('showDeletedToast');
                /**
                * Show success message if localstorage deems that a 
                * rating has been deleted and page reloaded
                */
                if (showDeletedToast) {
                    toast.success('Rating deleted successfully!');
                    localStorage.removeItem('showDeletedToast');
                }
                // Calculate average rating
                if (data.results.length > 0) {
                    const total = data.results.reduce((sum, rating) => sum + rating.rating, 0);
                    const avg = total / data.results.length;
                    setAverageRating(avg.toFixed(1));
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
        // Informs users must be logged in to give a rating
        if (!currentUser) {
            alert('You must be logged in to submit a rating.');
            return;
        }
        // I user submits without choosing a rating
        if (userRating == null) {
            alert('Please select a rating.');
            return;
        }

        const existingRating = ratings.find((rating) => rating.owner === currentUser.username);

        // If an existing rating is found, update the editing state instead of submitting a new rating
        if (existingRating) {
            alert('You have already rated this game. Please edit your existing rating.');
            setEditingRatingId(existingRating.id);
            setEditingValue(existingRating.rating);
            return;
        }

        try {
            // Posts user rating
            const { data } = await axiosReq.post('/ratings/', {
                rating: userRating,
                game: gameId
            });
            setRatings((prevRatings) => [...prevRatings, data]);

            // Updates average rating
            const newAvg = ((averageRating * ratings.length) + userRating) / (ratings.length + 1);
            setAverageRating(newAvg.toFixed(1));
            setUserRating(null);
            toast.success('Rating submitted successfully!');
        } catch (err) {
            console.error('Error submitting rating:', err);
        }
    };

    // Updated new edited rating
    const handleEditRating = async (ratingId) => {
        try {
            const { data } = await axiosReq.put(`/ratings/${ratingId}/`, {
                rating: editingValue,
                game: gameId
            });
            setRatings((prevRatings) =>
                prevRatings.map((rating) =>
                    rating.id === ratingId ? { ...rating, rating: data.rating } : rating
                )
            );

            const total = ratings.reduce((sum, rating) => sum + rating.rating, 0) - (ratings.find(r => r.id === ratingId).rating) + editingValue;
            const newAvg = total / ratings.length;
            setAverageRating(newAvg.toFixed(1));

            setEditingRatingId(null);
            setEditingValue(null);
            toast.success('Rating updated successfully!');
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

    // Deletes user's rating
    const handleDeleteRating = async (ratingId) => {
        try {
            await axiosReq.delete(`/ratings/${ratingId}/`);
            localStorage.setItem('showDeletedToast', true);
            window.location.reload();
        } catch (err) {
            console.error('Error deleting rating:', err);
        }
    };

    if (loading) return <Asset spinner />;
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
                                    className={`${styles.RatingImg}`}
                                    src={rating.profile_image}
                                    alt={`${rating.owner}'s profile`}
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
