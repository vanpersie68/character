import Header from "../header/Header";
import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserInfoDetail, revoke } from "../features/userInfoSlice";

export default function UserInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user_id = useSelector((state) => state.user.user._id);
  const { state } = useLocation();
  const { comparisonHistory } = state || { comparisonHistory: [] };

  const values = { user_id };
  const [data, setData] = useState([]);
  const [favoriteCharacters, setFavoriteCharacters] = useState([]);
  const userInfo = useSelector((state) => state.userInfo.userInfo);

  useEffect(() => {
    dispatch(getUserInfoDetail(values)); 
  }, []); 

  useEffect(() => {
    // Ensure that userInfo is defined and the length is greater than 0
    if (userInfo && userInfo.length > 0) {
      // Extracting contributions generates initialData
      const contributionsData = userInfo[0].contributions.map(
        (contribution) => ({
          contributionId: contribution._id,
          name: contribution.data.id, // Assume that the data object contains an id as name
          action: contribution.action,
          status: contribution.status,
          reviewed_by: contribution.reviewed_by_name, 
        })
      );

      setData(contributionsData);

      // Extract characters from favorites
      if (userInfo[0].favourites && userInfo[0].favourites.length > 0) {
        const favoritesData = userInfo[0].favourites[0].characters;
        setFavoriteCharacters(favoritesData);
      } else {
        setFavoriteCharacters([]); // If you don't have favorites, set it to an empty array
      }
    } else {
      console.log("userInfo is undefined or empty");
      setData([]); 
      setFavoriteCharacters([]); 
    }
  }, [userInfo]); // Recalculate when userInfo is updated

  // Handle the undo button click event
  const handleRevoke = async (index, contributionId) => {
    const values = { contributionId };
    await dispatch(revoke(values));

    dispatch(getUserInfoDetail(values));
    navigate("/user");
  };

  const goBackToHome = () => {
    navigate("/", { state: { comparisonHistory } });
  };
  return (
    <div>
      {/* header */}
      <Header />

      <div className="container mx-auto mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 my-4 text-center">
          Changes And Contributions Lists
        </h2>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Character Name</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Reviewed By</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
              >
                <td className="border px-4 py-2">{row.name}</td>
                <td className="border px-4 py-2">{row.action}</td>
                <td className="border px-4 py-2">{row.status}</td>
                <td className="border px-4 py-2">{row.reviewed_by}</td>
                <td className="border px-4 py-2">
                  {row.status === "Pending" && row.reviewed_by === null && (
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleRevoke(index, row.contributionId)}
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current and historical comparison */}
      <div className="flex justify-center items-start space-x-8 mt-8">
        {" "}
        {/* Center and add spacing */}
        {/* Current character */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md">
          {" "}
          {/* Current character */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
            Favorite Characters
          </h2>{" "}
          {/* Center title */}
          <ul className="list-disc pl-5 space-y-2">
            {favoriteCharacters.map((character, index) => (
              <li key={index} className="text-gray-600">
                {character}
              </li>
            ))}
          </ul>
        </div>
        {/* history character */}
        <div className="p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-md">
          {" "}
          {/* Limit maximum width */}
          <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">
            Comparison History
          </h2>{" "}
          <ul className="list-disc pl-5 space-y-2">
            {comparisonHistory.map((entry, index) => (
              <li key={index} className="text-gray-600">
                {entry.join(" vs ")}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Back to main menu */}
      <div className="flex justify-center mt-4">
        <button
          onClick={goBackToHome}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Main Page
        </button>
      </div>
    </div>
  );
}
