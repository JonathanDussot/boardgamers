import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Game from './Game'

import appStyles from "../../App.module.css";
import styles from "../../styles/GamesPage.module.css";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from '../../api/axiosDefaults'

import NoResults from '../../assets/no-results.png'
import Asset from "../../components/Asset";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function GamesPage({ message, filter = "" }) {
    const [games, setGames] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();
    const currentUser = useCurrentUser();

    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const { data } = await axiosReq.get(`/games/?${filter}search=${query}`)
                setGames(data)
                setHasLoaded(true)
            } catch (err) {
                console.log(err)
            }
        }

        setHasLoaded(false);
        const timer = setTimeout(() => {
            fetchGames();
        }, 1000);

        return () => {
            clearTimeout(timer);
        };

    }, [filter, query, pathname, currentUser]);

    return (
        <Row className="h-100 justify-content-center">
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <h2 className="py-4">Welcome fellow BoardGamers!</h2>
                <i className={`fas fa-search ${styles.SearchIcon}`} />
                <Form className={styles.SearchBar}
                    onSubmit={(event) => event.preventDefault()}
                >
                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="text"
                        className="mr-sm-2"
                        placeholder="Search our Board Games"
                    />
                </Form>

                {hasLoaded ? (
                    <>
                        {games.results.length ? (
                            <InfiniteScroll
                                children={
                                    games.results.map((game) => (
                                        <Game key={game.id} {...game} setGames={setGames} />
                                    ))
                                }
                                dataLength={games.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!games.next}
                                next={() => fetchMoreData(games, setGames)}
                            />

                        ) : (
                            <Container className={appStyles.Content}>
                                <Asset src={NoResults} message={message} />
                            </Container>
                        )}
                    </>
                ) : (
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )}
            </Col>
        </Row>
    );
}

export default GamesPage;