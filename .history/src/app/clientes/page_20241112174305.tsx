"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Cliente {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string;
  email?: string;
  saldo: number;
}

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteActual, setClienteActual] = useState<Partial<Cliente> | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Función para obtener la lista de clientes
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

  // Efecto para cargar los clientes al montar el componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Función para manejar el envío del formulario
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
      if (method === "POST") {
        setClientes([...clientes, clienteGuardado]); // Agregar el nuevo cliente a la lista
      } else {
        // Actualizar el cliente existente en la lista
        setClientes(
          clientes.map((cliente) =>
            cliente.id === clienteGuardado.id ? clienteGuardado : cliente
          )
        );
      }

      setClienteActual(null); // Reiniciar el formulario
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // Función para eliminar un cliente
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
        setError(error.message);
      }
    }
  };

  // Función para editar un cliente
  const editarCliente = (cliente: Cliente) => {
    setClienteActual(cliente);
  };

  return (
    <div>
      <h1>Clientes</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>{clienteActual ? "Editar Cliente" : "Agregar Nuevo Cliente"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Razón Social'
          value={clienteActual?.razonSocial || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, razonSocial: e.target.value })
          }
          required
        />
        <input
          type='text'
          placeholder='Dirección'
          value={clienteActual?.direccion || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, direccion: e.target.value })
          }
          required
        />
        <input
          type='text'
          placeholder='CUIT'
          value={clienteActual?.cuit || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, cuit: e.target.value })
          }
          required
        />
        <input
          type='text'
          placeholder='Zona'
          value={clienteActual?.zona || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, zona: e.target.value })
          }
          required
        />
        <input
          type='text'
          placeholder='Teléfono'
          value={clienteActual?.telefono || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, telefono: e.target.value })
          }
        />
        <input
          type='email'
          placeholder='Email'
          value={clienteActual?.email || ""}
          onChange={(e) =>
            setClienteActual({ ...clienteActual, email: e.target.value })
          }
        />
        <input
          type='number'
          placeholder='Saldo'
          value={clienteActual?.saldo || 0}
          onChange={(e) =>
            setClienteActual({
              ...clienteActual,
              saldo: Number(e.target.value),
            })
          }
          required
        />
        <button type='submit'>
          {clienteActual ? "Actualizar Cliente" : "Agregar Cliente"}
        </button>
      </form>

      <h2>Lista de Clientes</h2>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.razonSocial} - {cliente.direccion}
            <button onClick={() => editarCliente(cliente)}>Editar</button>
            <button onClick={() => eliminarCliente(cliente.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientesPage;
