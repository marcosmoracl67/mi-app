import { useState, useRef } from "react";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import Container from "../../components/Container";
import FormButton from "../../components/FormButton";
import ProgressBar from "../../components/ProgressBar"; 

const DocumentUploader =  ({ proyectoId, tareaId, idNodo, onUpload }) => {
  const [archivo, setArchivo] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [notificacion, setNotificacion] = useState(null);
  const inputRef = useRef();
  const [uploadProgress, setUploadProgress] = useState(0);

  const mostrarNotificacion = (msg) => {
    setNotificacion(msg);
    setTimeout(() => setNotificacion(null), 3000);
  };

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const subirDocumento = async () => {
    if (!archivo) return;

    const formData = new FormData();
    formData.append("archivo", archivo);
    if (proyectoId) formData.append("proyecto_id", proyectoId);
    if (tareaId) formData.append("tarea_id", tareaId);
    if (idNodo) formData.append("idNodo", idNodo); // ✅ Nueva línea: sin romper compatibilidad
    formData.append("subido_por_id", 1); // reemplazar con ID real del usuario logueado

    try {
      setSubiendo(true);
      await axios.post("http://localhost:3000/api/documentos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
        withCredentials: true,
      });

      mostrarNotificacion("Documento subido correctamente ✅");
      setArchivo(null);
      if (inputRef.current) inputRef.current.value = "";
      if (onUpload) onUpload();
    } catch (error) {
      mostrarNotificacion("Error al subir documento ❌");
      console.error("Error al subir documento:", error.message);
    } finally {
      setTimeout(() => setUploadProgress(0), 500); // Para resetear suavemente
      setSubiendo(false);
    }
  };

  return (
    <Container
      background="var(--background2)"
      maxWidth="70rem"
      width="46rem"
      padding="0.4rem 2rem"
      animated
    >
      <div className="form-row upload-row">
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          disabled={subiendo}
        />
        <FormButton
          label={subiendo ? "Subiendo..." : "Subir Documento"}
          className="form-button small fit-content confirm"
          style={{ maxWidth: "fit-content" }}
          icon={<FaCloudUploadAlt />}
          size="small"
          onClick={subirDocumento}
          disabled={!archivo || subiendo}
        />
      </div>

      {subiendo && <span className="ml-1">{uploadProgress}%</span>}
    </Container>
  );
};

export default DocumentUploader;