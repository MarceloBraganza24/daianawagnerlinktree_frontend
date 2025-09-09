// components/LinksManager.jsx
import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { authHeaders } from "../utils/authHeaders";

export default function LinksManager() {
  const emptyForm = { url_destino: "", img_link: "", descripcion_link: "" };
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // edición
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [file, setFile] = useState(null);
  const [editFile, setEditFile] = useState(null);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/links", { headers: authHeaders(false) });
      if (res.ok) {
        const data = await res.json();
        console.log("Links recibidos:", data);
        setLinks(Array.isArray(data) ? data : []);
      } else {
        setLinks([]);
      }
    } catch (err) {
      console.error(err);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
    // eslint-disable-next-line
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("url_destino", form.url_destino);
      formData.append("descripcion_link", form.descripcion_link);
      if (file) formData.append("img_link", file);

      const res = await fetch("http://localhost:5000/api/links", {
        method: "POST",
        headers: {
          Authorization: authHeaders(true).Authorization, // solo auth, sin Content-Type
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Error al crear: " + (err.error || res.status));
        return;
      }
      setForm(emptyForm);
      setFile(null);
      fetchLinks();
    } catch (err) {
      alert("Error al conectar con el servidor");
    } finally {
      setCreating(false);
    }
  };


  const openEdit = (link) => {
    setEditId(link._id);
    setEditForm({
      url_destino: link.url_destino || "",
      img_link: link.img_link || "",
      descripcion_link: link.descripcion_link || "",
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSavingEdit(true);
    try {
      const formData = new FormData();
      formData.append("url_destino", editForm.url_destino);
      formData.append("descripcion_link", editForm.descripcion_link);
      if (editFile) formData.append("img_link", editFile);

      const res = await fetch(`http://localhost:5000/api/links/${editId}`, {
        method: "PUT",
        headers: {
          Authorization: authHeaders(true).Authorization,
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Error al actualizar: " + (err.error || res.status));
        return;
      }
      setEditOpen(false);
      setEditId(null);
      setEditFile(null);
      fetchLinks();
    } catch (err) {
      alert("Error al conectar con el servidor");
    } finally {
      setSavingEdit(false);
    }
  };

  const removeLink = async (id) => {
    if (!window.confirm("¿Eliminar este link?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/links/${id}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("Error al eliminar: " + (err.error || res.status));
        return;
      }
      fetchLinks();
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="linksManager">
        
        <h2 className="linksManager__title">Links</h2>

        <form onSubmit={handleCreate} className="">

            <div className="linksManager__labelInput">
              <div className="linksManager__labelInput__label">URL destino</div>
              <input
              className="linksManager__labelInput__input"
              placeholder="URL destino"
              name="url_destino"
              value={form.url_destino}
              onChange={(e) => setForm({ ...form, url_destino: e.target.value })}
              required
              />
            </div>

            <div className="linksManager__labelInput">
              <div className="linksManager__labelInput__label">Imagen link</div>
              <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <div className="linksManager__labelInput">
              <div className="linksManager__labelInput__label">Descripción</div>
              <input
              className="linksManager__labelInput__input"
              placeholder="Descripción"
              name="descripcion_link"
              value={form.descripcion_link}
              onChange={(e) => setForm({ ...form, descripcion_link: e.target.value })}
              />
            </div>

            <div className="linksManager__btn">
              <button className="linksManager__btn__prop" disabled={creating}>
              {creating ? "Agregando…" : "Agregar"}
              </button>
            </div>

        </form>

        <div className="linksManager__linksList">
            {loading ? (
            <p className="">Cargando links…</p>
            ) : links.length === 0 ? (
            <p className="">No hay links aún.</p>
            ) : (
            <ul className="linksManager__linksList__ul">
                <div className="linksManager__linksList__ul__title">Lista de links cargados</div>
                {links.map((link) => (
                <li key={link._id} className="linksManager__linksList__ul__li">
                    <div className="">
                    {link.img_link ? (
                        <img src={`http://localhost:5000${link.img_link}`} alt="thumb" className="linksManager__imgLink" />
                    ) : (
                        <div className="">sin imagen</div>
                    )}
                    </div>

                    <div className="">
                    <p className="">{link.descripcion_link || "(Sin descripción)"}</p>
                    <a className="" href={link.url_destino} target="_blank" rel="noreferrer">
                        {link.url_destino}
                    </a>
                    </div>

                    <div className="">
                    <button className="" onClick={() => openEdit(link)}>Editar</button>
                    <button className="" onClick={() => removeLink(link._id)}>Eliminar</button>
                    </div>
                </li>
                ))}
            </ul>
            )}
        </div>

        {/* <Modal open={editOpen} title="Editar link" onClose={() => setEditOpen(false)} footer={
            <>
            <button className="editModalContainer__editModal__footer__btn" onClick={() => setEditOpen(false)}>Cancelar</button>
            <button className="editModalContainer__editModal__footer__btn" onClick={saveEdit} disabled={savingEdit}>
                {savingEdit ? "Guardando…" : "Guardar cambios"}
            </button>
            </>
        }>
            <div className="editModalContainer__editModal__labelInputContainer">
              <div className="editModalContainer__editModal__labelInputContainer__label">URL destino</div>
              <input className="editModalContainer__editModal__labelInputContainer__input" value={editForm.url_destino} onChange={(e) => setEditForm({ ...editForm, url_destino: e.target.value })} />
            </div>

            <div className="editModalContainer__editModal__labelInputContainer">
              <div className="editModalContainer__editModal__labelInputContainer__label">URL imagen (opcional)</div>
              <input className="editModalContainer__editModal__labelInputContainer__input" value={editForm.img_link} onChange={(e) => setEditForm({ ...editForm, img_link: e.target.value })} />
            </div>

            <div className="editModalContainer__editModal__labelInputContainer">
              <div className="editModalContainer__editModal__labelInputContainer__label">Descripción</div>
              <input className="editModalContainer__editModal__labelInputContainer__input" value={editForm.descripcion_link} onChange={(e) => setEditForm({ ...editForm, descripcion_link: e.target.value })} />
            </div>
        </Modal> */}
        <Modal
          open={editOpen}
          title="Editar link"
          onClose={() => setEditOpen(false)}
          footer={
            <>
              <button
                className="editModalContainer__editModal__footer__btn"
                onClick={() => setEditOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="editModalContainer__editModal__footer__btn"
                onClick={saveEdit}
                disabled={savingEdit}
              >
                {savingEdit ? "Guardando…" : "Guardar cambios"}
              </button>
            </>
          }
        >
          <div className="editModalContainer__editModal__labelInputContainer">
            <div className="editModalContainer__editModal__labelInputContainer__label">
              URL destino
            </div>
            <input
              className="editModalContainer__editModal__labelInputContainer__input"
              value={editForm.url_destino}
              onChange={(e) =>
                setEditForm({ ...editForm, url_destino: e.target.value })
              }
            />
          </div>

          {/* Imagen actual + inputFile para nueva imagen */}
          <div className="editModalContainer__editModal__labelInputContainer">
            <div className="editModalContainer__editModal__labelInputContainer__label">
              Imagen actual
            </div>
            {editForm.img_link ? (
              <img
                src={`http://localhost:5000${editForm.img_link}`}
                alt="preview"
                style={{ width: "120px", marginBottom: "8px" }}
              />
            ) : (
              <p>Sin imagen</p>
            )}

            <div className="editModalContainer__editModal__labelInputContainer__label">
              Cambiar imagen
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditFile(e.target.files[0])}
            />
          </div>

          <div className="editModalContainer__editModal__labelInputContainer">
            <div className="editModalContainer__editModal__labelInputContainer__label">
              Descripción
            </div>
            <input
              className="editModalContainer__editModal__labelInputContainer__input"
              value={editForm.descripcion_link}
              onChange={(e) =>
                setEditForm({ ...editForm, descripcion_link: e.target.value })
              }
            />
          </div>
        </Modal>
    </div>
  );
}
