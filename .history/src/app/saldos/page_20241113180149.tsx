"use client";
import { useEffect, useState } from "react";

const SaldosPage = () => {
  const [saldos, setSaldos] = useState<
    { id: number; clienteId: number; saldo: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchSaldos = async () => {
      setLoading(true); // Iniciar carga
      try {
        const response = await fetch("/api/saldos");
        if (!response.ok) {
          throw new Error("Error al obtener los saldos");
        }
        const data = await response.json();
        setSaldos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };

    fetchSaldos();
  }, []);

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Saldos</h1>
      {loading && <p className='text-gray-500'>Cargando saldos...</p>}{" "}
      {/* Mensaje de carga */}
      {error && <p className='text-red-500 mb-4'>{error}</p>}
      <ul className='bg-white shadow-md rounded-lg divide-y divide-gray-200'>
        {saldos.map((saldo) => (
          <li key={saldo.id} className='p-4 flex justify-between items-center'>
            <span className='text-gray-700'>Cliente ID: {saldo.clienteId}</span>
            <span className='text-green-600 font-semibold'>
              Saldo: ${saldo.saldo}
            </span>
          </li>
        ))}
      </ul>
      {saldos.length === 0 && !loading && (
        <p className='text-gray-500'>No hay saldos disponibles.</p>
      )}{" "}
      {/* Mensaje si no hay saldos */}
    </div>
  );
};

export default SaldosPage;
