import React, { useEffect, useState } from "react";
import axios from "axios";
import { setFavicon } from "../utils/setFavicon";

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
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
            setProfile(res.data.profile);
            setLinks(res.data.links);
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
                className="homeContainer"
                style={{
                    background: config
                    ? config.homeBackgroundType === "color"
                        ? config.homeBackgroundValue
                        : `url(${config.homeBackgroundValue}) center/cover no-repeat`
                    : "#d3d3d3",
                }}
            >
                <div
                    style={{
                        background: config?.linkTreeBackgroundType === "color"
                            ? hexToRgba(config.linkTreeBackgroundValue, config.linkTreeBackgroundOpacity || 0.7)
                            : config?.linkTreeBackgroundValue
                            ? `url(${config.linkTreeBackgroundValue}) center/cover no-repeat`
                            : "",
                    }}
                    className="homeContainer__linkTreeContainer"
                >

                    {
                        profile?.nombreProfesional &&

                        <>
                        
                            <div  className='homeContainer__linkTreeContainer__img'>
                                <img className='homeContainer__linkTreeContainer__img__prop' src={`${profile?.avatar}`} alt="img_client" />
                            </div>

                            <div className='homeContainer__linkTreeContainer__name'>{profile?.nombreProfesional}</div>

                            <div className='homeContainer__linkTreeContainer__description'>
                                <div className='homeContainer__linkTreeContainer__description__prop'>{profile?.descripcionProfesional}</div>
                            </div>

                            <div className='homeContainer__linkTreeContainer__links'>
                                {links.map(link => {
                                    const isAboutMe = link.url_destino.includes("/aboutProfesional");

                                    return (
                                    <a
                                        className='homeContainer__linkTreeContainer__links__link'
                                        key={link._id}
                                        href={`${API_URL}/api/public/click/${link._id}`}
                                        target={isAboutMe ? "_self" : "_blank"}
                                        rel={isAboutMe ? undefined : "noreferrer"}
                                    >
                                        <div className='homeContainer__linkTreeContainer__links__link__img'>
                                        <img
                                            className='homeContainer__linkTreeContainer__links__link__img__prop'
                                            src={link.img_link}
                                            alt="img_miniature"
                                        />
                                        </div>

                                        <div className="homeContainer__linkTreeContainer__links__link__label">
                                        <div className='homeContainer__linkTreeContainer__links__link__label__prop'>
                                            {link.descripcion_link}
                                        </div>
                                        </div>
                                    </a>
                                    );
                                })}
                            </div>

                        </>

                    }

                </div>
                
            </div>

        </>

    )

}

export default Home