import React, { useState, useEffect } from "react";

const overlayStyle = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "500px",
  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
  position: "relative",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "15px",
  fontSize: "18px",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  backgroundColor: "#4caf50",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const MensualidadEditor = ({ item, onGuardar, onCancelar }) => {
  const [form, setForm] = useState({
    nombre: "",
    monto: "",
    categoria: "",
    proximoPago: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        nombre: item.nombre || "",
        monto: item.monto || "",
        categoria: item.categoria || "",
        proximoPago: item.proximoPago
          ? new Date(item.proximoPago).toISOString().split("T")[0]
          : "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.nombre || !form.monto || !form.proximoPago) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const datosActualizados = {
      ...item.original,
      nombre: form.nombre,
      monto: parseFloat(form.monto),
      categoria: form.categoria,
      proximoPago: new Date(form.proximoPago),
    };

    onGuardar(item.id, datosActualizados);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <span style={closeButtonStyle} onClick={onCancelar}>✖</span>
        <h2>Editar {item.tipo}</h2>

        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Monto (€)</label>
        <input
          type="number"
          name="monto"
          value={form.monto}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Categoría</label>
        <input
          type="text"
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Próximo pago</label>
        <input
          type="date"
          name="proximoPago"
          value={form.proximoPago}
          onChange={handleChange}
          style={inputStyle}
        />

        <button onClick={handleSubmit} style={buttonStyle}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
};

export default MensualidadEditor;
