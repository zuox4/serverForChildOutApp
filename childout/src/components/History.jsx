import React, {useContext, useEffect, useState} from 'react';
import CardOut from "./CardOut";
import ChildCard from "./ChildCard";
import axios from "axios";
import {UserId} from "../App";

import close from "../assets/close.svg";
import moment from "moment";

const History = () => {
    const { user } = useContext(UserId);
    const [history, setHistory] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [data,setData] = useState('');
    function getHistoryOuts(){
        axios.get(`/get_history_user/${user.id}`).then((response) => {
            console.log(response);
            setHistory(response.data.history_list);

            const newArray = response.data.history_list.filter(elem=>{
                const date = new Date(elem.data_time_out)
                const day = new Date()
                console.log()
                return date.toLocaleDateString()===day.toLocaleDateString()
            })
            setFilteredData(newArray)
        })
    }

    useEffect(() => {
        const data = moment().format('dddd');
        setData(data)
        getHistoryOuts()
    }, []);
    function getDate(date){
        const v = moment(date).toISOString().split('T')[1].split('.')[0];
        return v}
    function deletePass(id){
        console.log(id);
        axios.post(`/delete_pass`, {pass_id:id}).then((response) => {
            console.log(response)
            alert(`Пропуск ${id} удален`)
            const newMass = filteredData.filter(elem=>elem.id !== id)
            setFilteredData(newMass);
        }).catch(e=>console.log(e));
    }
    return (
        <div className={'card-out-list'}
             style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h1 style={{margin: 0, fontSize: '25px', marginTop: '27px', fontWeight: '400'}}>ИСТОРИЯ ВЫХОДОВ</h1>
            <h1 style={{margin: 0, fontSize: '25px', marginTop: '27px', fontWeight: '400'}}>{data}</h1>
            <div style={{
                width: '200px',
                backgroundColor: 'white',
                height: '2px',
                marginBottom: '10px',
                marginTop: '10px'
            }}></div>
            {filteredData.length===0?<h1 style={{color:'#aaaaaa3d'}}>История пуста</h1>:filteredData.map(el => <div className={'childCard'} key={el.id}
                                         style={{gridTemplateColumns: '3fr 1fr 1fr', alignItems: 'center'}}>
                <div className="childName" style={{marginLeft: '10px'}}>{el.student_name}</div>
                <div className="date-time" style={{marginLeft: '10px'}}>{getDate(el.data_time_out)}</div>
                <div style={{}}>
                    <img src={close} onClick={() => deletePass(el.id)} style={{width: '20px'}}/>
                </div>

            </div>)}
        </div>
    );
};

export default History;