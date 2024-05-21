import React, { useRef, useState } from 'react';

export default function Picture({setPicture, readablePicture, setReadablePicture}) {
    const inputRef = useRef();
    const [error, setError] = useState("");

    const handlePicture = (event) => {
        let pic = event.target.files[0];
        if(pic.type !== "image/png" && pic.type !== "image/jpeg" && pic.type !== "image/webp"){
            setError(`${pic.name} format is not supported.`);
            return; 
        } else if(pic.size > 1024 * 1024 * 5) { // 5mb
            setError(`${pic.name} is too large, maximum 5mb allowed.`);
            return; 
        } else {
            setError("");
            setPicture(pic);
            const reader = new FileReader(); // Read the contents of the file
            reader.readAsDataURL(pic); // This DataURL contains a base64-encoded representation of the file and can be used directly to display the image in a web page
            // The callback function is triggered when the readAsDataURL operation completes
            reader.onload = (event) => {
                setReadablePicture(event.target.result);
            }
        }
    };

    const handleChangePic = () => {
        setPicture("");
        setReadablePicture("");
    }

    return (
        <div className='mt-8 content-center dark:text-dark_text_1 space-y-1'>
            <label htmlFor="picture" className="text-sm font-bold tracking-wide" style={{ color: 'black' }}>
                Picture 
            </label>

            {readablePicture ?
                <div>
                    <img src={readablePicture} alt='picture' className='w-20 h-20 object-cover rounded-full' />
                    <div className='mt-2 w-20 py-1 dark:bg-dark_bg_3 rounded-md text-xs font-bold flex items-center justify-center cursor-pointer'
                        onClick={() => handleChangePic()}>
                        Remove
                    </div>
                </div> :
                <div className='w-full h-12 dark:bg-dark_bg_3 rounded-md font-bold flex items-center justify-center cursor-pointer'
                    onClick={() => inputRef.current.click()}>
                    Upload Picture
                </div>}

            <input type='file' name='picture' id='picture' accept="image/png, image/jpeg, image/webp" hidden
                onChange={handlePicture} ref={inputRef} />

            {/* error */}
            <div className='mt-2'>
                <p className='text-red-400'>{error}</p>
            </div>
        </div>
    );
}
