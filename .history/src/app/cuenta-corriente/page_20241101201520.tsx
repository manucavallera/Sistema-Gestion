// src/app/cuenta-corriente/page.tsx
"use client";

import { useState } from "react";

function CuentaCorrientePage() {
  const [tipo, setTipo] = useState("credito");
  const [monto, setMonto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [proveedorId, setProveedorId] = useState("");
  const [mensaje, setMensaje] = useState("");

  const registrarMovimiento = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/movimientos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo,
          monto: parseFloat(monto),
          clienteId,
          proveedorId,
          referencia,
        }),
      });

      if (response.ok) {
        setMensaje("Movimiento registrado con éxito.");
      } else {
        setMensaje("Error al registrar movimiento.");
      }
    } catch (error) {
      setMensaje("Error de conexión.");
    }
  };

  return (
    <div>
      <h1>Cuenta Corriente</h1>
      <form onSubmit={registrarMovimiento}>
        <label>
          Tipo de Movimiento:
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value='credito'>Crédito</option>
            <option value='debito'>Débito</option>
          </select>
        </label>
        <label>
          Monto:
          <input
            type='number'
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </label>
        <label>
          Referencia:
          <input
            type='text'
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
        </label>
        <label>
          Cliente ID:
          <input
            type='text'
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          />
        </label>
        <label>
          Proveedor ID:
          <input
            type='text'
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
          />
        </label>
        <button type='submit'>Registrar Movimiento</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default CuentaCorrientePage;
