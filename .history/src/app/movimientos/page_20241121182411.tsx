"use client";
import { useEffect, useState } from "react";

interface Movimiento {
  id: number;
  tipo: string; // "CREDITO" o "DEBITO"
  monto: number;
  estado: string; // "PENDIENTE", "COMPLETADO", "CANCELADO"
  tipoPago: string; // "EFECTIVO", "TARJETA", etc.
  clienteId: number | null;
  proveedorId: number | null;
}

interface Cliente {
  id: number;
  razonSocial: string;
  saldo: number; // para manejar el debe/haber
}

interface Proveedor {
  id: number;
  razonSocial: string;
  saldo: number; // para manejar el debe/haber
}

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [formData, setFormData] = useState<Movimiento>({
    id: 0,
    tipo: "CREDITO",
    monto: 0,
    estado: "PENDIENTE",
    tipoPago: "EFECTIVO",
    clienteId: null,
    proveedorId: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  // Funciones para obtener datos
  const fetchData = async () => {
    const [movimientosResponse, clientesResponse, proveedoresResponse] =
      await Promise.all([
        fetch("/api/movimientos"),
        fetch("/api/clientes"),
        fetch("/api/proveedores"),
      ]);
    const [movimientosData, clientesData, proveedoresData] = await Promise.all([
      movimientosResponse.json(),
      clientesResponse.json(),
      proveedoresResponse.json(),
    ]);
    setMovimientos(movimientosData);
    setClientes(clientesData);
    setProveedores(proveedoresData);
  };

  useEffect(() => {
    fetchData(); // Cargar datos al inicio
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "monto" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing
      ? `/api/movimientos/${formData.id}`
      : "/api/movimientos";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormData({
        id: 0,
        tipo: "CREDITO",
        monto: 0,
        estado: "PENDIENTE",
        tipoPago: "EFECTIVO",
        clienteId: null,
        proveedorId: null,
      });
      setIsEditing(false);
      fetchData(); // Actualizar la lista de movimientos
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData.error);
    }
  };

  const handleEdit = (movimiento: Movimiento) => {
    setFormData(movimiento);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/movimientos/${id}`, {
      method: "DELETE",
    });
    if (response.ok) fetchData(); // Actualizar la lista de movimientos
    else {
      const errorData = await response.json();
      console.error("Error al eliminar el movimiento:", errorData.error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-3xl font-bold mb-4'>Movimientos</h1>
      <form onSubmit={handleSubmit} className='space-y -4'>
        <div>
          <label className='block text-sm font-bold mb-1'>Tipo:</label>
          <select
            name='tipo'
            value={formData.tipo}
            onChange={handleChange}
            className='border rounded p-2 w-full'
          >
            <option value='CREDITO'>CREDITO</option>
            <option value='DEBITO'>DEBITO</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-bold mb-1'>Monto:</label>
          <input
            type='number'
            name='monto'
            value={formData.monto}
            onChange={handleChange}
            className='border rounded p-2 w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-bold mb-1'>Tipo de Pago:</label>
          <select
            name='tipoPago'
            value={formData.tipoPago}
            onChange={handleChange}
            className='border rounded p-2 w-full'
          >
            <option value='EFECTIVO'>EFECTIVO</option>
            <option value='TARJETA'>TARJETA</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-bold mb-1'>Cliente:</label>
          <select
            name='clienteId'
            value={formData.clienteId || ""}
            onChange={handleChange}
            className='border rounded p-2 w-full'
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
          <label className='block text-sm font-bold mb-1'>Proveedor:</label>
          <select
            name='proveedorId'
            value={formData.proveedorId || ""}
            onChange={handleChange}
            className='border rounded p-2 w-full'
          >
            <option value=''>Seleccionar Proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.razonSocial}
              </option>
            ))}
          </select>
        </div>
        <button type='submit' className='bg-blue-500 text-white rounded p-2'>
          {isEditing ? "Guardar Cambios" : "Agregar Movimiento"}
        </button>
      </form>

      <h2 className='text-2xl font-bold mt-6'>Lista de Movimientos</h2>
      <ul className='mt-4'>
        {movimientos.map((movimiento) => (
          <li
            key={movimiento.id}
            className='flex justify-between items-center border-b py-2'
          >
            <span>
              {movimiento.tipo} - {movimiento.monto} - {movimiento.estado} -{" "}
              {clientes.find((c) => c.id === movimiento.clienteId)
                ?.razonSocial ||
                proveedores.find((p) => p.id === movimiento.proveedorId)
                  ?.razonSocial ||
                "N/A"}
            </span>
            <div className='flex space-x-2'>
              <button
                onClick={() => handleDelete(movimiento.id)}
                className='text-red-500'
              >
                Eliminar
              </button>
              <button
                onClick={() => handleEdit(movimiento)}
                className='text-blue-500'
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovimientosPage;
