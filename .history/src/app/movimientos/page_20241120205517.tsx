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
}

interface Proveedor {
  id: number;
  razonSocial: string;
}

const MovimientosPage = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [tipo, setTipo] = useState<string>("CREDITO");
  const [monto, setMonto] = useState<number>(0);
  const [estado, setEstado] = useState<string>("PENDIENTE");
  const [tipoPago, setTipoPago] = useState<string>("EFECTIVO");
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [proveedorId, setProveedorId] = useState<number | null>(null);
  const [searchCliente, setSearchCliente] = useState<string>("");
  const [searchProveedor, setSearchProveedor] = useState<string>("");

  // Funciones para obtener datos
  const fetchMovimientos = async () => {
    const response = await fetch("/api/movimientos");
    const data = await response.json();
    setMovimientos(data);
  };

  const fetchClientes = async () => {
    const response = await fetch(`/api/clientes?razonSocial=${searchCliente}`);
    const data = await response.json();
    setClientes(data);
  };

  const fetchProveedores = async () => {
    const response = await fetch(
      `/api/proveedores?razonSocial=${searchProveedor}`
    );
    const data = await response.json();
    setProveedores(data);
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

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
      setTipo("CREDITO");
      setMonto(0);
      setEstado("PENDIENTE");
      setTipoPago("EFECTIVO");
      setClienteId(null);
      setProveedorId(null);
      fetchMovimientos();
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
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
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
      <div className='mt-6'>
        <h2 className='text-2xl font-bold'>Buscar Clientes</h2>
        <input
          type='text'
          value={searchCliente}
          onChange={(e) => setSearchCliente(e.target.value)}
          placeholder='Buscar por razón social'
          className='mt-1 block w-full border border-gray- 300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
        />
        <button
          onClick={fetchClientes}
          className='mt-2 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200'
        >
          Buscar Clientes
        </button>
        <ul className='mt-4 space-y-2'>
          {clientes.map((cliente) => (
            <li
              key={cliente.id}
              className='p-2 border border-gray-200 rounded-md'
            >
              {cliente.razonSocial}
            </li>
          ))}
        </ul>
      </div>
      <div className='mt-6'>
        <h2 className='text-2xl font-bold'>Buscar Proveedores</h2>
        <input
          type='text'
          value={searchProveedor}
          onChange={(e) => setSearchProveedor(e.target.value)}
          placeholder='Buscar por razón social'
          className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
        />
        <button
          onClick={fetchProveedores}
          className='mt-2 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200'
        >
          Buscar Proveedores
        </button>
        <ul className='mt-4 space-y-2'>
          {proveedores.map((proveedor) => (
            <li
              key={proveedor.id}
              className='p-2 border border-gray-200 rounded-md'
            >
              {proveedor.razonSocial}
            </li>
          ))}
        </ul>
      </div>
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
