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
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/games/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/games/${id}/`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

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
      <Card.Img src={image} alt={title} />
    </Link>
    <Card.Body>
      {title && <Card.Title className="text-center bold">{title}</Card.Title>}
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
      </div>
    </Card.Body>
  </Card>
};

export default Game