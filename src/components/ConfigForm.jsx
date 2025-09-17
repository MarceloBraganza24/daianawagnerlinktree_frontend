import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function ConfigForm() {
  const [config, setConfig] = useState(null);

  // Home
  const [homeType, setHomeType] = useState("color");
  const [homeColor, setHomeColor] = useState("#d3d3d3");
  const [homeImage, setHomeImage] = useState(null); // solo File
  const [homePreviewUrl, setHomePreviewUrl] = useState(null); // URL local o GCS


  // Linktree
  const [linkTreeType, setLinkTreeType] = useState("image");
  const [linkTreeColor, setLinkTreeColor] = useState("#000000");
  const [linkTreeImage, setLinkTreeImage] = useState(null);
  const [linkTreePreviewUrl, setLinkTreePreviewUrl] = useState(null); // URL local o GCS
  const [linkTreeOpacity, setLinkTreeOpacity] = useState(1);


  // Cargar config actual
  useEffect(() => {
    fetch(`${API_URL}/api/config`)
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);

        // Home
        setHomeType(data.homeBackgroundType);
        if (data.homeBackgroundType === "color") {
          setHomeColor(data.homeBackgroundValue);
        } else {
          setHomePreviewUrl(data.homeBackgroundValue); // GCS URL
        }

        // Linktree
        setLinkTreeType(data.linkTreeBackgroundType);
        if (data.linkTreeBackgroundType === "color") {
          setLinkTreeColor(data.linkTreeBackgroundValue);
          setLinkTreeOpacity(data.linkTreeBackgroundOpacity || 0.7);
        } else {
          setLinkTreePreviewUrl(data.linkTreeBackgroundValue); // 👈 GCS URL
        }
      })
      .catch((err) => console.error("Error cargando config:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Home
    formData.append("homeBackgroundType", homeType);
    if (homeType === "color") {
      formData.append("homeBackgroundColor", homeColor);
    } else if (homeImage instanceof File) {
      // 👈 solo mando si es un archivo
      formData.append("homeBackgroundImage", homeImage);
    }

    // Linktree
    formData.append("linkTreeBackgroundType", linkTreeType);
    if (linkTreeType === "color") {
      formData.append("linkTreeBackgroundColor", linkTreeColor);
      formData.append("linkTreeBackgroundOpacity", linkTreeOpacity);
    } else if (linkTreeImage instanceof File) {
      // 👈 solo mando si es un archivo
      formData.append("linkTreeBackgroundImage", linkTreeImage);
    }

    const res = await fetch(`${API_URL}/api/config`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setConfig(data);

    // ✅ refrescamos el estado local con las URLs que devuelve el backend
    if (data.homeBackgroundType === "image") {
      setHomePreviewUrl(data.homeBackgroundValue);  // 👈 usamos previewUrl
      setHomeImage(null); // limpiamos File para no confundir
    }
    if (data.linkTreeBackgroundType === "image") {
      setLinkTreePreviewUrl(data.linkTreeBackgroundValue); // 👈 usamos previewUrl
      setLinkTreeImage(null);
    }

    toast(`Configuración actualizada ✅`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      className: "custom-toast",
    });
  };


  function hexToRgba(hex, alpha) {
    let r = 0, g = 0, b = 0;

    // Quitar el '#' si existe
    if (hex[0] === "#") hex = hex.slice(1);

    // Formato corto #RGB
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    }
    // Formato largo #RRGGBB
    else if (hex.length === 6) {
      r = parseInt(hex.slice(0,2), 16);
      g = parseInt(hex.slice(2,4), 16);
      b = parseInt(hex.slice(4,6), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  useEffect(() => {
    return () => {
      if (homePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(homePreviewUrl);
      }
    };
  }, [homePreviewUrl]);


  return (
    <div className="configForm">
      <h2 className="configForm__title">Configuración de imagenes del "Home"</h2>

      <div className="configForm__separatorSection">
        <div className="configForm__separatorSection__prop"></div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Fondo Home */}
        <div className="configForm__section">
          
          <div className="configForm__section__title">Fondo Home</div>
          <div className="configForm__section__labels">

            <label>
              <input
                type="radio"
                name="homeType"
                value="color"
                checked={homeType === "color"}
                onChange={() => setHomeType("color")}
              />{" "}
              Color
            </label>
            <label>
              <input
                type="radio"
                name="homeType"
                value="image"
                checked={homeType === "image"}
                onChange={() => setHomeType("image")}
              />{" "}
              Imagen
            </label>

            {homeType === "color" && (
              <input type="color" value={homeColor} onChange={(e) => setHomeColor(e.target.value)} />
            )}
            {homeType === "image" && (
              <input 
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setHomeImage(file);
                  setHomePreviewUrl(URL.createObjectURL(file)); // preview local
                }} 
              />
            )}

            {config && (
              <div className="configForm__section__labels__preview">
                <div className="configForm__section__labels__preview__title">Vista previa</div>
                <div
                  className="configForm__section__labels__preview__img"
                  style={{
                    background:
                      homeType === "color"
                        ? homeColor
                        : homeImage
                        ? `url(${URL.createObjectURL(homeImage)}) center/cover no-repeat`
                        : homePreviewUrl
                        ? `url(${homePreviewUrl}) center/cover no-repeat`
                        : "#d3d3d3",
                  }}
                />
              </div>
            )}

          </div>

        </div>

        {/* Fondo Home */}
        <div className="configForm__sectionMobile">
          <div className="configForm__sectionMobile__title"  style={{paddingBottom:'1vh'}}>Fondo Home</div>
          <div className="configForm__sectionMobile__labels">

            <label>
              <input
                type="radio"
                name="homeTypeMobile"
                value="color"
                checked={homeType === "color"}
                onChange={() => setHomeType("color")}
              />{" "}
              Color
            </label>
            <label>
              <input
                type="radio"
                name="homeTypeMobile"
                value="image"
                checked={homeType === "image"}
                onChange={() => setHomeType("image")}
              />{" "}
              Imagen
            </label>

          </div>


          {homeType === "color" && (
            <input className="configForm__sectionMobile__inputColor" type="color" value={homeColor} onChange={(e) => setHomeColor(e.target.value)} />
          )}
          {homeType === "image" && (
            <input
              className="configForm__sectionMobile__inputFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setHomeImage(file);
                setHomePreviewUrl(URL.createObjectURL(file)); // preview local
              }} 
            />
          )}

          {config && (
            <div className="configForm__sectionMobile__labels__preview">
              <div className="configForm__sectionMobile__labels__preview__title">Vista previa</div>
              <div
                className="configForm__sectionMobile__labels__preview__img"
                style={{
                  background:
                    homeType === "color"
                      ? homeColor
                      : homeImage
                      ? `url(${URL.createObjectURL(homeImage)}) center/cover no-repeat`
                      : homePreviewUrl
                      ? `url(${homePreviewUrl}) center/cover no-repeat`
                      : "#d3d3d3",
                }}
              />
            </div>
          )}


        </div>

        <div className="configForm__separatorSection">
          <div className="configForm__separatorSection__prop"></div>
        </div>

        {/* Fondo Linktree */}
        <div className="configForm__section">
          <div className="configForm__section__title">Fondo Linktree</div>
          <div className="configForm__section__labels">
            <label>
              <input
                type="radio"
                name="linkTreeType"
                value="color"
                checked={linkTreeType === "color"}
                onChange={() => setLinkTreeType("color")}
              />{" "}
              Color
            </label>
            <label>
              <input
                type="radio"
                name="linkTreeType"
                value="image"
                checked={linkTreeType === "image"}
                onChange={() => setLinkTreeType("image")}
              />{" "}
              Imagen
            </label>

            {linkTreeType === "color" && (
              <>
                  <input
                    type="color"
                    value={linkTreeColor}
                    onChange={(e) => setLinkTreeColor(e.target.value)}
                  />
                  <label style={{paddingLeft:'1vh',}}>
                    Opacidad: {linkTreeOpacity}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={linkTreeOpacity}
                      onChange={(e) => setLinkTreeOpacity(e.target.value)}
                      className="opacity-slider"
                      style={{
                        marginLeft:'1vh',
                        background: `linear-gradient(to right, ${hexToRgba(linkTreeColor, linkTreeOpacity)} 0%, ${hexToRgba(linkTreeColor, linkTreeOpacity)} ${linkTreeOpacity * 100}%, #ccc ${linkTreeOpacity * 100}%, #ccc 100%)`
                      }}
                    />
                  </label>
              </>
            )}
            {linkTreeType === "image" && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setLinkTreeImage(file);
                  setLinkTreePreviewUrl(URL.createObjectURL(file));
                }}
              />
            )}
            {config && (
              <div className="configForm__section__labels__preview">
                <div className="configForm__section__labels__preview__title">Vista previa</div>
                <div
                  className="configForm__section__labels__preview__imgLinktree"
                  style={{
                    background:
                      linkTreeType === "color"
                        ? hexToRgba(linkTreeColor, linkTreeOpacity)
                        : linkTreeImage
                        ? `url(${URL.createObjectURL(linkTreeImage)}) center/cover no-repeat`
                        : linkTreePreviewUrl
                        ? `url(${linkTreePreviewUrl}) center/cover no-repeat`
                        : "#7a7a7aff",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Fondo LinktreeMobile */}
        <div className="configForm__sectionMobile">
          <div className="configForm__sectionMobile__title"  style={{paddingBottom:'1vh'}}>Fondo Linktree</div>
          <div className="configForm__sectionMobile__labels"  style={{paddingBottom:'1vh'}}>
            <label>
              <input
                type="radio"
                name="linkTreeTypeMobile"
                value="color"
                checked={linkTreeType === "color"}
                onChange={() => setLinkTreeType("color")}
              />{" "}
              Color
            </label>
            <label>
              <input
                type="radio"
                name="linkTreeTypeMobile"
                value="image"
                checked={linkTreeType === "image"}
                onChange={() => setLinkTreeType("image")}
              />{" "}
              Imagen
            </label>
          </div>


          {linkTreeType === "color" && (
            <>
              <div style={{paddingBottom:'1vh'}}>
                <input
                  type="color"
                  value={linkTreeColor}
                  onChange={(e) => setLinkTreeColor(e.target.value)}
                  />
                <label style={{paddingLeft:'1vh',}}>
                  Opacidad: {linkTreeOpacity}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={linkTreeOpacity}
                    onChange={(e) => setLinkTreeOpacity(e.target.value)}
                    className="opacity-slider"
                    style={{
                      marginLeft:'1vh',
                      background: `linear-gradient(to right, ${hexToRgba(linkTreeColor, linkTreeOpacity)} 0%, ${hexToRgba(linkTreeColor, linkTreeOpacity)} ${linkTreeOpacity * 100}%, #ccc ${linkTreeOpacity * 100}%, #ccc 100%)`
                    }}
                  />
                </label>
              </div>
            </>
          )}
          {linkTreeType === "image" && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setLinkTreeImage(file);
                setLinkTreePreviewUrl(URL.createObjectURL(file));
              }}
            />
          )}
          {config && (
            <div className="configForm__sectionMobile__labels__preview">
              <div className="configForm__sectionMobile__labels__preview__title">Vista previa</div>
              <div
                className="configForm__sectionMobile__labels__preview__imgLinktree"
                style={{
                  background:
                    linkTreeType === "color"
                      ? hexToRgba(linkTreeColor, linkTreeOpacity)
                      : linkTreeImage
                      ? `url(${URL.createObjectURL(linkTreeImage)}) center/cover no-repeat`
                      : linkTreePreviewUrl
                      ? `url(${linkTreePreviewUrl}) center/cover no-repeat`
                      : "#7a7a7aff",
                }}
              />
            </div>
          )}
          
        </div>

        <div className="configForm__separatorSection">
          <div className="configForm__separatorSection__prop"></div>
        </div>

        <div className="configForm__btn">
          <button type="submit" className="configForm__btn__prop">
            Guardar
          </button>
        </div>
      </form>

    </div>
  );
}
