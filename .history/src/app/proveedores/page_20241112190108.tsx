// app/proveedores/page.tsx (o pages/proveedores.tsx)
"use client";
import { useEffect, useState } from "react";

interface Proveedor {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono: string;
  email: string;
  saldo: number;
}

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nuevoProveedor, setNuevoProveedor] = useState<Proveedor>({
    id: 0, // Solo se usa para editar
    razonSocial: "",
    direccion: "",
    cuit: "",
    zona: "",
    telefono: "",
    email: "",
    saldo: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProveedores = async () => {
      const response = await fetch("/api/proveedores");
      const data = await response.json();
      setProveedores(data);
    };

    fetchProveedores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoProveedor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/proveedores/${nuevoProveedor.id}`
      : "/api/proveedores";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoProveedor),
    });

    if (response.ok) {
      const proveedorCreado = await response.json();
      if (isEditing) {
        setProveedores((prev) =>
          prev.map((prov) =>
            prov.id === proveedorCreado.id ? proveedorCreado : prov
          )
        );
      } else {
        setProveedores((prev) => [...prev, proveedorCreado]);
      }
      resetForm();
    } else {
      console.error("Error al guardar el proveedor");
    }
  };

  const resetForm = () => {
    setNuevoProveedor({
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

  const handleEdit = (proveedor: Proveedor) => {
    setNuevoProveedor(proveedor);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/proveedores/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProveedores((prev) => prev.filter((prov) => prov.id !== id));
    } else {
      console.error("Error al eliminar el proveedor");
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Proveedores</h1>
      <form
        onSubmit={handleSubmit}
        className='mb-6 bg-white shadow-md rounded px-8 pt-6 pb-8'
      >
        <h2 className='text-xl font-semibold mb-4'>
          {isEditing ? "Editar Proveedor" : "Agregar Nuevo Proveedor"}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='text'
            name='razonSocial'
            placeholder='Razón Social'
            value={nuevoProveedor.razonSocial}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <input
            type='text'
            name='direccion'
            placeholder='Dirección'
            value={nuevoProveedor.direccion}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <input
            type='text'
            name='cuit'
            placeholder='CUIT'
            value={nuevoProveedor.cuit}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <input
            type='text'
            name='zona'
            placeholder='Zona'
            value={nuevoProveedor.zona}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2'
          />
          <input
            type='text'
            name='telefono'
            placeholder='Teléfono'
            value={nuevoProveedor.telefono}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2'
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={nuevoProveedor.email}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2'
          />
          <input
            type='number'
            name='saldo'
            placeholder='Saldo'
            value={nuevoProveedor.saldo}
            onChange={handleChange}
            className='border border-gray-300 rounded p-2'
          />
        </div>
        <button
          type='submit'
          className='mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300'
        >
          {isEditing ? "Actualizar Proveedor" : "Agregar Proveedor"}
        </button>
      </form>

      <h2 className='text-2xl font-semibold mb-4'>Lista de Proveedores</h2>
      <ul className='bg-white shadow-md rounded-lg p-4'>
        {proveedores.map((proveedor) => (
          <li
            key={proveedor.id}
            className='border-b border-gray-200 py-2 flex justify-between items-center'
          >
            <div>
              <span className='font-semibold'>{proveedor.razonSocial}</span> -{" "}
              {proveedor.direccion} - {proveedor.cuit} - {proveedor.zona} -{" "}
              {proveedor.telefono} - {proveedor.email} - Saldo: $
              {proveedor.saldo}
            </div>
            <div>
              <button
                onClick={() => handleEdit(proveedor)}
                className='text-blue-500 hover:underline mr-2'
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(proveedor.id)}
                className='text-red-500 hover:underline'
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

export default ProveedoresPage;
