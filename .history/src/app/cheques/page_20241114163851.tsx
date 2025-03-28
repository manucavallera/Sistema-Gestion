"use client";
import { useState } from "react";

const AgregarCheque = () => {
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState(0);
  const [clienteRazonSocial, setClienteRazonSocial] = useState("");
  const [proveedorRazonSocial, setProveedorRazonSocial] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/cheques", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha,
          monto,
          clienteRazonSocial,
          proveedorRazonSocial,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess("Cheque creado exitosamente!");
      console.log("Cheque creado:", data);
    } catch (error) {
      setError(
        `Error: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
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
          <label>Cliente Razón Social:</label>
          <input
            type='text'
            value={clienteRazonSocial}
            onChange={(e) => setClienteRazonSocial(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Proveedor Razón Social:</label>
          <input
            type='text'
            value={proveedorRazonSocial}
            onChange={(e) => setProveedorRazonSocial(e.target.value)}
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
