// components/AdminPanel.jsx
import React from "react";
import ProfileForm from "./ProfileForm";
import LinksManager from "./LinksManager";

export default function AdminPanel() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

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
      </main>
    </div>
  );
}
