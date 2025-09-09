import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [links, setLinks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/public/home")
        .then(res => {
            setProfile(res.data.profile);
            setLinks(res.data.links);
        })
        .catch(err => console.error(err));
    }, []);

    /* if (!profile?.nombreProfesional) return <div className="loadingHome">Cargando...</div>; */

    return (

        <>

            <div className='homeContainer'>

                <div  className='homeContainer__linkTreeContainer'>

                    {
                        profile?.nombreProfesional &&

                        <>
                        
                            <div  className='homeContainer__linkTreeContainer__img'>
                                <img className='homeContainer__linkTreeContainer__img__prop' src={`http://localhost:5000${profile?.avatar}`} alt="img_client" />
                            </div>

                            <div className='homeContainer__linkTreeContainer__name'>{profile?.nombreProfesional}</div>

                            <div className='homeContainer__linkTreeContainer__description'>{profile?.descripcionProfesional}</div>

                            <div className='homeContainer__linkTreeContainer__links'>

                                {links.map(link => (

                                    <a 
                                        className='homeContainer__linkTreeContainer__links__link'
                                        key={link._id}
                                        href={link.url_destino}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >

                                        <div className='homeContainer__linkTreeContainer__links__link__img'>
                                            <img className='homeContainer__linkTreeContainer__links__link__img__prop' src={`http://localhost:5000${link.img_link}`} alt="img_miniature" />
                                        </div>

                                        <div className='homeContainer__linkTreeContainer__links__link__label'>{link.descripcion_link}</div>

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