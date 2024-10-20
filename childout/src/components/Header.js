
import elipse from "../assets/elipse.svg"
import  school from '../assets/logo.svg'
import React from "react";
import './HeaderStyle.css'
function Header({ classGrad, nameApp }) {
    return (
        <div className="App-header">
            <div className={'logo-app'}><img src={school} alt={''}/></div>
            <div className={'name-app'}>{nameApp}</div>
            {nameApp==='Классный помощник'&&classGrad&&<div className={'name-class'}><span>{classGrad}</span></div>}
        </div>
    )
}
export default Header;
