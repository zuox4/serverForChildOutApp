import React, {useContext, useState} from "react";
import './LoginPage.css'
import {login} from "./services/authService";
import logo1298 from '../assets/logo1298.svg'
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {UserId} from "../App";
function LoginForm() {
    const navigate = useNavigate();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setAuth } = useContext(UserId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (data.user){
                setAuth({ id: data.user.id, token: data.user.access_token });
                console.log(data);
                navigate('/client');
            }
            else{
                setError(data.message);
            }

        } catch (err) {
            console.log('Ошибка входа: неверный логин или пароль')
            setError('Ошибка входа: неверный логин или пароль');
        }
    };
    return (
        <div className="login-container" style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <img src={logo1298} className="logo" alt="logo" style={{width:'200px'}}/>
            <h2>Классный помощник <br/>Школа №1298 </h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{width:'300px'}}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{width:'300px'}}
                    />
                </div>
                <div className="button-group">
                    <button type="submit"  style={{width:'160px', marginBottom:'20px'}}>Войти</button>
                </div>
                <span onClick={()=>navigate('/register')} style={{textAlign:'center', color:"white", marginTop:'20px', textDecoration:'underline'}}>Регистрация</span>
                {error.length>0&&<div style={{marginTop:'8px',textAlign:'center', color:'red'}}>{error}</div>}
            </form>
        </div>
    );
}
export default LoginForm;