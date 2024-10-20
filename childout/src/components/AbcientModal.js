import './Abcient.css'
import React from 'react'
import moment from "moment";
import {green} from "@mui/material/colors";
const AbcientModal = ({id, fullName}) =>{
    const [isOpen, setIsOpen] = React.useState(true);
    const [cause, setCause] = React.useState('inSchool');
    const [color,setColor] = React.useState('green');

    function handleSend(){
        setIsOpen(false);
        const date = moment().format();
        console.log(id, fullName)
        console.log(cause);
        console.log(date);
    }
    function changeCause(e){
        if(e.target.value === "inSchool"){
            setColor('green')
        }
        else{
            setColor('red')
        }
        setCause(e.target.value)
    }


    return(
            <div className="abcent-modal__body"
                 style={{display: 'grid', gridTemplateColumns: '40fr 1fr',width:'80%', justifyContent: 'space-between', padding:'10px', background: 'white', borderRadius:'5px'}}>
                <div className="">{fullName}</div>
                <select value={cause} onChange={(e) => changeCause(e)}
                        style={{background: color, width: '20px', borderRadius: '5px'}}>
                    <option value={'inSchool'} style={{background: "white"}}>Присутствует</option>
                    <option value={'gripp'} style={{background: "white"}}>Грипп</option>
                    <option value={'covid'} style={{background: "white"}}>Ковид</option>
                    <option value={'zayavlenie'} style={{background: "white"}}>Заявление родителей</option>
                    <option value={'by'} style={{background: "white"}}>Без причины</option>

                </select>
            </div>

    )
}
export default AbcientModal;