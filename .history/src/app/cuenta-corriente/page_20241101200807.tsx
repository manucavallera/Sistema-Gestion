// src/app/cuenta-corriente/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Movimiento {
  id: number;
  fecha: string;
  tipo: string;
  monto: number;
  saldo: number;
  referencia?: string;
}

function CuentaCorrientePage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const response = await fetch("/api/movimientos");
        if (response.ok) {
          const data = await response.json();
          setMovimientos(data.movimientos);
        } else {
          console.error("Error fetching movements:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching movements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimientos();
  }, []);

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Cuenta Corriente</h1>
      {loading ? (
        <p>Cargando movimientos...</p>
      ) : movimientos.length > 0 ? (
        <div className='overflow-x-auto'>
          <table className='table-auto w-full bg-white shadow-md rounded'>
            <thead>
              <tr className='bg-gray-200 text-gray-700'>
                <th className='px-4 py-2'>Fecha</th>
                <th className='px-4 py-2'>Tipo</th>
                <th className='px-4 py-2'>Monto</th>
                <th className='px-4 py-2'>Saldo</th>
                <th className='px-4 py-2'>Referencia</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((movimiento) => (
                <tr key={movimiento.id} className='border-b border-gray-200'>
                  <td className='px-4 py-2'>
                    {new Date(movimiento.fecha).toLocaleDateString()}
                  </td>
                  <td
                    className={`px-4 py-2 font-semibold ${
                      movimiento.tipo === "credito"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {movimiento.tipo === "credito" ? "Crédito" : "Débito"}
                  </td>
                  <td className='px-4 py-2'>
                    ${movimiento.monto.toLocaleString()}
                  </td>
                  <td className='px-4 py-2'>
                    ${movimiento.saldo.toLocaleString()}
                  </td>
                  <td className='px-4 py-2'>{movimiento.referencia || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay movimientos en la cuenta corriente.</p>
      )}
    </div>
  );
}

export default CuentaCorrientePage;
