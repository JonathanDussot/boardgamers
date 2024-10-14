import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Game from "./Game";
import Review from "../reviews/Review";

import ReviewCreateForm from "../reviews/ReviewCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function GamePage() {
    const { id } = useParams();
    const [game, setGame] = useState({ results: [] });
    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;
    const [reviews, setReviews] = useState({ results: [] });

    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{ data: game }, { data: reviews }] = await Promise.all([
                    axiosReq.get(`/games/${id}`),
                    axiosReq.get(`/reviews/?game=${id}`)
                ])
                setGame({ results: [game] })
                setReviews(reviews);
            } catch (err) {
                console.log(err)
            }
        }

        handleMount()
    }, [id]);


    return (
        <Row className="h-100">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <p>Popular profiles for mobile</p>
                <Game {...game.results[0]} setGames={setGame} gamePage />
                <Container className={appStyles.Content}>
                    {currentUser ? (
                        <ReviewCreateForm
                            profile_id={currentUser.profile_id}
                            profileImage={profile_image}
                            game={id}
                            setGame={setGame}
                            setReviews={setReviews}
                        />
                    ) : reviews.results.length ? (
                        "Reviews"
                    ) : null}
                    {reviews.results.length ? (
                        reviews.results.map((review) => (
                            <Review
                                key={review.id}
                                {...review}
                                setGame={setGame}
                                setReviews={setReviews}
                            />
                        ))
                    ) : currentUser ? (
                        <span>No reviews yet, be the first to review this game!</span>
                    ) : (
                        <span>No reviews...yet</span>
                    )}
                </Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                Popular profiles for desktop
            </Col>
        </Row>
    );
}

export default GamePage;