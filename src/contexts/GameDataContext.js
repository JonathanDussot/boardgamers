import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";

const GameDataContext = createContext();
const SetGameDataContext = createContext();

export const useGameData = () => useContext(GameDataContext);
export const useSetGameData = () => useContext(SetGameDataContext);

export const GameDataProvider = ({ children }) => {
  const [gameData, setGameData] = useState({
    topRatedGames: { results: [] }, // Stores top-rated games
  });

  // fetches average ratings of games and orders them
  useEffect(() => {
    const fetchTopRatedGames = async () => {
      try {
        const { data } = await axiosReq.get("/games/?ordering=-average_rating");
        setGameData((prevState) => ({
          ...prevState,
          topRatedGames: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchTopRatedGames();
  }, []);

  return (
    <GameDataContext.Provider value={gameData}>
      <SetGameDataContext.Provider value={setGameData}>
        {children}
      </SetGameDataContext.Provider>
    </GameDataContext.Provider>
  );
};
