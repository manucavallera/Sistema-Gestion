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
    <div className='max-w-md mx-auto p-4 bg-white rounded-lg shadow-md'>
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
            Cliente Razón Social:
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
            Proveedor Razón Social:
          </label>
          <input
            type='text'
            value={proveedorRazonSocial}
            onChange={(e) => setProveedorRazonSocial(e.target.value)}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          />
        </div>
        <button
          type='submit'
          className='w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200'
        >
          Agregar Cheque
        </button>
      </form>
      {error && <p className='mt-4 text-red-600'>{error}</p>}
      {success && <p className='mt-4 text-green-600'>{success}</p>}
    </div>
  );
};

export default AgregarCheque;
