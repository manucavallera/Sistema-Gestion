"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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
  const [nuevoCliente, setNuevoCliente] = useState<Partial<Cliente>>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Función para obtener la lista de clientes
  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes');
      if (!response.ok) {
        throw new Error('Error al obtener clientes');
      }
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error(error);
      setError('Error al cargar los clientes');
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
      const response = await fetch('/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoCliente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el cliente');
      }

      const clienteCreado = await response.json();
      setClientes([...clientes, clienteCreado]); // Agregar el nuevo cliente a la lista
      setNuevoCliente({}); // Reiniciar el formulario
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
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al eliminar el cliente');
        }

        setClientes(clientes.filter(cliente => cliente.id !== id)); // Actualizar la lista de clientes
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <h1>Clientes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h2>Agregar Nuevo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Razón Social"
          value={nuevoCliente.razonSocial || ''}
          onChange={(e) => setNuevoCliente({ ...nuevoCliente, razonSocial: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Dirección"
          value={nuevoCliente.direccion || ''}
          onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="CUIT"
          value={nuevoCliente.cuit || ''}
          onChange={(e) => setNuevoCliente({ ...nuevoCliente, cuit: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Zona"
          value {nuevoCliente.zona || ''}
          onChange={(e) => setNuevoCliente({ ...nuevoCliente, zona: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={nuevoCliente.telefono || ''}
          onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={nuevoCliente.email || ''}
          onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
        />
        <input
          type="number"
          placeholder="Saldo"
          value={nuevoCliente.saldo || 0}
          onChange={(e) => setNuevoCliente({ ...nuevoCliente, saldo: parseFloat(e.target.value) })}
        />
        <button type="submit">Agregar Cliente</button>
      </form>

      <h2>Lista de Clientes</h2>
      <table>
        <thead>
          <tr>
            <th>Razón Social</th>
            <th>Dirección</th>
            <th>CUIT</th>
            <th>Zona</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Saldo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.razonSocial}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.cuit}</td>
              <td>{cliente.zona}</td>
              <td>{cliente.telefono || 'N/A'}</td>
              <td>{cliente.email || 'N/A'}</td>
              <td>{cliente.saldo}</td>
              <td>
                <button onClick={() => router.push(`/clientes/${cliente.id}`)}>Editar</button>
                <button onClick={() => eliminarCliente(cliente.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesPage;s