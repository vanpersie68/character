import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { logout } from "../components/features/userSlice";
import { getAllCharacters } from "../components/features/characterSlice";
import { getUserInfoDetail, revoke } from "../components/features/userInfoSlice";

export default function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const user_id = useSelector((state) => state.user.user._id);
    const userInfo = useSelector((state) => state.userInfo.userInfo);
    const characters = useSelector((state) => state.userInfo.characters);
    const isAdmin = useSelector((state) => state.userInfo.userInfo[0]?.isAdmin);

    const values = { user_id };

    const data = useSelector(state => state.characters.characters); 
    useEffect(() => {
        dispatch(getAllCharacters()); 
        dispatch(getUserInfoDetail(values));
    }, []); 

    // Saves the status of the selected role
    const [selectedCharacters, setSelectedCharacters] = useState([]);
    const [comparisonResults, setComparisonResults] = useState([]);
    const initialComparisonHistory = location.state?.comparisonHistory || [];
    const [comparisonHistory, setComparisonHistory] = useState(initialComparisonHistory);

    useEffect(() => {
        if (selectedCharacters.length === 2) {
            const results = attributes.map(attr => {
                if (selectedCharacters[0][attr] > selectedCharacters[1][attr]) {
                    return 1;
                } else if (selectedCharacters[0][attr] < selectedCharacters[1][attr]) {
                    return -1;
                }
                return Math.random() > 0.5 ? 1 : -1;
            });

            setComparisonResults(results);

            const newEntry = selectedCharacters.map(char => char.name);
            setComparisonHistory(prev => {
                const newHistory = [...prev, newEntry];
                if (newHistory.length > 5) {
                    newHistory.shift(); // Only five hold the all-time record
                }
                return newHistory;
            });
        }
    }, [selectedCharacters]); 

    // Events that handle checkbox changes
    const handleCheckboxChange = (character) => {
        setSelectedCharacters(prev => {
            const exists = prev.find(c => c.name === character.name);
            if (exists) {
                return prev.filter(c => c.name !== character.name); // If a role is selected, deselect it
            }
            if (prev.length === 2) {
                return [prev[1], character]; // Keep the array with only two elements
            }
            return [...prev, character]; // Adds a newly selected role
        });
    };

    // Define a list of attributes to compare
    const attributes = ['strength', 'speed', 'skill', 'fear_factor', 'power', 'intelligence', 'wealth'];
    const calculateWinnerColor = () => {
        const winCount = comparisonResults.reduce((count, num) => count + (num === 1 ? 1 : 0), 0);
        return winCount >= 4 ? ['bg-green-500', 'bg-red-500'] : ['bg-red-500', 'bg-green-500'];
    };

    const [color1, color2] = selectedCharacters.length === 2 ? calculateWinnerColor() : ['', ''];
    
    return (
        <div>
            <div style={{ backgroundImage: 'url("images/background.jpg")',  backgroundSize: 'cover', backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',  filter: 'blur(20px)', height: '160vh',  width: '100%', position: 'absolute', zIndex: -1,}}> </div>
            <nav className="text-center">
                <Header />

                {/* Navigation button */}
                <button onClick={() => { navigate('/user', { state: { comparisonHistory } })}}
                    className="bg-yellow-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-l">
                    User Information
                </button>
                
                {isAdmin && <Link to="/admin/characters">
                    <button className="bg-green-500 hover:bg-blue-700 text-black font-bold py-2 px-4 ">
                        Admin Panel
                    </button>
                </Link>}

                <Link to="/add">
                    <button className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4">
                        Add Character
                    </button>
                </Link>

                
                <button onClick={() => dispatch(logout())} className="bg-red-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-r">
                    Logout
                </button>
                
            </nav>

            <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-5 ml-10 mr-10">
                {/* character list table */}
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {['Name', 'Strength', 'Speed', 'Skill', 'Fear Factor', 'Power', 'Intelligence', 'Wealth', 'Selected', 'Actions'].map(header => (
                                <th key={header} scope="col" className="py-3 px-6">{header}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="py-4 px-6">{item.name}</td>
                                <td className="py-4 px-6">{item.strength}</td>
                                <td className="py-4 px-6">{item.speed}</td>
                                <td className="py-4 px-6">{item.skill}</td>
                                <td className="py-4 px-6">{item.fear_factor}</td>
                                <td className="py-4 px-6">{item.power}</td>
                                <td className="py-4 px-6">{item.intelligence}</td>
                                <td className="py-4 px-6">{item.wealth}</td>
                                <td className="py-4 px-6">
                                    <input
                                        type="checkbox"
                                        checked={selectedCharacters.some(char => char.name === item.name)}
                                        onChange={() => handleCheckboxChange(item)}
                                    />
                                </td>
                                <td className="py-4 px-6">
                                    
                                    <button onClick={() => {navigate('/edit', { state: { character: item } })}}
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">Edit</button>
                                    

                                    <button onClick={() => {navigate('/character', { state: { character: item } })}}
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedCharacters.length > 0 && (
                <div className="flex justify-around mt-1" >
                    

                    {selectedCharacters.map((char, index) => (
                        <div key={char.name} className="flex flex-col items-center bg-black text-white">
                            <h3 className="font-extrabold">{char.name}</h3>
                            <img src={char.image_url} alt={char.name} className="w-24 h-24 mt-3" />
                            <div className={`mt-6 ${index === 0 ? color1 : color2}` }>
                                {attributes.map((attr, attrIndex) => (
                                    <div key={attr}>
                                        {attr.toUpperCase()}: {char[attr]}
                                        {comparisonResults[attrIndex] === (index === 0 ? 1 : -1) && ' ✔'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Display comparative history */}
            <div className="flex justify-center items-center "> 
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md w-full max-w-4xl"> 
                    <h2 className="text-lg font-bold text-gray-700 mb-4 text-center">Comparsion history</h2> 
                    <ul className="list-disc pl-5 space-y-2">
                        {comparisonHistory.map((entry, index) => (
                            <li key={index} className="text-gray-600">{entry.join(" vs ")}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
