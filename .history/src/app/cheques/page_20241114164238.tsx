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
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold text-center mb-4'>Agregar Cheque</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Fecha:
          </label>
          <input
            type='date'
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Monto:
          </label>
          <input
            type='number'
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Razón Social Cliente:
          </label>
          <input
            type='text'
            value={clienteRazonSocial}
            onChange={(e) => setClienteRazonSocial(e.target.value)}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Razón Social Proveedor:
          </label>
          <input
            type='text'
            value={proveedorRazonSocial}
            onChange={(e) => setProveedorRazonSocial(e.target.value)} // Corregido aquí
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200'
        >
          Agregar Cheque
        </button>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        {success && <p className='text-green-500 text-sm'>{success}</p>}
      </form>
    </div>
  );
};

export default AgregarCheque;
