import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "../../header/Header";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  addCharacterToFavourites,
  removeCharacterFromFavourites,
} from "../../features/userInfoSlice";

function CharacterDetail() {
  const location = useLocation();
  const character = location.state ? location.state.character : null;
  const [isFavorite, setIsFavorite] = useState(false);
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state) => state.userInfo?.userInfo[0]?.favourites[0]?.characters || []
  );

  const userId = useSelector((state) => state.user.user._id);

  useEffect(() => {
    if (character) {
      checkFavoriteStatus();
    }
  }, [character]);

  const checkFavoriteStatus = async () => {
    if (favorites.includes(character.id.toLowerCase())) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  };
  const toggleFavorite = async () => {
    try {
      const action = isFavorite
        ? removeCharacterFromFavourites
        : addCharacterToFavourites;
      await dispatch(
        action({ userId, characterId: character.id.toLowerCase() })
      );
      setIsFavorite(!isFavorite); // Assume success and toggle state
    } catch (error) {
      console.error("Error updating favorites", error);
    }
  };

  if (!character) {
    return (
      <div className="text-center">
        <Header />
        <p>No character data available.</p>
        <Link to="/" className="text-blue-500 hover:text-blue-800">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center mt-10">
      <Header />
      <h1 className="text-2xl font-bold mb-3">{character.name}</h1>
      <img
        src={character.image_url}
        alt={character.name}
        className="mx-auto"
        style={{ width: "200px", height: "200px", objectFit: "cover" }}
      />
      <h2 className="text-xl font-semibold mt-2">{character.subtitle}</h2>
      <p className="mt-2">{character.description}</p>
      <div className="mt-4">
        <h3 className="text-lg font-bold">Character Stats:</h3>
        <ul className="list-none">
          <li>Strength: {character.strength}</li>
          <li>Speed: {character.speed}</li>
          <li>Skill: {character.skill}</li>
          <li>Fear Factor: {character.fear_factor}</li>
          <li>Power: {character.power}</li>
          <li>Intelligence: {character.intelligence}</li>
          <li>Wealth: {character.wealth}</li>
        </ul>
      </div>
      <div className="mt-5">
        <button
          onClick={toggleFavorite}
          className={`bg-${isFavorite ? "red" : "green"}-500 hover:bg-${
            isFavorite ? "red" : "green"
          }-700 text-white font-bold py-2 px-4 rounded`}
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <Link
          to="/"
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default CharacterDetail;
