"use client";
import { useEffect, useState } from "react";

interface Movimiento {
  id: number;
  tipo: string;
  monto: number;
  estado: string;
  tipoPago: string;
  clienteId: number | null;
  proveedorId: number | null;
}

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [tipo, setTipo] = useState<string>("CREDITO");
  const [monto, setMonto] = useState<number>(0);
  const [estado, setEstado] = useState<string>("PENDIENTE");
  const [tipoPago, setTipoPago] = useState<string>("EFECTIVO");
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [proveedorId, setProveedorId] = useState<number | null>(null);

  // Función para obtener movimientos
  const fetchMovimientos = async () => {
    const response = await fetch("/api/movimientos");
    const data = await response.json();
    setMovimientos(data);
  };

  // Cargar movimientos al montar el componente
  useEffect(() => {
    fetchMovimientos();
  }, []);

  // Función para manejar la creación de un nuevo movimiento
  const handleCreateMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/movimientos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tipo,
        monto,
        estado,
        tipoPago,
        clienteId,
        proveedorId,
      }),
    });

    if (response.ok) {
      // Resetea los campos del formulario
      setTipo("CREDITO");
      setMonto(0);
      setEstado("PENDIENTE");
      setTipoPago("EFECTIVO");
      setClienteId(null);
      setProveedorId(null);
      fetchMovimientos(); // Vuelve a cargar los movimientos
    } else {
      const errorData = await response.json();
      console.error("Error al crear movimiento:", errorData.error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-3xl font-bold mb-4'>Movimientos</h1>
      <form onSubmit={handleCreateMovimiento} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Tipo:
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='CREDITO'>Crédito</option>
              <option value='DEBITO'>Débito</option>
            </select>
          </label>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Monto:
            <input
              type='number'
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              required
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </label>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Estado:
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='PENDIENTE'>Pendiente</option>
              <option value='COMPLETADO'>Completado</option>
              <option value='CANCELADO'>Cancelado</option>
            </select>
          </label>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Tipo de Pago:
            <select
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border -blue-500'
            >
              <option value='EFECTIVO'>Efectivo</option>
              <option value='TARJETA'>Tarjeta</option>
              <option value='TRANSFERENCIA'>Transferencia</option>
              <option value='CHEQUE'>Cheque</option>
            </select>
          </label>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Cliente ID:
            <input
              type='number'
              value={clienteId || ""}
              onChange={(e) =>
                setClienteId(e.target.value ? Number(e.target.value) : null)
              }
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </label>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Proveedor ID:
            <input
              type='number'
              value={proveedorId || ""}
              onChange={(e) =>
                setProveedorId(e.target.value ? Number(e.target.value) : null)
              }
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </label>
        </div>
        <button
          type='submit'
          className='w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200'
        >
          Crear Movimiento
        </button>
      </form>
      <h2 className='text-2xl font-bold mt-6'>Lista de Movimientos</h2>
      <ul className='mt-4 space-y-2'>
        {movimientos.map((movimiento) => (
          <li
            key={movimiento.id}
            className='p-4 border border-gray-200 rounded-md shadow-sm'
          >
            {movimiento.tipo} - ${movimiento.monto} - {movimiento.estado} -{" "}
            {movimiento.tipoPago}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovimientosPage;
