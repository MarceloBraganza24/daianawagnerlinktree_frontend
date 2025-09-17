import React, { useEffect, useState,useRef  } from "react";
import Modal from "./Modal";
import { authHeaders } from "../utils/authHeaders";
import Spinner from "./Spinner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";

export default function LinksManager() {
  const emptyForm = { url_destino: "", img_link: "", descripcion_link: "" };
  const [links, setLinks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const [filePreviewUrl, setFilePreviewUrl] = useState(null); // para nuevo link
  const [editPreviewUrl, setEditPreviewUrl] = useState(null); // para edición


  // edición
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  
  const [file, setFile] = useState(null);
  const [createPreviewUrl, setCreatePreviewUrl] = useState(null);
  const [editFile, setEditFile] = useState(null);
  
  const [showConfirmationDeleteLinkModal, setShowConfirmationDeleteLinkModal] = useState(false);
  const [linkId, setLinkId] = useState("");
  const [linkDescription, setLinkDescription] = useState("");

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/links`, { headers: authHeaders(false) });
      if (res.ok) {
        const data = await res.json();
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
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("url_destino", form.url_destino);
      formData.append("descripcion_link", form.descripcion_link);
      if (file) formData.append("img_link", file);
      //if (file) setFilePreviewUrl(URL.createObjectURL(file)); // preview local

      const res = await fetch(`${API_URL}/api/links`, {
        method: "POST",
        headers: {
          Authorization: authHeaders(true).Authorization, // solo auth, sin Content-Type
        },
        body: formData,
      });

      if (!res.ok) {
        toast(`Error al crear link, intente nuevamente!`, {
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
      // limpiar estados
      setForm(emptyForm);
      setFile(null);
      setCreatePreviewUrl(null); // 👈 limpiamos preview
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast(`Has creado un link correctamente!`, {
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
      await fetchLinks();
    } catch (err) {
      toast(`Error al conectar con el servidor`, {
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
    } finally {
      setCreating(false);
    }
  };


  /* const openEdit = (link) => {
    setEditId(link._id);
    setEditForm({
      url_destino: link.url_destino || "",
      img_link: link.img_link || "",
      descripcion_link: link.descripcion_link || "",
    });
    setEditOpen(true);
  }; */
  const openEdit = (link) => {
    setEditId(link._id);
    setEditForm({
      url_destino: link.url_destino || "",
      img_link: link.img_link || "",
      descripcion_link: link.descripcion_link || "",
    });
    setEditPreviewUrl(link.img_link || null); // 👈 preview inicial desde GCS
    setEditFile(null); // reiniciamos archivo seleccionado
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

      const res = await fetch(`${API_URL}/api/links/${editId}`, {
        method: "PUT",
        headers: {
          Authorization: authHeaders(true).Authorization,
        },
        body: formData,
      });

      if (!res.ok) {
        toast(`Error al actualizar link, intente nuevamente!`, {
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
      // cerrar modal y limpiar estados
      setEditOpen(false);
      setEditId(null);
      setEditFile(null);
      setEditPreviewUrl(null);
      toast(`Has actualizado el link correctamente!`, {
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
      fetchLinks();
    } catch (err) {
      toast(`Error al conectar con el servidor`, {
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
    } finally {
      setSavingEdit(false);
    }
  };

  const handleBtnRemoveLink = async (id,description) => {
    setLinkId(id)
    setLinkDescription(description)
    setShowConfirmationDeleteLinkModal(true)
  };

  const ConfirmationDeleteLinkModal = () => {
      const [loading, setLoading] = useState(false);

      const removeLink = async () => {
        try {
          setLoading(true)
          const res = await fetch(`${API_URL}/api/links/${linkId}`, {
            method: "DELETE",
            headers: authHeaders(false),
          });
          if (!res.ok) {
            toast(`Error al eliminar link, intente nuevamente!`, {
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
          fetchLinks();
          setShowConfirmationDeleteLinkModal(false);
        } catch (err) {
          toast(`Error al conectar con el servidor`, {
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
        } finally {
          setLoading(false)
        }
      };

    return (
      <>

          <div className='confirmationDeleteModalContainer'>

              <div className='confirmationDeleteModalContainer__confirmationModal'>

                  <div className='confirmationDeleteModalContainer__confirmationModal__btnCloseModal'>
                      <div onClick={()=>setShowConfirmationDeleteLinkModal(false)} className='confirmationDeleteModalContainer__confirmationModal__btnCloseModal__btn'>X</div>
                  </div>
                  
                  <div className='confirmationDeleteModalContainer__confirmationModal__title'>
                      <div className='confirmationDeleteModalContainer__confirmationModal__title__prop'>¿Estás seguro que deseas eliminar el link con la siguiente descripción? <br />Descripción:  {linkDescription}</div>
                  </div>

                  <div className='confirmationDeleteModalContainer__confirmationModal__btnContainer'>
                      {loading ? (
                          <button
                          disabled
                          className='confirmationDeleteModalContainer__confirmationModal__btnContainer__btn'
                          >
                          <Spinner/>
                          </button>
                      ) : (
                          <button
                          onClick={removeLink}
                          className='confirmationDeleteModalContainer__confirmationModal__btnContainer__btn'
                          >
                          Si
                          </button>
                      )}
                      <button onClick={()=>setShowConfirmationDeleteLinkModal(false)} className='confirmationDeleteModalContainer__confirmationModal__btnContainer__btn'>No</button>
                  </div>

              </div>
      
          </div>
      </>
    )
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newLinks = Array.from(links);
    const [moved] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, moved);

    setLinks(newLinks);

    // Mandar nuevo orden al backend
    const orderedIds = newLinks.map((l) => l._id);
    const res = await fetch(`${API_URL}/api/links/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(false),
      },
      body: JSON.stringify({ orderedIds }),
    });
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
              className="linksManager__labelInput__input"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              //onChange={(e) => setFile(e.target.files[0])}
              /* onChange={(e) => {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);
                if (selectedFile) setFilePreviewUrl(URL.createObjectURL(selectedFile));
                else setFilePreviewUrl(null);
              }} */
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                setFile(selectedFile);
                if (selectedFile) {
                  setCreatePreviewUrl(URL.createObjectURL(selectedFile));
                } else {
                  setCreatePreviewUrl(null);
                }
              }}
              />

              {createPreviewUrl && (
                <div className="linksManager__preview">
                  <img
                    src={createPreviewUrl}
                    alt="preview"
                    className="linksManager__preview__img"
                  />
                </div>
              )}
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
            <p>Cargando links…</p>
          ) : links.length === 0 ? (
            <p>No hay links aún.</p>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="linksManager__linksList__ul"
                  >
                    {links.map((link, index) => (
                      <Draggable key={link._id} draggableId={link._id} index={index}>
                        {(provided) => (
                          <>
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="linksManager__linksList__ul__li"
                          >
                            <div className="linksManager__linksList__ul__li__imgLink">
                              {link.filePreviewUrl || link.img_link ? (
                                <img
                                  src={link.filePreviewUrl || link.img_link}
                                  alt="thumb"
                                  className="linksManager__linksList__ul__li__imgLink__prop"
                                />
                              ) : (
                                <div>sin imagen</div>
                              )}
                            </div>

                            <div className="linksManager__linksList__ul__li__description">
                              <p className="linksManager__linksList__ul__li__description__label">{link.descripcion_link || "(Sin descripción)"}</p>
                              <a className="linksManager__linksList__ul__li__description__link" href={link.url_destino} target="_blank" rel="noreferrer">
                                <div className="linksManager__linksList__ul__li__description__link__prop">
                                  {link.url_destino}
                                </div>
                              </a>
                            </div>

                            <div className="linksManager__linksList__ul__li__itemBtn">
                              <button className="linksManager__linksList__ul__li__itemBtn__prop" onClick={() => openEdit(link)}>Editar</button>
                              <button className="linksManager__linksList__ul__li__itemBtn__prop" onClick={() => handleBtnRemoveLink(link._id, link.descripcion_link)}>Eliminar</button>
                            </div>
                            <div className="linksManager__linksList__ul__li__clicks">Clics: {link.clicks || 0}</div>
                          </li>
                          </>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        <div className="linksManager__linksListMobile">
          {loading ? (
            <p>Cargando links…</p>
          ) : links.length === 0 ? (
            <p>No hay links aún.</p>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links">
                {(provided) => (
                  <ul
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="linksManager__linksListMobile__ul"
                  >
                    {links.map((link, index) => (
                      <Draggable key={link._id} draggableId={link._id} index={index}>
                        {(provided) => (
                          <>
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="linksManager__linksListMobile__ul__li"
                          >



                            <div className="linksManager__linksListMobile__ul__li__imgLink">
                              { link.img_link || link.filePreviewUrl ? (
                                <img
                                  src={link.filePreviewUrl || link.img_link}
                                  alt="thumb"
                                  className="linksManager__linksListMobile__ul__li__imgLink__prop"
                                />
                              ) : (
                                <div>sin imagen</div>
                              )}
                            </div>



                            <div className="linksManager__linksListMobile__ul__li__description">
                                <div className="linksManager__linksListMobile__ul__li__description__label">
                                    <div className="linksManager__linksListMobile__ul__li__description__label__prop">
                                        {link.descripcion_link || "(Sin descripción)"}
                                    </div>
                                </div>
                                <a className="linksManager__linksListMobile__ul__li__description__link" href={link.url_destino} target="_blank" rel="noreferrer">
                                    <div className="linksManager__linksListMobile__ul__li__description__link__prop">
                                    {link.url_destino}
                                    </div>
                                </a>
                            </div>



                            <div className="linksManager__linksListMobile__ul__li__itemBtn">
                              <button className="linksManager__linksListMobile__ul__li__itemBtn__prop" onClick={() => openEdit(link)}>Editar</button>
                              <button className="linksManager__linksListMobile__ul__li__itemBtn__prop" onClick={() => handleBtnRemoveLink(link._id, link.descripcion_link)}>Eliminar</button>
                            </div>



                            <div className="linksManager__linksListMobile__ul__li__clicks">
                              <div className="linksManager__linksListMobile__ul__li__clicks__prop">Clics: {link.clicks || 0}</div>
                            </div>




                          </li>
                          </>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

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
          <div className="editModalContainer__editModal__labelInputFileContainer">
            <div className="editModalContainer__editModal__labelInputFileContainer__label">
              Imagen actual
            </div>
            {editPreviewUrl ? (
              <div className="editModalContainer__editModal__labelInputFileContainer__img">
                <img
                  src={`${editPreviewUrl}`}
                  alt="preview"
                  className="editModalContainer__editModal__labelInputFileContainer__img__prop"
                  />
              </div>
            ) : (
              <p>Sin imagen</p>
            )}

          </div>

          <div className="editModalContainer__editModal__labelInputContainer" style={{paddingBottom:'4vh'}}>

            <div className="editModalContainer__editModal__labelInputContainer__label">
              Cambiar imagen
            </div>
            <input
              className="editModalContainer__editModal__labelInputContainer__input"
              type="file"
              accept="image/*"
              //onChange={(e) => setEditFile(e.target.files[0])}
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                setEditFile(selectedFile);
                if (selectedFile) setEditPreviewUrl(URL.createObjectURL(selectedFile));
                else setEditPreviewUrl(editForm.img_link || null);
              }}
            />
          </div>

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
        {
          showConfirmationDeleteLinkModal &&
          <ConfirmationDeleteLinkModal/>
        }
    </div>
  );
}
