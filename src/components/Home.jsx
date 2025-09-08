import React from 'react'

const Home = () => {

    return (

        <>

            <div className='homeContainer'>

                <div  className='homeContainer__linkTreeContainer'>

                    <div  className='homeContainer__linkTreeContainer__img'>
                        <img className='homeContainer__linkTreeContainer__img__prop' src="/src/assets/img_profile.webp" alt="img_client" />
                    </div>

                    <div className='homeContainer__linkTreeContainer__name'>Marcelo Braganza</div>

                    <div className='homeContainer__linkTreeContainer__description'>Desarrollador web full stack</div>

                    <div className='homeContainer__linkTreeContainer__links'>

                        <a className='homeContainer__linkTreeContainer__links__link' href="">

                            <div className='homeContainer__linkTreeContainer__links__link__img'>
                                <img className='homeContainer__linkTreeContainer__links__link__img__prop' src="/src/assets/img_profile.webp" alt="img_miniature" />
                            </div>

                            <div className='homeContainer__linkTreeContainer__links__link__label'>Portfolio Marcelo Braganza</div>

                        </a>

                        <a className='homeContainer__linkTreeContainer__links__link' href="">

                            <div className='homeContainer__linkTreeContainer__links__link__img'>
                                <img className='homeContainer__linkTreeContainer__links__link__img__prop' src="/src/assets/logoMBsolucionesinformaticaspng.png" alt="img_miniature" />
                            </div>

                            <div className='homeContainer__linkTreeContainer__links__link__label'>MB Soluciones Infomáticas</div>

                        </a>

                        <a className='homeContainer__linkTreeContainer__links__link' href="">

                            <div className='homeContainer__linkTreeContainer__links__link__img'>
                                <img className='homeContainer__linkTreeContainer__links__link__img__prop' src="/src/assets/logo_insta.png" alt="img_miniature" />
                            </div>

                            <div className='homeContainer__linkTreeContainer__links__link__label'>@marcee_braganza24</div>

                        </a>

                        <a className='homeContainer__linkTreeContainer__links__link' href="">

                            <div className='homeContainer__linkTreeContainer__links__link__img'>
                                <img className='homeContainer__linkTreeContainer__links__link__img__prop' src="/src/assets/logo_face.png" alt="img_miniature" />
                            </div>

                            <div className='homeContainer__linkTreeContainer__links__link__label'>Marcee Braganza</div>

                        </a>

                        <a className='homeContainer__linkTreeContainer__links__link' href="">

                            <div className='homeContainer__linkTreeContainer__links__link__img'>
                                <img className='homeContainer__linkTreeContainer__links__link__img__prop' src="/src/assets/logo_whap.png" alt="img_miniature" />
                            </div>

                            <div className='homeContainer__linkTreeContainer__links__link__label'>+54 9 2926459172</div>

                        </a>

                    </div>

                </div>
                
            </div>

        </>

    )

}

export default Home