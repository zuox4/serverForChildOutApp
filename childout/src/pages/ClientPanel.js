import './PagesStyle.css'

import ListChildCard from "../components/ListChildCard";
import ModalWindow from "../components/ModalWindow";
import React, {useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import axios from "axios";
import {UserId} from "../App";
import {useOutletContext} from "react-router-dom";
import {api_url} from "../api";


const socket = io(api_url); // URL вашего сервера

function ClientPanel() {
    const [message, setMessage] = useState('');
    const [modal, setModal] = React.useState(false);
    const [activeChildCardName, setActiveChildCard] = React.useState({fullName:'', id:'', numberPhone:'', birthDate:''});
    const [className, dataStudents, isLoading] = useOutletContext()
    const [dateOut, setDateOut] = React.useState(Date.now());
    const { user } = useContext(UserId);
    function parseDate(dateString) {

        if (dateString.endsWith('Z')) {
            dateString = dateString.slice(0, -1);
        }
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);
        const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
        return date;
    }


    const sendMessage = () => {
        // Отправляем сообщение на сервер
        socket.emit('client-message', message);
        fix(user.id, parseDate(dateOut)).then(r => alert('Пропуск успешно оформлен')).catch(e => alert('Произошла ошибка'));
        console.log(parseDate(dateOut))
        setMessage('');
    };


        const fix = async (teacherId, date_out) => {
            const studentId = activeChildCardName.id;
            try {
                const response = await axios.post(`/fix_out`, { mentor_id:teacherId, student_id:studentId, date_out:date_out});
                console.log(response.data)
                return response.data;
            }catch (er){
                console.log(er);
            }
    }

    return(
        !isLoading&&<div className="main-page">
            {<ListChildCard dataStudents={dataStudents} setModal={setModal} setActiveChildCard={setActiveChildCard} activeChildCardName={activeChildCardName} />}
            <ModalWindow setDateOut={setDateOut} sendMessage={sendMessage} setMessage={setMessage} isOpen={modal} setModal={setModal} setActiveChildCard={setActiveChildCard} className={className} fullName={activeChildCardName.fullName} id={activeChildCardName.id}  />
        </div>
    )
}
export default ClientPanel;