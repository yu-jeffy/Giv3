import React, { useState, useEffect } from 'react';
import "./Home.css";
import simpleParallax from 'simple-parallax-js';

const Home = () => {
    useEffect(() => {
        var section1background = document.getElementsByClassName('section1Background');
        new simpleParallax(section1background, {
            scale: 1.2,
            orientation: 'right'
        });
        var section2background = document.getElementsByClassName('section2Background');
        new simpleParallax(section2background, {
            scale: 1.2,
            orientation: 'left'
        });
    }, []);

    return (
        <div className="homeContainer">
            <div className="homeSection">
                <img className="section1Background" src="section1background.png" alt="section1background"/>
            </div>
            <div className="homeSection">
                <img className="section2Background" src="section2background.png" alt="section2background"/>
            </div>
            <div className="homeSection">

            </div>
            <div className="homeSection">

            </div>
        </div>
    );
}
export default Home;