"use client"; // Asegúrate de que este es el primer código en el archivo

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Cliente {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string;
  email?: string;
  saldo: number;
  debe: number;
  haber: number;
}

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteActual, setClienteActual] = useState<Partial<Cliente> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Estado de carga

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true); // Inicia la carga
      try {
        const response = await fetch("/api/clientes");
        if (!response.ok) throw new Error("Error al obtener clientes");
        setClientes(await response.json());
      } catch (error) {
        console.error(error);
        setError("Error al cargar los clientes");
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const method = clienteActual?.id ? "PUT" : "POST";
    const url = clienteActual?.id
      ? `/api/clientes/${clienteActual.id}`
      : "/api/clientes";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteActual),
      });

      if (!response.ok)
        throw new Error(
          await response
            .json()
            .then((data) => data.error || "Error al guardar el cliente")
        );

      const clienteGuardado = await response.json();
      setClientes((prev) =>
        method === "POST"
          ? [...prev, clienteGuardado]
          : prev.map((cliente) =>
              cliente.id === clienteGuardado.id ? clienteGuardado : cliente
            )
      );
      setClienteActual(null);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const eliminarCliente = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        const response = await fetch(`/api/clientes/${id}`, {
          method: "DELETE",
        });
        if (!response.ok)
          throw new Error(
            await response
              .json()
              .then((data) => data.error || "Error al eliminar el cliente")
          );
        setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    }
  };

  const editarCliente = (cliente: Cliente) => setClienteActual(cliente);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Clientes</h1>
      {error && <p className='text-red-500'>{error}</p>}
      {loading && <p>Cargando clientes...</p>} {/* Indicador de carga */}
      <h2 className='text-xl font-semibold mb-2'>
        {clienteActual ? "Editar Cliente" : "Agregar Nuevo Cliente"}
      </h2>
      <form onSubmit={handleSubmit} className='mb-4 grid grid-cols-2 gap-4'>
        {[
          "razonSocial",
          "direccion",
          "cuit",
          "zona",
          "telefono",
          "email",
          "saldo",
          "debe",
          "haber",
        ].map((field, index) => (
          <input
            key={index}
            type={
              field === "saldo" || field === "debe" || field === "haber"
                ? "number"
                : field === "email"
                ? "email"
                : "text"
            }
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={clienteActual?.[field as keyof Cliente] || ""}
            onChange={(e) =>
              setClienteActual({
                ...clienteActual,
                [field]:
                  field === "saldo" || field === "debe" || field === "haber"
                    ? Number(e.target.value)
                    : e.target.value,
              })
            }
            required={field !== "telefono" && field !== "email"}
            className='border p-2 mb-2 w-full'
          />
        ))}
        <button type='submit' className='bg-blue-500 text-white p-2 col-span-2'>
          {clienteActual ? "Actualizar Cliente" : "Agregar Cliente"}
        </button>
      </form>
      <h2 className='text-xl font-semibold mb-2'>Lista de Clientes</h2>
      <form className='grid grid-cols-1 gap-4'>
        <ul className='border-t'>
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              className='flex justify-between items-center mb-2 border-b py-2'
            >
              <div className='flex-1'>
                <strong>{cliente.razonSocial}</strong> - {cliente.cuit} -{" "}
                {cliente.zona} - Teléfono: {cliente.telefono} - Saldo: $
                {cliente.saldo} - Debe: ${cliente.debe} - Haber: $
                {cliente.haber}
              </div>
              <div>
                <button
                  onClick={() => editarCliente(cliente)}
                  className='bg-yellow-500 text-white p-1 mr-2'
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCliente(cliente.id)}
                  className='bg-red-500 text-white p-1'
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default ClientesPage;
