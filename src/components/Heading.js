import React from 'react';
import logo from "../assets/dkv cropped.png";


const Heading = () => {
    return (
        <>
            <div className="top-header">
                <a href="https://dkvalidator.one" title="Stake Harmony ONE with DK Validator"><img className="logo" src={logo} alt="DK Validator - Harmony ONE Staking" width="300px" /></a>
            </div>
        </>
    )
}

export default Heading
