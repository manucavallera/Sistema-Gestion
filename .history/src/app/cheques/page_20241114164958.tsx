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
  const [entidadTipo, setEntidadTipo] = useState<"cliente" | "proveedor">(
    "cliente"
  ); // Tipo de entidad
  const [entidadId, setEntidadId] = useState<number | null>(null); // ID de cliente o proveedor
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Cargar clientes y proveedores al cargar el componente
    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data: Cliente[] = await response.json();
      setClientes(data);
    };

    const fetchProveedores = async () => {
      const response = await fetch("/api/proveedores");
      const data: Proveedor[] = await response.json();
      setProveedores(data);
    };

    fetchClientes();
    fetchProveedores();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Verifica que el ID de la entidad esté disponible
    if (entidadId === null) {
      setError("Por favor, asegúrese de que la entidad seleccionada exista.");
      return;
    }

    try {
      const response = await fetch("/api/cheques", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fecha, monto, entidadId, entidadTipo }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el cheque");
      }
      setSuccess("Cheque creado exitosamente");
      // Limpiar campos después de agregar el cheque
      setFecha("");
      setMonto(0);
      setEntidadId(null);
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
            Tipo de Entidad:
          </label>
          <select
            value={entidadTipo}
            onChange={(e) => {
              setEntidadTipo(e.target.value as "cliente" | "proveedor");
              setEntidadId(null); // Reiniciar el ID cuando cambie el tipo
            }}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          >
            <option value='cliente'>Cliente</option>
            <option value='proveedor'>Proveedor</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            {entidadTipo === "cliente" ? "Cliente:" : "Proveedor:"}
          </label>
          <select
            value={entidadId || ""}
            onChange={(e) => setEntidadId(Number(e.target.value))}
            required
            className='mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-500'
          >
            <option value='' disabled>
              Selecciona un {entidadTipo}
            </option>
            {(entidadTipo === "cliente" ? clientes : proveedores).map(
              (entidad) => (
                <option key={entidad.id} value={entidad.id}>
                  {entidad.razonSocial}
                </option>
              )
            )}
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
