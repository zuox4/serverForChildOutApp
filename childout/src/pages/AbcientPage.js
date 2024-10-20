import MultiSelectDropdown from "../components/MultiSelectDropdown";
import React, {useContext} from "react";
import {useOutlet, useOutletContext} from "react-router-dom";
import '../components/ChildCard.css'
import AbcientModal from "../components/AbcientModal";
import moment from "moment";
import 'moment/locale/ru';
function AbcientPage() {

    const [className, dataStudents, isLoading] = useOutletContext()

    return (
        !isLoading&& <div className="AbcientPage" style={{
            alignItems: "center",
            justifyContent: "center",
            width: '100%',
            display: "flex",
            flexDirection: 'column'
        }}>
            <h1 style={{textAlign: 'center', marginTop: '10px', color: 'white', fontSize: '25px'}}>Отсутствующие</h1>
            <div style={{
                width: '200px',
                backgroundColor: 'white',
                height: '2px',
                marginBottom: '0px',
                marginTop: '10px'
            }}></div>
            <h1 style={{marginTop:'0px', fontSize:'18px', marginBottom:'20px'}}>{moment().locale('ru').format('LL')}</h1>

            <div style={{display: 'flex', width: '80%', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom:'100px'}}>
                {dataStudents.map((student, index) => (
                    <AbcientModal fullName={student.fullName} id={student.id} key={student.id}/>))}
            </div>

        </div>

    )
}

export default AbcientPage;