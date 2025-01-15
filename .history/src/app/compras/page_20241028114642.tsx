"use client";
import { useEffect, useState } from "react";

// Define el tipo para Proveedor
type Proveedor = {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono?: string;
  email?: string;
};

// Define el tipo para Compra
type Compra = {
  id: number;
  fecha: string; // o Date dependiendo de cómo lo manejes
  total: number;
  proveedorId: number;
};

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [formData, setFormData] = useState({
    total: "",
    proveedorId: "",
  });

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await fetch("/api/compras");
        const data = await response.json();
        setCompras(data);
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      }
    };

    const fetchProveedores = async () => {
      try {
        const response = await fetch("/api/proveedores");
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
      }
    };

    fetchCompras();
    fetchProveedores();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Registro de datos para depuración
    console.log("Datos enviados:", formData);

    try {
      const response = await fetch("/api/compras", {
        method: "POST",
        body: JSON.stringify({
          total: parseFloat(formData.total), // Convertir total a número
          proveedorId: parseInt(formData.proveedorId, 10), // Convertir proveedorId a número
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newCompra = await response.json();
        setCompras((prevCompras) => [...prevCompras, newCompra]);
        setFormData({ total: "", proveedorId: "" });
      } else {
        console.error("Error al agregar la compra:", response.statusText);
      }
    } catch (error) {
      console.error("Error al agregar la compra:", error);
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
            placeholder='Total'
            value={formData.total}
            onChange={handleInputChange}
            required
            className='w-full mt-2 p-2 border rounded-lg'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600'
        >
          Agregar Compra
        </button>
      </form>

      <h2 className='text-xl font-semibold mb-4'>Lista de Compras</h2>
      <ul className='space-y-4'>
        {compras.map((compra) => {
          const proveedor = proveedores.find(
            (prov) => prov.id === compra.proveedorId
          );
          return (
            <li
              key={compra.id}
              className='bg-gray-100 p-4 rounded-lg border border-gray-300'
            >
              <strong>Proveedor:</strong>{" "}
              {proveedor ? proveedor.razonSocial : "Proveedor no encontrado"},
              <strong> Total:</strong> {compra.total}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
