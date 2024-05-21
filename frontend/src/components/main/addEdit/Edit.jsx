import Header from '../../header/Header';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { editCharacter, getAllCharacters } from '../../features/characterSlice';

export default function Edit() {

    const token = useSelector(state => state.user.user.token); 
    const location = useLocation();
    const [character, setCharacter] = useState(location.state ? location.state.character : {});
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        if (!character) {
            console.log("No character data available");
        }
    }, [character]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCharacter(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await dispatch(editCharacter({
            token,
            action: 'EditCharacter',
            data: {
                characterId: character.id,
                name: character.name,
                subtitle: character.subtitle,
                description: character.description,
                image_url: character.image_url,
                strength: Number(character.strength),
                speed: Number(character.speed),
                skill: Number(character.skill),
                fear_factor: Number(character.fear_factor),
                power: Number(character.power),
                intelligence: Number(character.intelligence),
                wealth: Number(character.wealth)
            }
        }));

        dispatch(getAllCharacters());
        navigate("/");
        
    };


    return (
        <div className="max-w-4xl mx-auto p-5">
            <Header />
    
            <form method='post' className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input id="name" name="name" type="text" value={character.name} onChange={handleInputChange}
                        required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>

                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input id="subtitle" name="subtitle" type="text" value={character.subtitle} onChange={handleInputChange}
                        required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" value={character.description} onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" rows={3}></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {['strength', 'speed', 'skill', 'fear_factor', 'power', 'intelligence', 'wealth'].map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="block text-sm font-medium text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input id={field} name={field} type="number" value={character[field]} onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                        </div>
                    ))}
                </div>

                {/* Submit back to the main menu */}
                <div className='mt-10'>
                    {/* Submit and return to previous page */}
                    <button type="submit" onClick={() => navigate(-1)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                        Save Character
                    </button>

                    {/* Cancel and return to previous page */}
                    <button type="button" onClick={() => navigate(-1)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Return to Previous Page
                    </button>
                </div>

            </form>
        </div>
    )
}
