"use client";
import { useEffect, useState } from "react";

interface Proveedor {
  id: number;
  razonSocial: string;
}

interface Compra {
  id: number;
  fecha: string; // Mantener como string para manejar el formato ISO
  total: number;
  proveedorId: number;
  proveedor: Proveedor | null; // Proveedor puede ser nulo
}

const ComprasPage = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState<Compra>({
    id: 0,
    fecha: new Date().toISOString().split("T")[0], // Inicializa con la fecha actual en formato YYYY-MM-DD
    total: 0,
    proveedorId: 0,
    proveedor: null, // Inicializa como nulo
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCompras = async () => {
      const response = await fetch("/api/compras");
      const data = await response.json();
      setCompras(data);
    };

    const fetchProveedores = async () => {
      const response = await fetch("/api/proveedores");
      const data = await response.json();
      setProveedores(data);
    };

    fetchCompras();
    fetchProveedores();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Manejo de cambios en el formulario
    if (name === "proveedorId") {
      const selectedProveedor = proveedores.find(
        (prov) => prov.id === Number(value)
      );
      setNuevaCompra((prev) => ({
        ...prev,
        proveedorId: Number(value),
        proveedor: selectedProveedor || null, // Manejo de caso donde no se encuentra el proveedor
      }));
    } else {
      setNuevaCompra((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/compras/${nuevaCompra.id}` : "/api/compras";

    // Verifica que el proveedor no sea nulo y que tenga razón social
    if (!nuevaCompra.proveedor || !nuevaCompra.proveedor.razonSocial) {
      alert("Por favor, selecciona un proveedor válido.");
      return;
    }

    // Asegúrate de que la fecha esté en formato ISO
    const compraData = {
      fecha: new Date(nuevaCompra.fecha + "T00:00:00Z").toISOString(), // Asegúrate de enviar en formato ISO
      total: nuevaCompra.total,
      razonSocial: nuevaCompra.proveedor.razonSocial, // Envía la razón social
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compraData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message || "Error desconocido"}`);
      }

      const compraCreada = await response.json();
      if (isEditing) {
        setCompras((prev) =>
          prev.map((compra) =>
            compra.id === compraCreada.id ? compraCreada : compra
          )
        );
      } else {
        setCompras((prev) => [...prev, compraCreada]);
      }
      resetForm();
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      alert(error.message); // Muestra el mensaje de error al usuario
    }
  };

  const resetForm = () => {
    setNuevaCompra({
      id: 0,
      fecha: new Date().toISOString().split("T")[0], // Reinicia la fecha a la actual
      total: 0,
      proveedorId: 0,
      proveedor: null, // Reinicia el proveedor
    });
    setIsEditing(false);
  };

  const handleEdit = (compra: Compra) => {
    setNuevaCompra(compra);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/compras/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setCompras((prev) => prev.filter((compra) => compra.id !== id));
    } else {
      console.error("Error al eliminar la compra");
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Compras</h1>
      <form
        onSubmit={handleSubmit}
        className='mb-6 bg-white shadow-md rounded px-8 pt-6 pb-8'
      >
        <h2 className='text-xl font-semibold mb-4'>
          {isEditing ? "Editar Compra" : "Agregar Nueva Compra"}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='date'
            name='fecha'
            value={nuevaCompra.fecha}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <input
            type='number'
            name='total'
            placeholder='Total'
            value={nuevaCompra.total}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <select
            name='proveedorId'
            value={nuevaCompra.proveedor?.id || ""}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          >
            <option value='' disabled>
              Seleccionar proveedor
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
          className='mt-4 bg-blue-500 text-white rounded p-2'
        >
          {isEditing ? "Actualizar Compra" : "Agregar Compra"}
        </button>
      </form>
      <table className='min-w-full bg-white border border-gray-300'>
        <thead>
          <tr>
            <th className='border border-gray-300 p-2'>Fecha</th>
            <th className='border border-gray-300 p-2'>Total</th>
            <th className='border border-gray-300 p-2'>Proveedor</th>
            <th className='border border-gray-300 p-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id}>
              <td className='border border-gray-300 p-2'>
                {new Date(compra.fecha).toLocaleDateString("es-ES")}
              </td>
              <td className='border border-gray-300 p-2'>{compra.total}</td>
              <td className='border border-gray-300 p-2'>
                {compra.proveedor
                  ? compra.proveedor.razonSocial
                  : "Proveedor no disponible"}
              </td>
              <td className='border border-gray-300 p-2'>
                <button
                  onClick={() => handleEdit(compra)}
                  className='text-blue-500'
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(compra.id)}
                  className='text-red-500 ml-2'
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComprasPage;
