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
  const [tipo, setTipo] = useState<string>("CREDITO");
  const [monto, setMonto] = useState<number>(0);
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
        estado: "PENDIENTE", // Estado inicial siempre PENDIENTE
        tipoPago,
        clienteId,
        proveedorId,
      }),
    });

    if (response.ok) {
      // Resetear los estados
      setTipo("CREDITO");
      setMonto(0);
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

  const cambiarEstadoMovimiento = async (id: number, nuevoEstado: string) => {
    const response = await fetch(`/api/movimientos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (response.ok) {
      fetchMovimientos(); // Actualizar la lista de movimientos
    } else {
      const errorData = await response.json();
      console.error("Error al actualizar el estado:", errorData.error);
    }
  };

  const eliminarMovimiento = async (id: number) => {
    const response = await fetch(`/api/movimientos/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchMovimientos(); // Actualizar la lista de movimientos
    } else {
      const errorData = await response.json();
      console.error("Error al eliminar el movimiento:", errorData.error);
    }
  };

  const [movimientoAEditar, setMovimientoAEditar] = useState<Movimiento | null>(null);

  const handleEditMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (movimientoAEditar) {
      const response = await fetch(`/api/movimientos/${movimientoAEditar.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movimientoAEditar),
      });

      if (response.ok) {
        setMovimientoAEditar(null); // Cerrar el formulario
        fetchMovimientos(); // Actualizar la lista de movimientos
      } else {
        const errorData = await response.json();
        console.error("Error al editar movimiento:", errorData.error);
      }
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-3xl font-bold mb-4'>Movimientos</h1>
      <form onSubmit={handleCreateMovimiento} className='space-y-4'>
        <div>
          <label className='block text-sm font-bold mb-1'>Tipo:</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
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
            value={monto}
            onChange={(e) => setMonto(Number(e.target.value))}
            className='border rounded p-2 w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-bold mb-1'>Tipo de Pago:</label>
          <select
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
            className='border rounded p-2 w-full'
          >
            <option value='EFECTIVO'>EFECTIVO</option>
            <option value='TARJETA'>TARJETA</option>
          </select>
        </div>
        <div>
          <label className='block text-sm font-bold mb-1'>Cliente:</label>
          <select
            onChange={(e) => handleSelectCliente(Number(e.target.value))}
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
            onChange={(e) => handleSelectProveedor(Number(e.target.value))}
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
        <button type='submit' className='bg ```javascript
        <button type='submit' className='bg-blue-500 text-white rounded p-2'>
          Agregar Movimiento
        </button>
      </form>
      {movimientoAEditar && (
        <form onSubmit={handleEditMovimiento} className='mt-6 space-y-4'>
          <h2 className='text-xl font-bold'>Editar Movimiento</h2>
          <div>
            <label className='block text-sm font-bold mb-1'>Tipo:</label>
            <select
              value={movimientoAEditar.tipo}
              onChange={(e) => setMovimientoAEditar({ ...movimientoAEditar, tipo: e.target.value })}
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
              value={movimientoAEditar.monto}
              onChange={(e) => setMovimientoAEditar({ ...movimientoAEditar, monto: Number(e.target.value) })}
              className='border rounded p-2 w-full'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-bold mb-1'>Tipo de Pago:</label>
            <select
              value={movimientoAEditar.tipoPago}
              onChange={(e) => setMovimientoAEditar({ ...movimientoAEditar, tipoPago: e.target.value })}
              className='border rounded p-2 w-full'
            >
              <option value='EFECTIVO'>EFECTIVO</option>
              <option value='TARJETA'>TARJETA</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-bold mb-1'>Cliente:</label>
            <select
              value={movimientoAEditar.clienteId || ''}
              onChange={(e) => setMovimientoAEditar({ ...movimientoAEditar, clienteId: Number(e.target.value) })}
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
              value={movimientoAEditar.proveedorId || ''}
              onChange={(e) => setMovimientoAEditar({ ...movimientoAEditar, proveedorId: Number(e.target.value) })}
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
          <button type='submit' className='bg-green-500 text-white rounded p-2'>
            Guardar Cambios
          </button>
        </form>
      )}
      <h2 className='text-2xl font-bold mt-6'>Lista de Movimientos</h2>
      <ul className='mt-4'>
        {movimientos.map((movimiento) => {
          const cliente = clientes.find((c) => c.id === movimiento.clienteId);
          const proveedor = proveedores.find(
            (p) => p.id === movimiento.proveedorId
          );
          return (
            <li
              key={movimiento.id}
              className='flex justify-between items-center border-b py-2'
            >
              <span>
                {movimiento.tipo} - {movimiento.monto} - {movimiento.estado} -{" "}
                {cliente
                  ? cliente.razonSocial
                  : proveedor
                  ? proveedor.razonSocial
                  : "N/A"}
              </span>
              <div className='flex space-x-2'>
                <button
                  onClick={() => eliminarMovimiento(movimiento.id)}
                  className='text-red-500'
                >
                  Eliminar
                </button>
                <button
                  onClick={() => setMovimientoAEditar(movimiento)}
                  className='text-blue-500'
                >
                  Editar
                </button>
                <select
                  value={movimiento.estado}
                  onChange={(e) =>
                    cambiarEstadoMovimiento (movimiento.id, e.target.value)
                  }
                  className='border rounded p-1'
                >
                  <option value='PENDIENTE'>PENDIENTE</option>
                  <option value='COMPLETADO'>COMPLETADO</option>
                  <option value='CANCELADO'>CANCELADO</option>
                </select>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MovimientosPage;