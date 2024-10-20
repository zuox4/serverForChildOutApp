import React, { useEffect, useState } from "react";
import axios from "axios";

function CardOut({ msg, order }) {
    const [messageData, setMessageData] = useState({});
    useEffect(() => {
        // Инициализация данных при первом рендере
        setMessageData(formatMessage(msg));

        // Устанавливаем интервал для обновления данных каждую секунду
        const interval = setInterval(() => {
            setMessageData(formatMessage(msg));
        }, 1000);

        // Очистка интервала при размонтировании компонента
        return () => clearInterval(interval);
    }, [msg]); // Обновляем только если msg изменяется

    function parseDate(dateString) {
        // Удаляем 'Z' в конце строки, если он присутствует
        if (dateString.endsWith('Z')) {
            dateString = dateString.slice(0, -1);
        }
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes] = timePart.split(':').map(Number);

        // Возвращаем дату в UTC
        return new Date(Date.UTC(year, month - 1, day, hours, minutes));
    }

    function formatMessage(message) {
        const parts = message.split(' ');
        const childName = parts[0] + ' ' + parts[1];
        const timeString = parts[parts.length - 2];
        const parsedDate = parseDate(timeString); // Парсим дату
        const dateOut = parsedDate.getTime();
        const dateNow = Date.now(); // Используем Date.now() для получения текущего времени в миллисекундах
        const className = parts[parts.length - 1];
        // Форматируем сообщение на основе сравнения времени
        return {
            name: childName,
            timeOut: formatDateTime(parsedDate), // Используем уже распарсенную дату
            confirmOut: dateOut <= dateNow + 3 * 60 * 60 * 1000 ? 'Выход разрешен' : 'Выход запрещен',
            className:className
        };
    }

    function formatDateTime(date) {
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${day}.${month} в ${hours}:${minutes}`;
    }

    return (
        <div className="CardOut"
             style={{ backgroundColor: messageData.confirmOut === "Выход разрешен" ? 'green' : 'red', order: -order }}>
            <h4>Имя ученика: <span style={{ textTransform: 'uppercase' }}>{messageData.name}</span></h4>
            <h4>Класс: <span>{messageData.className}</span> </h4>
            <h4>Время выхода: <span>{messageData.timeOut}</span></h4>
            <span style={{
                textTransform: 'uppercase',
                marginTop: '11px',
                fontWeight: 'bold'
            }}>{messageData.confirmOut}</span>
        </div>
    );
}

export default CardOut;