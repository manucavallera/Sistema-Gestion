"use client";
import { useEffect, useState } from "react";

// Definir el tipo para Cliente
type Cliente = {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
};

// Definir el tipo para Venta
type Venta = {
  id: number;
  clienteId: number;
  total: number;
};

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState({
    total: "",
    clienteId: "",
  });

  useEffect(() => {
    const fetchVentas = async () => {
      const response = await fetch("/api/ventas");
      const data = await response.json();
      setVentas(data);
    };

    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    };

    fetchVentas();
    fetchClientes();
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
      const response = await fetch("/api/ventas", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newVenta = await response.json();
        setVentas((prevVentas) => [...prevVentas, newVenta]);
        setFormData({ total: "", clienteId: "" });
      } else {
        console.error("Error al agregar la venta");
      }
    } catch (error) {
      console.error("Error al agregar la venta:", error);
    }
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Ventas</h1>

      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 max-w-md mb-6'
      >
        <div>
          <label htmlFor='clienteId' className='block text-lg font-medium'>
            Cliente:
          </label>
          <select
            id='clienteId'
            name='clienteId'
            value={formData.clienteId}
            onChange={handleInputChange}
            required
            className='w-full mt-2 p-2 border rounded-lg'
          >
            <option value=''>Seleccionar Cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial}
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
          Agregar Venta
        </button>
      </form>

      <h2 className='text-xl font-semibold mb-4'>Lista de Ventas</h2>
      <ul className='space-y-4'>
        {ventas.map((venta) => {
          const cliente = clientes.find((c) => c.id === venta.clienteId);
          return (
            <li
              key={venta.id}
              className='bg-gray-100 p-4 rounded-lg border border-gray-300'
            >
              <strong>Cliente:</strong>{" "}
              {cliente ? cliente.razonSocial : "Desconocido"},{" "}
              <strong>Total:</strong> ${venta.total}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
