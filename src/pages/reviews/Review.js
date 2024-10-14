import React from 'react'
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import styles from "../../styles/Review.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { MoreDropdown } from '../../components/MoreDropdown';
import { axiosRes } from "../../api/axiosDefaults";

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
        <div>
            <hr />
            <Media>
                <Link to={`/profiles/${profile_id}`}>
                    <Avatar src={profile_image} />
                </Link>
                <Media.Body className="align-self-center ml-2">
                    <span className={styles.Owner}>{owner}</span>
                    <span className={styles.Date}>{updated_at}</span>
                    <p>{content}</p>
                </Media.Body>
                {is_owner && (
                    <MoreDropdown handleEdit={() => { }} handleDelete={handleDelete} />
                )}
            </Media>
        </div>
    )
}

export default Review;