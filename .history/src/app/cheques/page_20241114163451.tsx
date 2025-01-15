import { useState } from "react";

const AgregarCheque = () => {
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState(0);
  const [clienteId, setClienteId] = useState(0);
  const [proveedorId, setProveedorId] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/cheques", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fecha, monto, clienteId, proveedorId }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess("Cheque creado exitosamente!");
      console.log("Cheque creado:", data);
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Agregar Cheque</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha:</label>
          <input
            type='date'
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Monto:</label>
          <input
            type='number'
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Cliente ID:</label>
          <input
            type='number'
            value={clienteId}
            onChange={(e) => setClienteId(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Proveedor ID:</label>
          <input
            type='number'
            value={proveedorId}
            onChange={(e) => setProveedorId(Number(e.target.value))}
            required
          />
        </div>
        <button type='submit'>Agregar Cheque</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default AgregarCheque;
