"use client";
import { useEffect, useState } from "react";

// Definir el tipo para Proveedor
type Proveedor = {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
};

// Definir el tipo para Compra
type Compra = {
  id: number;
  proveedorId: number;
  total: number;
};

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [formData, setFormData] = useState({
    total: "",
    proveedorId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompra, setEditingCompra] = useState<Compra | null>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        total: Number(formData.total),
        proveedorId: Number(formData.proveedorId),
      };

      if (isEditing && editingCompra) {
        // Actualizar compra
        const response = await fetch(`/api/compras/${editingCompra.id}`, {
          method: "PUT",
          body: JSON.stringify(updatedData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const updatedCompra = await response.json();
          setCompras((prevCompras) =>
            prevCompras.map((compra) =>
              compra.id === updatedCompra.id ? updatedCompra : compra
            )
          );
        } else {
          const errorData = await response.json();
          console.error("Error al actualizar la compra:", errorData);
        }
      } else {
        // Crear nueva compra
        const response = await fetch("/api/compras", {
          method: "POST",
          body: JSON.stringify(updatedData),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const newCompra = await response.json();
          setCompras((prevCompras) => [...prevCompras, newCompra]);
        } else {
          console.error("Error al agregar la compra");
        }
      }

      // Reiniciar formulario
      setFormData({ total: "", proveedorId: "" });
      setIsEditing(false);
      setEditingCompra(null);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
    }
  };

  const handleEdit = (compra: Compra) => {
    setIsEditing(true);
    setEditingCompra(compra);
    setFormData({
      total: compra.total.toString(),
      proveedorId: compra.proveedorId.toString(),
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta compra?")) {
      try {
        const response = await fetch(`/api/compras/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setCompras((prevCompras) =>
            prevCompras.filter((compra) => compra.id !== id)
          );
        } else {
          console.error("Error al eliminar la compra");
        }
      } catch (error) {
        console.error("Error al eliminar la compra:", error);
      }
    }
  };

  // Nueva función para archivar datos
  const handleArchive = async () => {
    try {
      const response = await fetch("/api/archive", {
        method: "POST",
      });

      if (response.ok) {
        alert("Datos archivados con éxito.");
      } else {
        console.error("Error al archivar datos");
      }
    } catch (error) {
      console.error("Error al archivar datos:", error);
    }
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Compras</h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 max-w-md mb-6'
      >
        <div>
          <label htmlFor='proveedorId' className='block text-lg font-medium'>
            Proveedor:
          </label>
          <select
            id='proveedorId'
            name='proveedorId'
            value={formData.proveedorId}
            onChange={handleInputChange}
            required
            className='w-full mt-2 p-2 border rounded-lg'
          >
            <option value=''>Seleccionar Proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.razonSocial}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor='total' className='block text-lg font-medium'>
            Total:
          </label>
          <input
            type='number'
            id='total'
            name='total'
            value={formData.total}
            onChange={handleInputChange}
            placeholder='Total'
            required
            className='w-full mt-2 p-2 border rounded-lg'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600'
        >
          {isEditing ? "Actualizar Compra" : "Agregar Compra"}
        </button>
      </form>

      <button
        onClick={handleArchive}
        className='bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 mb-6'
      >
        Archivar Compras Antiguas
      </button>

      <h2 className='text-xl font-semibold mb-4'>Lista de Compras</h2>
      <ul className='space-y-4'>
        {compras.map((compra) => {
          const proveedor = proveedores.find(
            (p) => p.id === compra.proveedorId
          );
          return (
            <li
              key={compra.id}
              className='bg-gray-100 p-4 rounded-lg border border-gray-300'
            >
              <strong>Proveedor:</strong>{" "}
              {proveedor ? proveedor.razonSocial : "Desconocido"},
              <strong>Total:</strong> ${compra.total}
              <div className='flex gap-2 mt-2'>
                <button
                  onClick={() => handleEdit(compra)}
                  className='bg-yellow-500 text-white p-2 rounded-lg'
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(compra.id)}
                  className='bg-red-500 text-white p-2 rounded-lg'
                >
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
