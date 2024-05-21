import React from 'react';
import { useNavigate } from 'react-router-dom';

const Modal = ({ character, onClose, actions = [] }) => {
    const navigate = useNavigate();

    if (!character) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg max-w-lg w-full">
                <h2 className="text-xl font-bold mb-2">{character.name}</h2>
                <p className="mb-2"><strong>Description:</strong> {character.description}</p>
                <p className="mb-2"><strong>Subtitle:</strong> {character.subtitle}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <p><strong>Strength:</strong> {character.strength}</p>
                    <p><strong>Speed:</strong> {character.speed}</p>
                    <p><strong>Skill:</strong> {character.skill}</p>
                    <p><strong>Fear Factor:</strong> {character.fear_factor}</p>
                    <p><strong>Power:</strong> {character.power}</p>
                    <p><strong>Intelligence:</strong> {character.intelligence}</p>
                    <p><strong>Wealth:</strong> {character.wealth}</p>
                </div>
                {character.image_url && (
                    <img src={character.image_url} alt={character.name} className="w-full max-h-40 object-cover rounded mb-4"/>
                )}
                {actions.map(action => (
                    <button
                        key={action.label}
                        className={`py-2 px-4 ${action.styles} text-white font-bold rounded mx-2`}
                        onClick={() => {
                            action.onClick ? action.onClick(character) : navigate(action.navigate);
                        }}
                    >
                        {action.label}
                    </button>
                ))}
                <button
                    className="py-2 px-4 bg-gray-500 hover:bg-gray-700 text-white font-bold rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
