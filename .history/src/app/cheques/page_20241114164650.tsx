"use client";
import { useState, useEffect } from "react";

interface Cliente {
  id: number;
  razonSocial: string;
  saldo: number; // Agrega otros campos que necesites
}

interface Proveedor {
  id: number;
  razonSocial: string;
  saldo: number; // Agrega otros campos que necesites
}
const AgregarCheque = () => {
  const [fecha, setFecha] = useState("");
  const [monto, setMonto] = useState(0);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [proveedorId, setProveedorId] = useState<number | null>(null);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Cargar clientes y proveedores al cargar el componente
    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    };

    const fetchProveedores = async () => {
      const response = await fetch("/api/proveedores");
      const data = await response.json();
      setProveedores(data);
    };

    fetchClientes();
    fetchProveedores();
  }, []);

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
      // Limpiar campos después de agregar el cheque
      setFecha("");
      setMonto(0);
      setClienteId(null);
      setProveedorId(null);
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
            Cliente:
          </label>
          <select
            value={clienteId || ""}
            onChange={(e) => setClienteId(Number(e.target.value))}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          >
            <option value='' disabled>
              Selecciona un cliente
            </option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Proveedor:
          </label>
          <select
            value={proveedorId || ""}
            onChange={(e) => setProveedorId(Number(e.target.value))}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          >
            <option value='' disabled>
              Selecciona un proveedor
            </option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.razonSocial}
              </option>
            ))}
          </select>
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
