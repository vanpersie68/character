import Header from "../../header/Header";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import AdminNavigation from "./AdminNavigation";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCharacters,
  deleteCharacter,
  resetCharacterState,
} from "../../features/characterSlice";

export default function CharacterList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const characters = useSelector((state) => state.characters.characters);
  const status = useSelector((state) => state.characters.status);
  useEffect(() => {
    dispatch(getAllCharacters()); // get all characters
  }, []);

  const handleCloseModal = () => {
    setSelectedCharacter(null);
  };

  const handleViewDetails = (character) => {
    setSelectedCharacter(character);
  };

  // Function for deleting roles
  const handleDelete = (id) => {
    console.log(`Deleting character with ID: ${id}`);

    dispatch(deleteCharacter(id));
    if (status === "succeeded") {
      alert("delete successfully");
      setSelectedCharacter(null);
      dispatch(getAllCharacters());
    }
  };

  return (
    <div className="p-4">
      <Header />
      <AdminNavigation></AdminNavigation>
      <h1 className="text-lg font-bold mb-4">Character List</h1>
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Character Name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Description
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Operation
            </th>
          </tr>
        </thead>
        <tbody>
          {characters?.map((item) => (
            <tr key={item.id}>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {item.name}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {item.description}
              </td>
              <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <button
                  className="text-blue-500 hover:text-blue-800"
                  onClick={() => handleViewDetails(item)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedCharacter && (
        <Modal
          character={selectedCharacter}
          onClose={handleCloseModal}
          actions={[
            {
              label: "Edit",
              onClick: () =>
                navigate("/Edit", { state: { character: selectedCharacter } }),
              styles: "bg-blue-500 hover:bg-blue-700",
            },

            {
              label: "Delete",
              onClick: () => handleDelete(selectedCharacter.id),
              styles: "bg-red-500 hover:bg-red-700",
            },
          ]}
        />
      )}
    </div>
  );
}
