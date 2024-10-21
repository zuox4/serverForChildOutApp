import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import './AdminPanel.css';
import CardOut from "../components/CardOut";
import logo from '../assets/logo.svg';
import Header from "../components/Header";
import axios from "axios";
import reloadImages from "../assets/reload3.svg";
import {api_url} from "../api";
const socket = io(api_url,{
    forceNew: true,
    transports: ["polling"],
    }); 
const uppercase_russian_alphabet = [
    'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О',
    'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Э', 'Ю', 'Я'
]
function AdminPanel() {
    const [messages, setMessages] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [loading, setLoading] = useState(false);
    const [chek, setChek] = useState(false);
    const [messageInfo, setMessageInfo] = useState({});
    const [filterFirstLetter, setFilterFirstLetter] = useState('');
    const handleFilterChange = (e) => {
        setFilterText(e.target.value);
    };

    const filteredMessages = messages.filter(msg =>
        chek
            ?(msg.toLowerCase()[0].includes(filterFirstLetter.toLowerCase())&&msg.toLowerCase().includes(filterText.toLowerCase()) && msg.toLowerCase().includes(formatDateString(Date.now()).split('T')[0]))
            : msg.toLowerCase().includes(filterText.toLowerCase())
    );

    function formatDateString(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    async function loadMessages() {
        setLoading(true);
        try {
            const res = await axios.get('/get_outs');
            const x = res.data.history_outs;
            const newMessages = x.map(msg => msg.student_name + ' в ' + formatDateString(msg.data_time_out) + ' ' + msg.className);
            console.log(newMessages)
            setMessages(newMessages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    useEffect(() => {
        loadMessages();
        // Обработка сообщений от сервера
        socket.on('server-message', (msg) => {
            setMessages(prevMessages => [...prevMessages, msg.split(' в ')[0] + ' в ' + msg.split(' в ')[1]]);
            console.log(msg.split(' в ')[1].split(' ')[0])
        });
    }, []);

    return (
        <div className="AdminPanel">
            <Header classGrad={''} nameApp={'School1298 Admin Panel'}/>
            <h1 style={{marginTop: '10px', marginLeft: '20px'}}>Запросы на выход</h1>

            <div className="filter-form"
                 style={{display: 'flex', flexDirection: 'column', alignItems: "center", width: '100%'}}>
                <input
                    type="text"
                    placeholder="Поиск пропуска"
                    value={filterText}
                    onChange={handleFilterChange}
                    className="filter-input"
                    style={{
                        height: '30px',
                        width: '300px',
                        fontSize: '15px',
                        marginBottom: '10px',
                        padding: '3px',
                        textAlign: 'center'
                    }}
                />
            </div>
            <div className={'filter'} style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: "center",
                width: '100%',
                marginBottom: '10px',
                justifyContent: 'center'
            }}>
                <label htmlFor={'justtoday'} style={{color: "white", width: '600'}}>Сегодня</label>
                <input id={'justtoday'} type={'checkbox'} value={false} onChange={() => setChek(!chek)}/>
            </div>
            <div style={{

                height: '50px',
                width: '100vw',
                background: 'white',
                marginBottom:'10px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
            }}>
                {uppercase_russian_alphabet.map(letter => <div onClick={() => setFilterFirstLetter(letter)} style={{
                    background: "#cbcbcb",
                    height: 'fit-content',
                    width: '23px',
                    borderRadius: '3px',
                    fontSize: '23px',
                    padding:'3px',

                }}>{letter}</div>)}
                <div onClick={() => setFilterFirstLetter('')}
                     style={{background: "#cbcbcb",padding:'3px', borderRadius: '3px', fontSize: '20px',}}>Все
                </div>
            </div>
            <div className={'board'}>
                {!loading && filteredMessages.map((msg, index) => (
                    <CardOut filteredMessages={filteredMessages} filterText={filterText} index={index} key={index}
                             msg={msg} order={index}/>
                ))}
            </div>

            <img src={reloadImages} alt={'reload'} style={{position: "fixed", bottom: 20, width: '90px'}}
                 onClick={() => window.location.reload()}/>
        </div>
    );
}

export default AdminPanel;