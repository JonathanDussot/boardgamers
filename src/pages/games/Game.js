import React from 'react'
import styles from "../../styles/Game.module.css"
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from '../../components/MoreDropdown';

const Game = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    reviews_count,
    likes_count,
    like_id,
    title,
    description,
    designer,
    artist,
    publisher,
    min_players,
    max_players,
    solo_play,
    genre_filter,
    image,
    updated_at,
    gamePage,
    setGames,
    rating_count,
    average_rating,
  } = props;

  // Checks user is owner
  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner
  const history = useHistory();

  // Routes user to edit form
  const handleEdit = () => {
    history.push(`/games/${id}/edit`);
  };

  // Handles delete function
  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/games/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  // Handles 'like' function
  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { game: id });
      setGames((prevGames) => ({
        ...prevGames,
        results: prevGames.results.map((game) => {
          return game.id === id
            ? { ...game, likes_count: game.likes_count + 1, like_id: data.id }
            : game;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Handles 'unlike' function
  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setGames((prevGames) => ({
        ...prevGames,
        results: prevGames.results.map((game) => {
          return game.id === id
            ? { ...game, likes_count: game.likes_count - 1, like_id: null }
            : game;
        }),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return <Card className={styles.Game}>
    <Card.Body>
      <Media className="align-items-center justify-content-between">
        <Link to={`/profiles/${profile_id}`}>
          <Avatar src={profile_image} height={55} />
          {owner}
        </Link>
        <div className="d-flex align-items-center">
          <span>{updated_at}</span>
          {is_owner && gamePage && <MoreDropdown
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />}
        </div>
      </Media>
    </Card.Body>
    <Link to={`/games/${id}`}>
      <Card.Img src={image} alt={title} height={540} />
    </Link>
    <Card.Body>
      <Link to={`/games/${id}`}>
        {title && <Card.Title className="text-center">{title}</Card.Title>}
      </Link>
      {designer && <Card.Text className="text-left" style={{ marginBottom: '0.25rem' }}>Designer: {designer}</Card.Text>}
      {artist && <Card.Text className="text-left" style={{ marginBottom: '0.25rem' }}>Artist: {artist}</Card.Text>}
      {publisher && <Card.Text className="text-left" style={{ marginBottom: '0.25rem' }}>Publisher: {publisher}</Card.Text>}
      {min_players && (
        <Card.Text className="text-right" style={{ marginBottom: '0.25rem' }}>
          {min_players}
          {max_players && max_players !== min_players && ` - ${max_players}`} players game
          {solo_play && ' (Solo Play Available)'}
        </Card.Text>
      )}
      {genre_filter && <Card.Text className="text-right" style={{ marginBottom: '0.25rem' }}>Genre: {genre_filter}</Card.Text>}
      <hr />
      <hr />
      {description && <Card.Text>{description}</Card.Text>}
      <div className={styles.GameBar}>
        {is_owner ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>You can't like your own post!</Tooltip>}
          >
            <i className="far fa-heart" />
          </OverlayTrigger>
        ) : like_id ? (
          <span onClick={handleUnlike}>
            <i className={`fas fa-heart ${styles.Heart}`} />
          </span>
        ) : currentUser ? (
          <span onClick={handleLike}>
            <i className={`far fa-heart ${styles.HeartOutline}`} />
          </span>
        ) : (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Log in to like game posts!</Tooltip>}
          >
            <i className="far fa-heart" />
          </OverlayTrigger>
        )}
        {likes_count}
        <Link to={`/games/${id}`}>
          <i className="far fa-comments" />
        </Link>
        {reviews_count}
        <Link to={`/games/${id}`}>
          <i className="fa-solid fa-ranking-star" />
          <span className={styles.Rating}>
            Avg: {average_rating} ({rating_count} ratings)
          </span>
        </Link>
      </div>
    </Card.Body>
  </Card>
};

export default Game