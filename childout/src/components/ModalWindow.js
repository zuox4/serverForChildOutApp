import './ModalWindow.css'
import {useEffect, useState} from "react";

function ShowModalWindow({isOpen, setModal, fullName, setMessage, sendMessage, setActiveChildCard, setDateOut, className}) {
    const [dateTime, setDateTime] = useState(Date.now())
    function getLocalFormattedDateTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Добавляем 1, так как месяцы в JS начинаются с 0
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    useEffect(()=>{
        console.log(dateTime)
        setDateOut(dateTime)
    }, [dateTime])
    function sendDataToServer() {
        sendMessage()
        setModal(false)
        setActiveChildCard(prevCard => ({...prevCard, fullName:''}))
    }
    useEffect(() => {
        setDateTime(getLocalFormattedDateTime())
    }, []);
    useEffect(() => {
        // Обновляем локальное сообщение, чтобы избежать бесконечного цикла
        const newMessage = fullName + ' в ' + dateTime + ' ' + className;
        console.log(newMessage)
        setMessage(newMessage);
       // Обновляем сообщение только если оно изменилось
        if (setMessage) {
            setMessage(newMessage);
        }
    }, [dateTime, fullName, setMessage]);

    return(
        <div className={isOpen?"modal-window":"modal-window close"}>
            <div className="modal-window-body" onClick={(e)=>e.stopPropagation()}>
                <div className="modal-window-header">Пропуск на выход</div>

                    <div className={"name"}>{fullName}</div>
                    <input type={'datetime-local'} value={dateTime} onChange={(e)=>setDateTime(e.target.value)}/>
                    <button onClick={()=>sendDataToServer()}>Подтвердить</button>
                    <div onClick={()=>setModal(false)} style={{color:"white", textDecoration:'underline'}}>Закрыть</div>

            </div>
        </div>
    )
}
export default ShowModalWindow;