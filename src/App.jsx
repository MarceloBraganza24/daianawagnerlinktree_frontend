import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home.jsx';

function App() {

    return (

        <>
            <BrowserRouter>

                <Routes>

                    <Route exact path="/" element={<Home/>}/>

                </Routes>

                <ToastContainer />

            </BrowserRouter>
        </>

    )

}

export default App
