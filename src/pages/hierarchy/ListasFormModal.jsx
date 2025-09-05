import Modal from "../../components/Modal";
import FormInput from "../../components/FormInput";
import FormButton from "../../components/FormButton";
import FormSelect from "../../components/FormSelect";
import ToggleSwitch from "../../components/ToggleSwitch";

export default function ListasFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  datosLista,
  onChange,
  modo
}) {
  const handleChange = (field, value) => {
    onChange({
      ...datosLista,
      [field]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(datosLista);
  };

  const titulo = modo === "crear" ? "Crear Nueva Lista" : "Editar Lista";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={titulo}>
      <form onSubmit={handleSubmit} className="form-modal">
        <FormInput
          label="Descripción"
          value={datosLista.descripcion || ""}
          onChange={(e) => handleChange("descripcion", e.target.value)}
          required
        />

        <FormInput
          label="Orden"
          type="number"
          value={datosLista.orden ?? ""}
          onChange={(e) => handleChange("orden", parseInt(e.target.value, 10))}
        />

        <FormSelect
          label="Detalle Nodo"
          value={datosLista.detallenodo_id || ""}
          onChange={(e) => handleChange("detallenodo_id", parseInt(e.target.value, 10))}
          options={[
            { value: "", label: "-- Seleccione Detalle --" },
            // Lista dummy; puedes inyectar opciones reales desde props
            { value: 1, label: "Detalle A" },
            { value: 2, label: "Detalle B" },
          ]}
        />

        <ToggleSwitch
          label="Activo"
          checked={!!datosLista.activo}
          onChange={(value) => handleChange("activo", value)}
        />

        <div className="form-buttons">
          <FormButton type="submit" text="Guardar" isLoading={isLoading} />
          <FormButton type="button" text="Cancelar" onClick={onClose} variant="subtle" />
        </div>
      </form>
    </Modal>
  );
}
