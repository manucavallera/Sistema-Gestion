"use client"; // Asegúrate de que este es el primer código en el archivo

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Cliente {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string; // El teléfono es opcional
  email?: string; // El email también es opcional
  saldo: number;
}

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteActual, setClienteActual] = useState<Partial<Cliente> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchClientes = async () => {
    try {
      const response = await fetch("/api/clientes");
      if (!response.ok) {
        throw new Error("Error al obtener clientes");
      }
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
      setError("Error al cargar los clientes");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const method = clienteActual?.id ? "PUT" : "POST";
      const url = clienteActual?.id
        ? `/api/clientes/${clienteActual.id}`
        : "/api/clientes";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteActual),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar el cliente");
      }

      const clienteGuardado = await response.json();

      // Asegúrate de que clienteGuardado contenga todos los campos necesarios
      if (method === "POST") {
        setClientes([...clientes, clienteGuardado]); // Agregar el nuevo cliente a la lista
      } else {
        setClientes(
          clientes.map((cliente) =>
            cliente.id === clienteGuardado.id ? clienteGuardado : cliente
          )
        );
      }

      setClienteActual(null); // Reiniciar el formulario
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

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al eliminar el cliente");
        }

        setClientes(clientes.filter((cliente) => cliente.id !== id)); // Actualizar la lista de clientes
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    }
  };

  const editarCliente = (cliente: Cliente) => {
    setClienteActual(cliente);
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Clientes</h1>
      {error && <p className='text-red-500'>{error}</p>}

      <h2 className='text-xl font-semibold mb-2'>
        {clienteActual ? "Editar Cliente" : "Agregar Nuevo Cliente"}
      </h2>
      <form onSubmit={handleSubmit} className='mb-4'>
        <input
          type='text'
          placeholder='Razón Social'
          value={clienteActual?.razonSocial || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, razonSocial: e.target.value })
          }
          required
          className='border p-2 mb-2 w-full'
        />
        <input
          type='text'
          placeholder='Dirección'
          value={clienteActual?.direccion || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, direccion: e.target.value })
          }
          required
          className='border p-2 mb-2 w-full'
        />
        <input
          type='text'
          placeholder='CUIT'
          value={clienteActual?.cuit || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, cuit: e.target.value })
          }
          required
          className='border p-2 mb-2 w-full'
        />
        <input
          type='text'
          placeholder='Zona'
          value={clienteActual?.zona || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, zona: e.target.value })
          }
          required
          className='border p-2 mb-2 w-full'
        />
        <input
          type='text'
          placeholder='Teléfono'
          value={clienteActual?.telefono || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, telefono: e.target.value })
          }
          className='border p-2 mb-2 w-full'
        />
        <input
          type='email'
          placeholder='Email'
          value={clienteActual?.email || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, email: e.target.value })
          }
          className='border p-2 mb-2 w-full'
        />
        <input
          type='number'
          placeholder='Saldo'
          value={clienteActual?.saldo || ""}
          onChange={(e) =>
            setClienteActual({
              ...clienteActual,
              saldo: Number(e.target.value),
            })
          }
          required
          className='border p-2 mb-2 w-full'
        />
        <button type='submit' className='bg-blue-500 text-white p-2'>
          {clienteActual ? "Actualizar Cliente" : "Agregar Cliente"}
        </button>
      </form>

      <h2 className='text-xl font-semibold mb-2'>Lista de Clientes</h2>
      <ul>
        {clientes.map((cliente) => (
          <li
            key={cliente.id}
            className='flex justify-between items-center mb-2'
          >
            <div>
              <strong>{cliente.razonSocial}</strong> - {cliente.cuit} -{" "}
              {cliente.zona} - Teléfono: {cliente.telefono} - Saldo: $
              {cliente.saldo}
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
    </div>
  );
};

export default ClientesPage;
