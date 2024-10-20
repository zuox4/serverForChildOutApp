// src/pages/Registration.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo1298 from "../assets/logo1298.svg";

function Registration() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [dataRegister, setRegister] = useState("");
    const [loading, setLoading] = useState(false);
    async function registerUser(email) {
        setLoading(true)
        try {
            const response = await axios.post('/register', {
                email:email
            });
            console.log('Успешная регистрация:', response.data);
            return response.data; // Возвращаем ответ для дальнейшей обработки
        } catch (error) {
            if (error.response) {
                console.error('Ошибка регистрации:', error.response.data.message);
            } else if (error.request) {
                console.error('Ошибка: ответ от сервера не получен', error.request);
            } else {
                console.error('Ошибка:', error.message);
            }
            throw error; // Можно выбросить ошибку дальше для обработки в родительском компоненте
        }

    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegister('')
        try {
            const result = await registerUser(email);
            setRegister(`Пароль отправлен на электронную почту ${email}`)
            setEmail('')
            setLoading(false)
            console.log(result); // Успешная регистрация
        } catch (error) {
            setRegister('Ошибка регистрации. Проверьте правильность введеных данных или обратитесь к администратору')
            console.error('Не удалось зарегистрироваться', error);
            setLoading(false)
        }

    };

    return (
        <div className="login-container" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <img src={logo1298} className="logo" alt="logo" style={{width: '200px'}}/>
            <h2>Классный помощник <br/>Школа №1298</h2>
            <h3>Регистрация</h3>
            {loading?<div className="spinner">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>
            </div>:
                <form onSubmit={handleRegister}>
            <div className="input-group">
                <label htmlFor="email">E-mail:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{width: '300px'}}
                />

            </div>
            <div className="button-group">
                <button type="submit" style={{width: 'max-content', marginBottom: '20px'}}>Зарегистрироваться
                </button>

            </div>
            <span onClick={() => navigate('/')} style={{
                textAlign: 'center',
                color: 'white',
                marginTop: '20px',
                textDecoration: 'underline'
            }}>Войти</span>

        </form>
}
    <span style={{
        color: (dataRegister === 'Не удалось зарегистрироваться') ? 'red' : 'white',
        marginTop: '20px'
    }}>{dataRegister}</span>
        </div>
    );
}

export default Registration;