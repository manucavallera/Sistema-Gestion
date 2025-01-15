"use client";
import { useEffect, useState } from "react";

// Definimos los tipos para los movimientos y las props
interface Movimiento {
  id: number;
  tipo: string;
  monto: number;
  saldo: number;
  referencia?: string;
}

interface CuentaCorrientePageProps {
  clienteId?: number;
  proveedorId?: number;
}

function CuentaCorrientePage({
  clienteId,
  proveedorId,
}: CuentaCorrientePageProps) {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: "credito",
    monto: 0,
    referencia: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const obtenerMovimientos = async () => {
      try {
        const response = await fetch(
          `/api/movimientos?clienteId=${clienteId}&proveedorId=${proveedorId}`
        );
        if (response.ok) {
          const data = await response.json();
          setMovimientos(data);
        } else {
          setError("Error al obtener movimientos");
        }
      } catch (error) {
        setError("Error de conexión");
      }
    };

    obtenerMovimientos();
  }, [clienteId, proveedorId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNuevoMovimiento((prev) => ({ ...prev, [name]: value }));
  };

  const agregarMovimiento = async () => {
    if (nuevoMovimiento.monto <= 0) {
      setError("El monto debe ser mayor que cero.");
      return;
    }

    try {
      const response = await fetch("/api/movimientos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...nuevoMovimiento,
          monto: parseFloat(nuevoMovimiento.monto.toString()),
          clienteId,
          proveedorId,
        }),
      });

      if (response.ok) {
        const movimiento: Movimiento = await response.json();
        setMovimientos((prev) => [movimiento, ...prev]);
        setNuevoMovimiento({ tipo: "credito", monto: 0, referencia: "" });
        setError(null); // Limpiar errores anteriores
      } else {
        setError("Error al agregar movimiento");
      }
    } catch (error) {
      setError("Error de conexión");
    }
  };

  return (
    <div>
      <h2>Cuenta Corriente</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
            {mov.tipo === "credito" ? "+" : "-"}$
            {new Intl.NumberFormat("es-AR", {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(mov.monto)}{" "}
            - {mov.referencia ? `Referencia: ${mov.referencia}` : ""} - Saldo: $
            {new Intl.NumberFormat("es-AR", {
              style: "decimal",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(mov.saldo)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CuentaCorrientePage;
