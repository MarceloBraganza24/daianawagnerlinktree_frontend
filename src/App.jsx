import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AboutProfesional from './components/AboutProfesional.jsx';

function App() {

    return (

        <>
            <BrowserRouter>

                <Routes>

                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/aboutProfesional" element={<AboutProfesional />} />
                    <Route
                        path="/admin"
                        element={
                            <PrivateRoute>
                                <AdminPanel />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/login" replace />} />

                </Routes>

                <ToastContainer />

            </BrowserRouter>
        </>

    )

}

export default App
