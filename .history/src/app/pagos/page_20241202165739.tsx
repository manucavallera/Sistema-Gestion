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
  razonSocial: string; // Corregido: sin espacio
  createdAt: string;
  updatedAt: string;
  chequeId?: number | null; // Agregar chequeId como opcional
}

interface Cheque {
  id: number;
  monto: number;
  utilizado: boolean;
  cliente: string; // Agregar cliente
  proveedor: string; // Agregar proveedor
  banco: string; // Agregar banco
  sucursal: string; // Agregar sucursal
}

const PagosPage = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [monto, setMonto] = useState<number>(0);
  const [movimientoId, setMovimientoId] = useState<number | null>(null);
  const [metodoPago, setMetodoPago] = useState<string>("EFECTIVO");
  const [chequeId, setChequeId] = useState<number | null>(null);
  const [chequeSeleccionado, setChequeSeleccionado] = useState<Cheque | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editPagoId, setEditPagoId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        const response = await fetch("/api/pagos");
        if (!response.ok) {
          throw new Error("Error al obtener los pagos.");
        }
        const data: Pago[] = await response.json();
        console.log("Datos de pagos:", data); // Para depuración
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

    const fetchCheques = async () => {
      try {
        const response = await fetch("/api/cheques");
        if (!response.ok) {
          throw new Error("Error al obtener los cheques.");
        }
        const data: Cheque[] = await response.json();
        setCheques(data);
      } catch (error) {
        handleFetchError(error, "cheques");
      }
    };

    fetchPagos();
    fetchMovimientos();
    fetchCheques();
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
          body: JSON.stringify({
            monto,
            movimientoId,
            metodoPago,
            montoMovimiento: chequeId
              ? cheques.find((cheque) => cheque.id === chequeId)?.monto || null
              : null,
            razonSocial:
              cheques.find((cheque) => cheque.id === chequeId)?.proveedor ||
              "N/A",
            chequeId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el pago.");
      }

      const newPago: Pago = await response.json();
      setPagos((prevPagos) =>
        editPagoId
          ? prevPagos.map((pago) => (pago.id === editPagoId ? newPago : pago))
          : [...prevPagos, newPago]
      );
      setSuccessMessage("Pago guardado exitosamente.");
      resetForm();
    } catch (error) {
      handleFetchError(error, "pago");
    }
  };

  const resetForm = () => {
    setMonto(0);
    setMovimientoId(null);
    setMetodoPago("EFECTIVO");
    setChequeId(null);
    setEditPagoId(null);
  };

  const handleEdit = (pago: Pago) => {
    setMonto(pago.monto);
    setMovimientoId(pago.movimientoId);
    setMetodoPago(pago.metodoPago);
    setChequeId(pago.chequeId || null);
    setEditPagoId(pago.id);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este pago?")) {
      try {
        const response = await fetch(`/api/pagos/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el pago.");
        }

        setPagos((prevPagos) => prevPagos.filter((pago) => pago.id !== id));
        setSuccessMessage("Pago eliminado exitosamente.");
      } catch (error) {
        handleFetchError(error, "pago");
      }
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold'>Página de Pagos</h1>
      {error && <p className='text-red-500'>{error}</p>}
      {successMessage && <p className='text-green-500'>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type='number'
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          placeholder='Monto'
          required
        />
        <select
          value={movimientoId || ""}
          onChange={(e) => setMovimientoId(Number(e.target.value))}
          required
        >
          <option value='' disabled>
            Selecciona un movimiento
          </option>
          {movimientos.map((movimiento) => (
            <option key={movimiento.id} value={movimiento.id}>
              {movimiento.tipo} - {movimiento.monto}
            </option>
          ))}
        </select>
        <select
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          <option value='EFECTIVO'>Efectivo</option>
          <option value='TARJETA'>Tarjeta</option>
          <option value='TRANSFERENCIA'>Transferencia</option>
        </select>
        <select
          value={chequeId || ""}
          onChange={(e) =>
            setChequeId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value='' disabled>
            Selecciona un cheque
          </option>
          {cheques.map((cheque) => (
            <option key={cheque.id} value={cheque.id}>
              {cheque.cliente} - {cheque.monto}
            </option>
          ))}
        </select>
        <button type='submit'>
          {editPagoId ? "Actualizar Pago" : "Agregar Pago"}
        </button>
      </form>
      <ul>
        {pagos.map((pago) => (
          <li key={pago.id} className='mb-2'>
            Monto: {pago.monto}, Movimiento ID: {pago.movimientoId}, Método de
            Pago: {pago.metodoPago}, Razón Social: {pago.razonSocial || "N/A"},
            Monto Movimiento:{" "}
            {pago.montoMovimiento !== null ? pago.montoMovimiento : "N/A"}
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
              {" "}
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      {chequeSeleccionado && (
        <div className='mt-4 p-4 border border-gray-300 rounded'>
          <h3 className='font-bold'>Detalles del Cheque:</h3>
          <p>Número: {chequeSeleccionado.id}</p>
          <p>Monto: {chequeSeleccionado.monto}</p>
          <p>Cliente: {chequeSeleccionado.cliente?.nombre}</p>
          <p>Proveedor: {chequeSeleccionado.proveedor?.nombre}</p>
          <p>Banco: {chequeSeleccionado.banco}</p>
          <p>Sucursal: {chequeSeleccionado.sucursal}</p>
        </div>
      )}
    </div>
  );
};

export default PagosPage;
