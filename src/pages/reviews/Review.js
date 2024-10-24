import React, { useState } from 'react'
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import styles from "../../styles/Review.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { MoreDropdown } from '../../components/MoreDropdown';
import { axiosRes } from "../../api/axiosDefaults";

import ReviewEditForm from "./ReviewEditForm";

// Handles review data and provides edit and delete options if profile's owner
const Review = (props) => {
    const {
        profile_id,
        profile_image,
        owner,
        updated_at,
        content,
        id,
        setGame,
        setReviews,
    } = props;

    const [showEditForm, setShowEditForm] = useState(false);
    const currentUser = useCurrentUser()
    const is_owner = currentUser?.username === owner;

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/reviews/${id}/`);
            setGame((prevGame) => ({
                results: [
                    {
                        ...prevGame.results[0],
                        reviews_count: prevGame.results[0].reviews_count - 1,
                    },
                ],
            }));

            setReviews((prevReviews) => ({
                ...prevReviews,
                results: prevReviews.results.filter((review) => review.id !== id),
            }));
        } catch (err) { }
    };

    return (
        <>
            <hr />
            <Media>
                <Link to={`/profiles/${profile_id}`}>
                    <Avatar src={profile_image} />
                </Link>
                <Media.Body className="align-self-center ml-2">
                    <span className={styles.Owner}>{owner}</span>
                    <span className={styles.Date}>{updated_at}</span>
                    {showEditForm ? (
                        <ReviewEditForm
                            id={id}
                            profile_id={profile_id}
                            content={content}
                            profileImage={profile_image}
                            setReviews={setReviews}
                            setShowEditForm={setShowEditForm}
                        />
                    ) : (
                        <p>{content}</p>
                    )}
                </Media.Body>
                {is_owner && !showEditForm && (
                    <MoreDropdown
                        handleEdit={() => setShowEditForm(true)}
                        handleDelete={handleDelete}
                    />
                )}
            </Media>
        </>
    );
};

export default Review;