import Footer from "./Footer";
import {Outlet} from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import React, {useContext, useEffect, useState} from "react";
import ProtectedRoute from "./ProtectedRoute";
import {UserId} from "../App";

function Root() {
    const { user } = useContext(UserId);
    const [dataStudents, setStudents] = useState([]);
    const [className, setClassName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    async function fetchClassInfoByTeacher(teacherId) {
        try {
            const response = await axios.get(`/get_info_mentor/${teacherId}`);
            const { className, students } = response.data;
            setClassName(className);
            setStudents(students);
        } catch (error) {
            // Обрабатываем ошибки
            console.error('Ошибка при получении данных:', error.response ? error.response.data : error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchClassInfoByTeacher(user.id);
    }, [user.id]);

    return (
        <div className="Main">
            <Header nameApp={'Классный помощник'} />

            {!isLoading && (
                <ProtectedRoute>
                    <Outlet context={[className, dataStudents, isLoading]} />
                </ProtectedRoute>
            )}
            {isLoading && <div>Загрузка...</div>}
            <Footer />
        </div>
    );
}

export default Root;