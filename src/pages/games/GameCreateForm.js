import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import Upload from "../../assets/upload.png";

import styles from "../../styles/GameCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import Asset from "../../components/Asset";
import { Image } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Handles Create game data
function GameCreateForm() {
  useRedirect('loggedOut');
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    designer: "",
    artist: "",
    publisher: "",
    min_players: 1,
    max_players: 10,
    solo_play: false,
    genre_filter: "none",
    image: "",
  });
  const {
    title,
    description,
    designer,
    artist,
    publisher,
    min_players,
    max_players,
    solo_play,
    genre_filter,
    image
  } = postData;

  const imageInput = useRef(null);
  const history = useHistory();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setPostData({
      ...postData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setPostData({
        ...postData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  // Submits Create Game data
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('designer', designer);
    formData.append('artist', artist);
    formData.append('publisher', publisher);
    formData.append('min_players', min_players);
    formData.append('max_players', max_players);
    formData.append('solo_play', solo_play);
    formData.append('genre_filter', genre_filter);

    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.post('/games/', formData);
      history.push(`/games/${data.id}`);
      toast.success('Game created successfully!');
    } catch (err) {
      console.log(err.response?.data);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="description"
          value={description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
      </Form.Group>
      {errors?.description?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Designer</Form.Label>
        <Form.Control
          type="text"
          name="designer"
          value={designer}
          onChange={handleChange}
          placeholder="Designer"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Artist</Form.Label>
        <Form.Control
          type="text"
          name="artist"
          value={artist}
          onChange={handleChange}
          placeholder="Artist"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Publisher</Form.Label>
        <Form.Control
          type="text"
          name="publisher"
          value={publisher}
          onChange={handleChange}
          placeholder="Publisher"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Minimum # of Players</Form.Label>
        <Form.Control
          type="number"
          name="min_players"
          value={min_players}
          onChange={handleChange}
          placeholder="Min players"
          min="1"
          max="10"
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Maximum # of Players</Form.Label>
        <Form.Control
          type="number"
          name="max_players"
          value={max_players}
          onChange={handleChange}
          placeholder="Max players"
          min="1"
          max="10"
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Solo Play (Check if 'yes')</Form.Label>
        <Form.Control
          type="checkbox"
          name="solo_play"
          checked={solo_play}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Genre Filter</Form.Label>
        <Form.Control
          as="select"
          name="genre_filter"
          value={genre_filter}
          onChange={handleChange}
        >
          <option value="none">None</option>
          <option value="family">Family Game</option>
          <option value="dexterity">Dexterity Game</option>
          <option value="party">Party Game</option>
          <option value="abstract">Abstract Game</option>
          <option value="thematic">Thematic Game</option>
          <option value="eurogame">Eurogame</option>
          <option value="wargame">Wargame</option>
        </Form.Control>
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              {image ? (
                <>
                  <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                  </figure>
                  <div>
                    <Form.Label
                      className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                      htmlFor="image-upload"
                    >
                      Change the image
                    </Form.Label>
                  </div>
                </>
              ) : (
                <Form.Label
                  className="d-flex justify-content-center"
                  htmlFor="image-upload"
                >
                  <Asset
                    src={Upload}
                    message="Click or tap to upload an image"
                  />
                </Form.Label>
              )}

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.title?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default GameCreateForm;