// src/app/cuenta-corriente/page.tsx
"use client";
import { useEffect, useState } from "react";

function CuentaCorrientePage() {
  const [saldo, setSaldo] = useState<number | null>(null);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [movimientos, setMovimientos] = useState<any[]>([]); // Cambia 'any' por el tipo adecuado más tarde

  useEffect(() => {
    const fetchSaldo = async () => {
      if (clienteId) {
        const response = await fetch(`/api/saldo?clienteId=${clienteId}`);
        const data = await response.json();
        setSaldo(data.saldo);

        const movimientosResponse = await fetch(
          `/api/movimientos?clienteId=${clienteId}`
        );
        const movimientosData = await movimientosResponse.json();
        setMovimientos(movimientosData.movimientos);
      }
    };
    fetchSaldo();
  }, [clienteId]);

  const handleClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClienteId(Number(e.target.value));
  };

  return (
    <div>
      <h1>Cuenta Corriente</h1>
      <label htmlFor='cliente'>Selecciona un Cliente:</label>
      <select
        id='cliente'
        onChange={handleClienteChange}
        value={clienteId ?? ""}
      >
        <option value='' disabled>
          Selecciona un cliente
        </option>
        {/* Aquí puedes mapear tus clientes desde el estado o props */}
        <option value={1}>Cliente 1</option>
        <option value={2}>Cliente 2</option>
      </select>

      <div>
        <h2>Saldo: {saldo !== null ? `$${saldo}` : "Seleccione un cliente"}</h2>
      </div>

      <h3>Movimientos:</h3>
      <ul>
        {movimientos.map((movimiento) => (
          <li key={movimiento.id}>
            {movimiento.tipo}: ${movimiento.monto} - {movimiento.tipoPago} -{" "}
            {new Date(movimiento.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CuentaCorrientePage;
