"use client";
import { useEffect, useState } from "react";

interface Cliente {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono: string;
  email: string;
  saldo: number;
}

const ClientesPage = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nuevoCliente, setNuevoCliente] = useState<Cliente>({
    id: 0,
    razonSocial: "",
    direccion: "",
    cuit: "",
    zona: "",
    telefono: "",
    email: "",
    saldo: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/clientes");
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoCliente((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/clientes/${nuevoCliente.id}`
      : "/api/clientes";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoCliente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }

      const clienteCreado = await response.json();
      if (isEditing) {
        setClientes((prev) =>
          prev.map((cli) => (cli.id === clienteCreado.id ? clienteCreado : cli))
        );
      } else {
        setClientes((prev) => [...prev, clienteCreado]);
      }
      resetForm();
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
      setErrorMessage(error.message);
    }
  };

  const resetForm = () => {
    setNuevoCliente({
      id: 0,
      razonSocial: "",
      direccion: "",
      cuit: "",
      zona: "",
      telefono: "",
      email: "",
      saldo: 0,
    });
    setIsEditing(false);
  };

  const handleEdit = (cliente: Cliente) => {
    setNuevoCliente(cliente);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/clientes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el cliente");
      }

      setClientes((prev) => prev.filter((cli) => cli.id !== id));
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
      alert(error.message);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Clientes</h1>
      <form
        onSubmit={handleSubmit}
        className='mb-6 bg-white shadow-md rounded px-8 pt-6 pb-8'
      >
        <h2 className='text-xl font-semibold mb-4'>
          {isEditing ? "Editar Cliente" : "Agregar Nuevo Cliente"}
        </h2>
        {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <label htmlFor='razonSocial' className='block mb-1'>
            Razón Social
          </label>
          <input
            id='razonSocial'
            type='text'
            name='raz onSocial'
            placeholder='Razón Social'
            value={nuevoCliente.razonSocial}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <label htmlFor='direccion' className='block mb-1'>
            Dirección
          </label>
          <input
            id='direccion'
            type='text'
            name='direccion'
            placeholder='Dirección'
            value={nuevoCliente.direccion}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <label htmlFor='cuit' className='block mb-1'>
            CUIT
          </label>
          <input
            id='cuit'
            type='text'
            name='cuit'
            placeholder='CUIT'
            value={nuevoCliente.cuit}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <label htmlFor='zona' className='block mb-1'>
            Zona
          </label>
          <input
            id='zona'
            type='text'
            name='zona'
            placeholder='Zona'
            value={nuevoCliente.zona}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2'
          />
          <label htmlFor='telefono' className='block mb-1'>
            Teléfono
          </label>
          <input
            id='telefono'
            type='text'
            name='telefono'
            placeholder='Teléfono'
            value={nuevoCliente.telefono}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2'
          />
          <label htmlFor='email' className='block mb-1'>
            Email
          </label>
          <input
            id='email'
            type='email'
            name='email'
            placeholder='Email'
            value={nuevoCliente.email}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2'
          />
          <label htmlFor='saldo' className='block mb-1'>
            Saldo
          </label>
          <input
            id='saldo'
            type='number'
            name='saldo'
            placeholder='Saldo'
            value={nuevoCliente.saldo}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2'
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className={`mt-4 ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300`}
        >
          {loading
            ? "Guardando..."
            : isEditing
            ? "Actualizar Cliente"
            : "Agregar Cliente"}
        </button>
      </form>

      <h2 className='text-2xl font-semibold mb-4'>Lista de Clientes</h2>
      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <ul className='bg-white shadow-md rounded-lg p-4'>
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              className='border-b border-gray-200 py-2 flex justify-between items-center'
            >
              <div>
                <span className='font-semibold'>{cliente.razonSocial}</span> -{" "}
                {cliente.direccion} - {cliente.cuit} - {cliente.zona} -{" "}
                {cliente.telefono} - {cliente.email} - Saldo: ${cliente.saldo}
              </div>
              <div>
                <button
                  onClick={() => handleEdit(cliente)}
                  className='text-blue-500 hover:underline mr-2'
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cliente.id)}
                  className='text-red-500 hover:underline'
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClientesPage;
