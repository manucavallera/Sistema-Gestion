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
    <div>
      <h1>Movimientos</h1>
      <form onSubmit={handleCreateMovimiento}>
        <div>
          <label>
            Tipo:
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value='CREDITO'>Crédito</option>
              <option value='DEBITO'>Débito</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Monto:
            <input
              type='number'
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Estado:
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value='PENDIENTE'>Pendiente</option>
              <option value='COMPLETADO'>Completado</option>
              <option value='CANCELADO'>Cancelado</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Tipo de Pago:
            <select
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
            >
              <option value='EFECTIVO'>Efectivo</option>
              <option value='TARJETA'>Tarjeta</option>
              <option value='TRANSFERENCIA'>Transferencia</option>
              <option value='CHEQUE'>Cheque</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Cliente ID:
            <input
              type='number'
              value={clienteId || ""}
              onChange={(e) =>
                setClienteId(e.target.value ? Number(e.target.value) : null)
              }
            />
          </label>
        </div>
        <div>
          <label>
            Proveedor ID:
            <input
              type='number'
              value={proveedorId || ""}
              onChange={(e) =>
                setProveedorId(e.target.value ? Number(e.target.value) : null)
              }
            />
          </label>
        </div>
        <button type='submit'>Crear Movimiento</button>
      </form>
      <h2>Lista de Movimientos</h2>
      <ul>
        {movimientos.map((movimiento) => (
          <li key={movimiento.id}>
            {movimiento.tipo} - {movimiento.monto} - {movimiento.estado} -{" "}
            {movimiento.tipoPago}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovimientosPage;
