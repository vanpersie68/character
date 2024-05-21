import Header from '../../header/Header';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import { addCharacter, getAllCharacters } from '../../features/characterSlice';
import Picture from '../../header/Picture';
import axios from "axios";
const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;

export default function Add({ }) {
    const token = useSelector(state => state.user.user.token); 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [description, setDescription] = useState('');
    const [strength, setStrength] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [skill, setSkill] = useState(0);
    const [fear_factor, setFearFactor] = useState(0);
    const [power, setPower] = useState(0);
    const [intelligence, setIntelligence] = useState(0);
    const [wealth, setWealth] = useState(0);

    const [ picture, setPicture ] = useState();
    const [readablePicture, setReadablePicture] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!name){
            alert('Please input character name!');
            return; 
        }

        if(!subtitle){
            alert('Please input character subtitle!');
            return; 
        }

        if(!description){
            alert('Please input character description!');
            return; 
        }

        if (!picture) {
            alert('Please upload an image before submitting!');
            return; 
        }

        await uploadImage().then(async (response) => {
            await dispatch(addCharacter({
                token,
                action: 'AddCharacter',
                data: {
                    id: name,
                    name,
                    subtitle,
                    description,
                    image_url: response.secure_url,
                    strength: Number(strength),  
                    speed: Number(speed),        
                    skill: Number(skill),        
                    fear_factor: Number(fear_factor), 
                    power: Number(power),       
                    intelligence: Number(intelligence),  
                    wealth: Number(wealth)       
                },
            }));
            
            dispatch(getAllCharacters());
            navigate("/");
        }); 
    };

    const uploadImage = async() => {
        //Create a FormData object that is used to send image data to the server along with other form fields
        let formData = new FormData();
        //Append cloud_secret to FormData with "upload_preset" as the field name
        formData.append("upload_preset", cloud_secret);
        formData.append("file", picture);
        const {data} = await axios.post(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, formData);
        return data;
    };

    return (
        <div className="max-w-4xl mx-auto p-5">
            <Header />

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input id="name" name="name" type="text" required value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input id="subtitle" name="subtitle" type="text" required value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" name="description" value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" rows={3}></textarea>
                </div>

                <div>
                    <Picture setPicture={setPicture} readablePicture={readablePicture} setReadablePicture={setReadablePicture} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <label htmlFor="strength" className="block text-sm font-medium text-gray-700">Strength</label>
                    <input id="strength" name="strength" type="number" required value={strength}
                        onChange={(e) => setStrength(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />

                    <label htmlFor="speed" className="block text-sm font-medium text-gray-700">Speed</label>
                    <input id="speed" name="speed" type="number" required value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />

                    <label htmlFor="skill" className="block text-sm font-medium text-gray-700">Skill</label>
                    <input id="skill" name="skill" type="number" required value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />

                    <label htmlFor="fear_factor" className="block text-sm font-medium text-gray-700">Fear_Factor</label>
                    <input id="fear_factor" name="fear_factor" type="number" required value={fear_factor}
                        onChange={(e) => setFearFactor(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />

                    <label htmlFor="power" className="block text-sm font-medium text-gray-700">Power</label>
                    <input id="power" name="power" type="number" required value={power}
                        onChange={(e) => setPower(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />

                    <label htmlFor="intelligence" className="block text-sm font-medium text-gray-700">Intelligence</label>
                    <input id="intelligence" name="intelligence" type="number" required value={intelligence}
                        onChange={(e) => setIntelligence(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />

                    <label htmlFor="wealth" className="block text-sm font-medium text-gray-700">Wealth</label>
                    <input id="wealth" name="wealth" type="number" required value={wealth}
                        onChange={(e) => setWealth(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>



                {/* Submit back to the main menu */}
                <div className='mt-10'>
                    <button 
                        type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Character</button>
                    
                    {/* Cancel Add to return to the main menu */}
                    <Link to="/" className='px-4'>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Return main page</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}
