import React, { useEffect, useState } from "react";
import { authHeaders } from "../utils/authHeaders";
import axios from "axios";
import { setFavicon } from "../utils/setFavicon";

const AboutProfesional = () => {
    const [loading, setLoading] = useState(true);
    const [nombreProfesional, setNombre] = useState("");
    const [descripcionProfesional, setDescripcion] = useState("");
    const [aboutProfesional, setAboutProfesional] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [config, setConfig] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/config`)
        .then(res => res.json())
        .then(data => setConfig(data))
        .catch(err => console.error("Error cargando config:", err));
    }, []);

    useEffect(() => {
        axios.get(`${API_URL}/api/public/home`)
        .then(res => {
            setNombre(res.data.profile.nombreProfesional || "");
            setDescripcion(res.data.profile.descripcionProfesional || "");
            setAboutProfesional(res.data.profile.aboutProfesional || "");
            setAvatarUrl(res.data.profile.avatar || "");
            if (res.data.profile?.avatar) {
                setFavicon(res.data.profile.avatar);
            }
        })
        .catch(err => console.error(err));
    }, []);

    function hexToRgba(hex, opacity) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r},${g},${b},${opacity})`;
    }
    
    return (

        <>
            <div 
                className='aboutProfesionalContainer'
                style={{
                    background: config
                    ? config.homeBackgroundType === "color"
                        ? config.homeBackgroundValue
                        : `url(${config.homeBackgroundValue}) center/cover no-repeat`
                    : "#d3d3d3",
                }}
            >

                <div
                    className='aboutProfesionalContainer__aboutProfesional'
                    style={{
                        background: config?.linkTreeBackgroundType === "color"
                            ? hexToRgba(config.linkTreeBackgroundValue, config.linkTreeBackgroundOpacity || 0.7)
                            : config?.linkTreeBackgroundValue
                            ? `url(${config.linkTreeBackgroundValue}) center/cover no-repeat`
                            : "",
                    }}
                >

                    <div className='aboutProfesionalContainer__aboutProfesional__img'>
                        {
                            avatarUrl &&
                            <img
                            src={avatarUrl} // ✅ ya es URL completa (Cloud Storage)
                            alt="avatar"
                            className="aboutProfesionalContainer__aboutProfesional__img__prop"
                            />
                        }
                    </div>

                    <div className='aboutProfesionalContainer__aboutProfesional__title'>
                        <div className='aboutProfesionalContainer__aboutProfesional__title__prop'>{nombreProfesional}</div>
                    </div>

                    <div className='aboutProfesionalContainer__aboutProfesional__description'>
                        <div className='aboutProfesionalContainer__aboutProfesional__description__prop'>{descripcionProfesional}</div>
                    </div>

                    <div className='aboutProfesionalContainer__aboutProfesional__aboutText'>
                        <div className='aboutProfesionalContainer__aboutProfesional__aboutText__prop'>{aboutProfesional}</div>
                    </div>

                </div>

            </div>
        </>        

    )

}

export default AboutProfesional