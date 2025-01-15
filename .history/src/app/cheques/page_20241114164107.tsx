"use client";
import { useState, useEffect } from "react";

const AgregarCheque = () => {
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState(0);
  const [clienteRazonSocial, setClienteRazonSocial] = useState("");
  const [proveedorRazonSocial, setProveedorRazonSocial] = useState("");
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [proveedorId, setProveedorId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (clienteRazonSocial) {
      buscarCliente();
    }
  }, [clienteRazonSocial]);

  useEffect(() => {
    if (proveedorRazonSocial) {
      buscarProveedor();
    }
  }, [proveedorRazonSocial]);

  const buscarCliente = async () => {
    try {
      const response = await fetch(
        `/api/clientes?razonSocial=${encodeURIComponent(clienteRazonSocial)}`
      );
      if (!response.ok) {
        throw new Error("Cliente no encontrado");
      }
      const data = await response.json();
      setClienteId(data.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const buscarProveedor = async () => {
    try {
      const response = await fetch(
        `/api/proveedores?razonSocial=${encodeURIComponent(
          proveedorRazonSocial
        )}`
      );
      if (!response.ok) {
        throw new Error("Proveedor no encontrado");
      }
      const data = await response.json();
      setProveedorId(data.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Verifica que ambos IDs estén disponibles
    if (clienteId === null || proveedorId === null) {
      setError("Por favor, asegúrese de que el cliente y proveedor existan.");
      return;
    }

    try {
      const response = await fetch("/api/cheques", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fecha, monto, clienteId, proveedorId }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el cheque");
      }
      setSuccess("Cheque creado exitosamente");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='date'
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />
      <input
        type='number'
        value={monto}
        onChange={(e) => setMonto(Number(e.target.value))}
        required
      />
      <input
        type='text'
        value={clienteRazonSocial}
        onChange={(e) => setClienteRazonSocial(e.target.value)}
        placeholder='Razón Social Cliente'
        required
      />
      <input
        type='text'
        value={proveedorRazonSocial}
        onChange={(e) => setProveedorRazonSocial(e.target.value)}
        placeholder='Razón Social Proveedor'
        required
      />
      <button type='submit'>Agregar Cheque</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </form>
  );
};

export default AgregarCheque;
