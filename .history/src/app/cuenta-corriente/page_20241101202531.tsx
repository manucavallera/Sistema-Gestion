"use client";
import { useEffect, useState } from "react";

// Define el tipo para los movimientos
interface Movimiento {
  id: number;
  tipo: string; // "credito" o "debito"
  monto: number;
  referencia: string;
  saldo: number;
}

function CuentaCorrientePage({ clienteId, proveedorId }) {
  // Especifica el tipo de estado para movimientos
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: "credito",
    monto: 0,
    referencia: "",
  });

  useEffect(() => {
    const obtenerMovimientos = async () => {
      try {
        const response = await fetch(
          `/api/movimientos?clienteId=${String(clienteId)}&proveedorId=${String(
            proveedorId
          )}`
        );
        if (response.ok) {
          const data: Movimiento[] = await response.json(); // Especifica el tipo de data
          setMovimientos(data);
        } else {
          console.error("Error al obtener movimientos");
        }
      } catch (error) {
        console.error("Error de conexión", error);
      }
    };

    obtenerMovimientos();
  }, [clienteId, proveedorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoMovimiento((prev) => ({ ...prev, [name]: value }));
  };

  const agregarMovimiento = async () => {
    try {
      const response = await fetch("/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nuevoMovimiento,
          monto: parseFloat(nuevoMovimiento.monto),
          clienteId: clienteId ? Number(clienteId) : undefined,
          proveedorId: proveedorId ? Number(proveedorId) : undefined,
        }),
      });

      if (response.ok) {
        const movimiento: Movimiento = await response.json(); // Especifica el tipo de movimiento
        setMovimientos((prev) => [movimiento, ...prev]); // Ahora esto debería funcionar sin errores
        setNuevoMovimiento({ tipo: "credito", monto: 0, referencia: "" });
      } else {
        console.error("Error al agregar movimiento");
      }
    } catch (error) {
      console.error("Error de conexión", error);
    }
  };

  return (
    <div>
      <h2>Cuenta Corriente</h2>
      <div>
        <h3>Registrar Movimiento</h3>
        <select
          name='tipo'
          value={nuevoMovimiento.tipo}
          onChange={handleInputChange}
        >
          <option value='credito'>Crédito</option>
          <option value='debito'>Débito</option>
        </select>
        <input
          type='number'
          name='monto'
          value={nuevoMovimiento.monto}
          onChange={handleInputChange}
          placeholder='Monto'
        />
        <input
          type='text'
          name='referencia'
          value={nuevoMovimiento.referencia}
          onChange={handleInputChange}
          placeholder='Referencia'
        />
        <button onClick={agregarMovimiento}>Agregar Movimiento</button>
      </div>

      <h3>Historial de Movimientos</h3>
      <ul>
        {movimientos.map((mov) => (
          <li key={mov.id}>
            {mov.tipo === "credito" ? "+" : "-"}${mov.monto} -{" "}
            {mov.referencia ? `Referencia: ${mov.referencia}` : ""} - Saldo: $
            {mov.saldo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CuentaCorrientePage;
