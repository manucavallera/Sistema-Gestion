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
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Funciones para obtener datos
  const fetchMovimientos = async () => {
    const response = await fetch("/api/movimientos");
    const data = await response.json();
    setMovimientos(data);
  };

  const fetchClientesYProveedores = async () => {
    const [clientesResponse, proveedoresResponse] = await Promise.all([
      fetch(`/api/clientes?razonSocial=${searchTerm}`),
      fetch(`/api/proveedores?razonSocial=${searchTerm}`),
    ]);
    const clientesData = await clientesResponse.json();
    const proveedoresData = await proveedoresResponse.json();
    setClientes(clientesData);
    setProveedores(proveedoresData);
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
      // Resetear los estados
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

  const handleSelectCliente = (id: number | null) => {
    setClienteId(id);
    setProveedorId(null); // Deshabilitar proveedor si se selecciona cliente
  };

  const handleSelectProveedor = (id: number | null) => {
    setProveedorId(id);
    setClienteId(null); // Deshabilitar cliente si se selecciona proveedor
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
            Buscar Cliente o Proveedor:
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={fetchClientesYProveedores}
              placeholder='Buscar por razón social'
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </label>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Seleccionar Cliente:
            <select
              value={clienteId || ""}
              onChange={(e) =>
                handleSelectCliente(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.razonSocial}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700'>
            Seleccionar Proveedor:
            <select
              value={proveedorId || ""}
              onChange={(e) =>
                handleSelectProveedor(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.razonSocial}
                </option>
              ))}
            </select>
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
        {movimientos.map((movimiento) => {
          const cliente = clientes.find((c) => c.id === movimiento.clienteId);
          const proveedor = proveedores.find(
            (p) => p.id === movimiento.proveedorId
          );
          const razonSocial = cliente
            ? cliente.razonSocial
            : proveedor
            ? proveedor.razonSocial
            : "N/A";
          return (
            <li
              key={movimiento.id}
              className='p-4 border border-gray-200 rounded-md shadow-sm'
            >
              {razonSocial} - {movimiento.tipo} - ${movimiento.monto} -
              PENDIENTE - {movimiento.tipoPago}
              <button
                onClick={async () => {
                  const response = await fetch(
                    `/api/movimientos/${movimiento.id}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ estado: "COMPLETADO" }),
                    }
                  );
                  if (response.ok) {
                    fetchMovimientos(); // Actualizar la lista de movimientos
                  }
                }}
                className='ml-4 text-blue-600 hover:underline'
              >
                Marcar como Completado
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MovimientosPage;
