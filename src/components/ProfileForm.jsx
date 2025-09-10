// components/ProfileForm.jsx
import React, { useEffect, useState } from "react";
import { authHeaders } from "../utils/authHeaders";
import { toast } from "react-toastify";

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nombreProfesional, setNombre] = useState("");
  const [descripcionProfesional, setDescripcion] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/profile", { headers: authHeaders(false) });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setNombre(data.nombreProfesional || "");
            setDescripcion(data.descripcionProfesional || "");
            setAvatarUrl(data.avatar || "");
          }
        } else {
          // opcional: manejo de errores
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFile = (e) => {
    const f = e.target.files?.[0] || null;
    setAvatarFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("nombreProfesional", nombreProfesional);
      fd.append("descripcionProfesional", descripcionProfesional);
      if (avatarFile) fd.append("avatar", avatarFile);

      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: authHeaders(false), // NO poner Content-Type para FormData
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error" }));
        //alert("Error: " + (err.error || "No se pudo guardar"));
        toast(`Ha ocurrido un error al guardar, intente nuevamente!`, {
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
        return;
      }

      const data = await res.json();
      setAvatarUrl(data.avatar || avatarUrl);
      toast(`Perfil actualizado ✅`, {
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
    } catch (err) {
      //alert("Error al guardar perfil");
      console.error("Error: ",err)
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profileForm">
      <h2 className="profileForm__title">Perfil del/la profesional</h2>

      {loading ? (
        <p className="">Cargando…</p>
      ) : (
        <form onSubmit={handleSubmit} className="">
          <div className="">

            <div className="profileForm__labelInput">
              <label className="profileForm__labelInput__label">Nombre</label>
              <input className="profileForm__labelInput__input" value={nombreProfesional} onChange={(e) => setNombre(e.target.value)} />
            </div>

            <div className="profileForm__labelInput">
              <label className="profileForm__labelInput__label">Descripción</label>
              <textarea className="profileForm__labelInput__textArea" value={descripcionProfesional} onChange={(e) => setDescripcion(e.target.value)} />
            </div>

            <div className="profileForm__labelInput">
              <label className="profileForm__labelInput__label">Foto de perfil</label>
              {avatarFile ? (
                <img src={URL.createObjectURL(avatarFile)} alt="preview" className="profileForm__labelInput__imgAvatar" />
              ) : avatarUrl ? (
                <img src={`http://localhost:5000${avatarUrl}`} alt="avatar" className="profileForm__labelInput__imgAvatar" />
              ) : (
                <div className="">Sin imagen</div>
              )}
            </div>

            <div className="profileForm__labelInputFile">
              <input type="file" accept="image/*" onChange={handleFile} />
              <p className="">JPG/PNG/GIF. Máx 2MB.</p>
            </div>

            <div className="profileForm__btn">
              <button className="profileForm__btn__prop" disabled={saving}>
                {saving ? "Guardando…" : "Guardar perfil"}
              </button>
            </div>

          </div>

        </form>
      )}
    </div>
  );
}
