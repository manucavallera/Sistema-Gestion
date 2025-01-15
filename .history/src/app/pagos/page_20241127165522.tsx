"use client";
import { useEffect, useState } from "react";

interface Movimiento {
  id: number;
  tipo: string; // "compra" o "venta"
  monto: number;
  createdAt: string;
  proveedor?: {
    id: number;
    razonSocial: string;
  };
  cliente?: {
    id: number;
    razonSocial: string;
  };
}

interface Pago {
  id: number;
  monto: number;
  movimientoId: number;
  metodoPago: string;
  montoMovimiento: number | null;
  razonSocial: string;
  createdAt: string;
  updatedAt: string;
}

const PagosPage = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [monto, setMonto] = useState<number>(0);
  const [movimientoId, setMovimientoId] = useState<number | null>(null);
  const [metodoPago, setMetodoPago] = useState<string>("EFECTIVO");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editPagoId, setEditPagoId] = useState<number | null>(null);

  // Fetch initial data for pagos and movimientos
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch("/api/pagos");
        if (!response.ok) {
          throw new Error("Error al obtener los pagos.");
        }
        const data: Pago[] = await response.json();
        setPagos(data);
      } catch (error) {
        handleFetchError(error, "pagos");
      }
    };

    const fetchMovimientos = async () => {
      try {
        const response = await fetch("/api/movimientos");
        if (!response.ok) {
          throw new Error("Error al obtener los movimientos.");
        }
        const data: Movimiento[] = await response.json();
        setMovimientos(data);
      } catch (error) {
        handleFetchError(error, "movimientos");
      }
    };

    fetchPagos();
    fetchMovimientos();
  }, []);

  const handleFetchError = (error: unknown, type: string) => {
    if (error instanceof Error) {
      console.error(`Error al obtener ${type}:`, error.message);
      setError(error.message);
    } else {
      console.error("Error desconocido:", error);
      setError("Error desconocido al obtener los datos.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (monto <= 0 || movimientoId === null || !metodoPago) {
      setError(
        "El monto debe ser positivo, el movimientoId y el metodoPago son obligatorios."
      );
      return;
    }

    try {
      const response = await fetch(
        editPagoId ? `/api/pagos/${editPagoId}` : "/api/pagos",
        {
          method: editPagoId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ monto, movimientoId, metodoPago }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al crear o actualizar el pago."
        );
      }

      const nuevoPago: Pago = await response.json();
      if (editPagoId) {
        setPagos((prev) =>
          prev.map((pago) => (pago.id === nuevoPago.id ? nuevoPago : pago))
        );
      } else {
        setPagos((prev) => [...prev, nuevoPago]);
      }

      setSuccessMessage(
        editPagoId ? "Pago actualizado con éxito." : "Pago creado con éxito."
      );
      resetForm();
    } catch (error) {
      handleFetchError(error, "pago");
    }
  };

  const resetForm = () => {
    setMonto(0);
    setMovimientoId(null);
    setMetodoPago("EFECTIVO");
    setEditPagoId(null);
  };

  const handleEdit = (pago: Pago) => {
    setMonto(pago.monto);
    setMovimientoId(pago.movimientoId);
    setMetodoPago(pago.metodoPago);
    setEditPagoId(pago.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este pago?")) {
      try {
        const response = await fetch(`/api/pagos/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al eliminar el pago.");
        }

        setPagos((prev) => prev.filter((pago) => pago.id !== id));
        setSuccessMessage("Pago eliminado con éxito.");
      } catch (error) {
        handleFetchError(error, "pago");
      }
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Pagos</h1>
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      {successMessage && (
        <p className='text-green-500 mb-4'>{successMessage}</p>
      )}
      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
      >
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='monto'
          >
            Monto
          </label>
          <input
            type='number'
            id='monto'
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            placeholder='Monto'
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='movimientoId'
          >
            Movimiento
          </label>
          <select
            id='movimientoId'
            value={movimientoId ?? ""}
            onChange={(e) => setMovimientoId(Number(e.target.value))}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            <option value=''>Selecciona un movimiento</option>
            {movimientos.map((movimiento) => (
              <option key={movimiento.id} value={movimiento.id}>
                {movimiento.tipo} - {movimiento.monto}
              </option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='metodoPago'
          >
            Método de Pago
          </label>
          <select
            id='metodoPago'
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            required
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          >
            <option value='EFECTIVO'>Efectivo</option>
            <option value='TARJETA'>Tarjeta</option>
            <option value='TRANSFERENCIA'>Transferencia</option>
          </select>
        </div>
        <div className='flex items-center justify-between'>
          <button
            type='submit'
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
          >
            {editPagoId ? "Actualizar Pago" : "Crear Pago"}
          </button>
        </div>
      </form>
      <ul className='list-disc pl-5'>
        {pagos.map((pago) => (
          <li key={pago.id} className='mb-2'>
            Monto: {pago.monto}, Movimiento ID: {pago.movimientoId}, Método de
            Pago: {pago.metodoPago}, Razón Social: {pago.razonSocial}, Monto
            Movimiento: {pago.montoMovimiento}
            <button
              onClick={() => handleEdit(pago)}
              className='ml-2 text-blue-500'
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(pago.id)}
              className='ml-2 text-red-500'
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PagosPage;
