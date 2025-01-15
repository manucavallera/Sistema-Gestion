"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Venta } from "@prisma/client";

export default function VentaPage() {
  const router = useRouter();
  const { id } = router.query; // Obtener el ID de la URL
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    fecha: string;
    total: number;
    clienteId: number;
  }>({
    fecha: "",
    total: 0,
    clienteId: 0,
  });

  useEffect(() => {
    const fetchVenta = async () => {
      if (id) {
        const response = await fetch(`/api/ventas/${id}`);
        if (!response.ok) {
          setError("Error al obtener la venta");
          setLoading(false);
          return;
        }
        const data = await response.json();
        setVenta(data);
        setFormData({
          fecha: new Date(data.fecha).toISOString().split("T")[0], // Formato YYYY-MM-DD
          total: data.total,
          clienteId: data.clienteId,
        });
        setLoading(false);
      }
    };

    fetchVenta();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total" ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/ventas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Venta actualizada con éxito");
      router.push(`/ventas`); // Redirigir a la lista de ventas
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Error al actualizar la venta");
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/ventas/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Venta eliminada con éxito");
      router.push(`/ventas`); // Redirigir a la lista de ventas
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Error al eliminar la venta");
    }
  };

  if (loading) return <div className='text-center'>Cargando...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;
  if (!venta) return <div className='text-center'>Venta no encontrada</div>;

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Detalles de la Venta</h1>
      <form onSubmit={handleUpdate} className='mb-4'>
        <div className='mb-4'>
          <label className='block text-gray-700'>Fecha:</label>
          <input
            type='date'
            name='fecha'
            value={formData.fecha}
            onChange={handleChange}
            className='border rounded p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Total:</label>
          <input
            type='number'
            name='total'
            value={formData.total}
            onChange={handleChange}
            className='border rounded p-2 w-full'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700'>Cliente ID:</label>
          <input
            type='number'
            name='clienteId'
            value={formData.clienteId}
            onChange={handleChange}
            className='border rounded p-2 w-full'
            required
          />
        </div>
        <button type='submit' className='bg-blue-500 text-white p-2 rounded'>
          Actualizar Venta
        </button>
      </form>
      <button
        onClick={handleDelete}
        className='bg-red-500 text-white p-2 rounded'
      >
        Eliminar Venta
      </button>
    </div>
  );
}
