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

import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import Rating from './../../components/Rating'

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

    const gameTitle = game.results.length > 0 ? game.results[0].title : "Game Title";

    return (
        <Row className="h-100 justify-content-center">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <h2 className="py-4">BoardGamers, welcome to {gameTitle}!</h2>
                <Game {...game.results[0]} setGames={setGame} gamePage />
                <Container className={appStyles.Content}>
                    <div className={appStyles.Divider}></div>
                    <Rating gameId={id} />
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
                        <InfiniteScroll
                            children={reviews.results.map((review) => (
                                <Review
                                    key={review.id}
                                    {...review}
                                    setGame={setGame}
                                    setReviews={setReviews}
                                />
                            ))}
                            dataLength={reviews.results.length}
                            loader={<Asset spinner />}
                            hasMore={!!reviews.next}
                            next={() => fetchMoreData(reviews, setReviews)}
                        />
                    ) : currentUser ? (
                        <span>No reviews yet, be the first to review this game!</span>
                    ) : (
                        <span>No reviews...yet</span>
                    )}
                </Container>
            </Col>
        </Row>
    );
}

export default GamePage;