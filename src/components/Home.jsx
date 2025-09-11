import React, { useEffect, useState } from "react";
import axios from "axios";
import { setFavicon } from "../utils/setFavicon";

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        axios.get(`${API_URL}/api/public/home`)
        .then(res => {
            setProfile(res.data.profile);
            setLinks(res.data.links);
            if (res.data.profile?.avatar) {
                setFavicon(`${API_URL}${res.data.profile.avatar}`);
            }
        })
        .catch(err => console.error(err));
    }, []);

    return (

        <>

            <div className='homeContainer'>

                <div  className='homeContainer__linkTreeContainer'>

                    {
                        profile?.nombreProfesional &&

                        <>
                        
                            <div  className='homeContainer__linkTreeContainer__img'>
                                <img className='homeContainer__linkTreeContainer__img__prop' src={`${API_URL}${profile?.avatar}`} alt="img_client" />
                            </div>

                            <div className='homeContainer__linkTreeContainer__name'>{profile?.nombreProfesional}</div>

                            <div className='homeContainer__linkTreeContainer__description'>
                                <div className='homeContainer__linkTreeContainer__description__prop'>{profile?.descripcionProfesional}</div>
                            </div>

                            <div className='homeContainer__linkTreeContainer__links'>

                                {links.map(link => (

                                    <a 
                                        className='homeContainer__linkTreeContainer__links__link'
                                        key={link._id}
                                        href={`${API_URL}/api/public/click/${link._id}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >

                                        <div className='homeContainer__linkTreeContainer__links__link__img'>
                                            <img className='homeContainer__linkTreeContainer__links__link__img__prop' src={`${API_URL}${link.img_link}`} alt="img_miniature" />
                                        </div>

                                        <div className="homeContainer__linkTreeContainer__links__link__label">
                                            <div className='homeContainer__linkTreeContainer__links__link__label__prop'>{link.descripcion_link}</div>
                                        </div>

                                    </a>
                                ))}

                            </div>

                        </>

                    }

                </div>
                
            </div>

        </>

    )

}

export default Home