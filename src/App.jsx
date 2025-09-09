import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {

    return (

        <>
            <BrowserRouter>

                <Routes>

                    {/* <Route exact path="/" element={<Home/>}/> */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <AdminPanel />
                        </PrivateRoute>
                    }
                    />
                    {/* Si querés redirigir la raíz al home público o al login: */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                </Routes>

                <ToastContainer />

            </BrowserRouter>
        </>

    )

}

export default App
