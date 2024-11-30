// src/NotFound.js
import React, { useState } from 'react';
import './NotFound.css';

const NotFound = () => {
    const [explosion, setExplosion] = useState({ visible: false, x: 0, y: 0 });

    const handleClick = (event) => {
        // Set explosion position and make it visible
        setExplosion({
            visible: true,
            x: event.clientX,
            y: event.clientY
        });

        // Hide explosion after a short duration
        setTimeout(() => {
            setExplosion({ ...explosion, visible: false });
        }, 1000); // Adjust duration as needed
    };

    return (
        <div className="not-found-container" onClick={handleClick}>
            <h1 className="not-found-title animate-title">🚨 404 - Danger Ahead! 🚨</h1>
            <div className="meme-container animate-memes">
                <img 
                    src="https://tse2.mm.bing.net/th?id=OIP.nbMjPoTE4jaoRbiL3r0gggHaE7&pid=Api&P=0&h=220" 
                    alt="Cat Meme" 
                    className="cat-meme" 
                />
                <img 
                    src="https://tse2.mm.bing.net/th?id=OIP._sbeYCoK2s9yeu2Z0Un3AwHaFT&pid=Api&P=0&h=220" 
                    alt="404 Error Meme" 
                    className="error-meme" 
                />
            </div>
            <p className="not-found-message animate-message">This page is a trap! You shouldn't be here!</p>
            <p className="warning-message animate-warning">Turn back before it's too late!</p>

            {explosion.visible && (
                <img
                    src="https://tse4.mm.bing.net/th?id=OIP.aY0bjZUu8Pk56M_OhaO1RQHaFm&pid=Api&P=0&h=220" // Replace with your explosion image URL
                    alt="Explosion"
                    className="explosion-image"
                    style={{
                        left: explosion.x,
                        top: explosion.y,
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                        transition: 'opacity 0.5s ease-in-out',
                        opacity: explosion.visible ? 1 : 0,
                    }}
                />
            )}
        </div>
    );
};

export default NotFound;