import React, { useEffect } from "react";
import ProfileForm from "./ProfileForm";
import LinksManager from "./LinksManager";
import ConfigForm from "./ConfigForm";
import { setFavicon } from "../utils/setFavicon";
import axios from "axios";

export default function AdminPanel() {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
      axios.get(`${API_URL}/api/public/home`)
      .then(res => {
          if (res.data.profile?.avatar) {
              setFavicon(`${API_URL}${res.data.profile.avatar}`);
          }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="adminPanel">
      <header className="">
        <div className="">
          <h1 className="adminPanel__title">CPanel – Linktree</h1>
          <div className="adminPanel__btn">
            <button className="adminPanel__btn__prop" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </header>

      <main className="">
        <ProfileForm />
        <LinksManager />
        <ConfigForm /> 
      </main>
    </div>
  );
}
