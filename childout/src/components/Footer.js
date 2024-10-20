import React, {useState} from "react";
import './Footer.css'
import home from '../assets/homeicon.svg'
import exit from '../assets/exitacc.svg'
import attention from '../assets/attention.svg'
import history from '../assets/history.svg'
import {Navigate, useNavigate} from "react-router-dom";
function Footer() {
    const navigate = useNavigate();
    function handleSubmit() {
        localStorage.removeItem('user');
        navigate('/')
    }

    function handleSubmit2(path) {
        navigate(path)
    }
    return (
        <div className={'nav-bar'} style={{display: 'flex', justifyContent: 'space-around'}}>
            <button onClick={() => handleSubmit2('')}><img className={'icons-menu'} src={home} alt={'home'}/></button>
            <button onClick={() => handleSubmit2('history')}><img className={'icons-menu'} src={history} alt={'home'}/></button>
            <button onClick={() => handleSubmit()}><img className={'icons-menu'} src={exit} alt={'home'}/></button>
        </div>
    )

}

export default Footer;