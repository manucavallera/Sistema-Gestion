"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Tipos de Compra y Venta
type Compra = {
  id: number;
  total: number;
  fecha: string;
};

type Venta = {
  id: number;
  total: number;
  fecha: string;
};

export default function InicioPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    const fetchCompras = async () => {
      const response = await fetch("/api/compras");
      const data = await response.json();
      setCompras(data);
    };

    const fetchVentas = async () => {
      const response = await fetch("/api/ventas");
      const data = await response.json();
      setVentas(data);
    };

    fetchCompras();
    fetchVentas();
  }, []);

  // Filtrar datos por mes y semana
  const filterDataByMonth = (data: (Compra | Venta)[]) => {
    const currentMonth = new Date().getMonth();
    return data.filter(
      (item) => new Date(item.fecha).getMonth() === currentMonth
    );
  };

  const filterDataByWeek = (data: (Compra | Venta)[]) => {
    const currentWeek = getWeekNumber(new Date());
    return data.filter(
      (item) => getWeekNumber(new Date(item.fecha)) === currentWeek
    );
  };

  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((date.getDay() + 1 + days) / 7);
  };

  // Calcular totales de compras y ventas
  const totalComprasMensual = filterDataByMonth(compras).reduce(
    (total, compra) => total + compra.total,
    0
  );

  const totalComprasSemanal = filterDataByWeek(compras).reduce(
    (total, compra) => total + compra.total,
    0
  );

  const totalVentasMensual = filterDataByMonth(ventas).reduce(
    (total, venta) => total + venta.total,
    0
  );

  const totalVentasSemanal = filterDataByWeek(ventas).reduce(
    (total, venta) => total + venta.total,
    0
  );

  // Configuración de los datos de los gráficos
  const chartData = (label: string, data: number) => ({
    labels: [label],
    datasets: [
      {
        label: label,
        data: [data],
        backgroundColor: label.includes("Compras")
          ? "rgba(54, 162, 235, 0.6)"
          : "rgba(75, 192, 192, 0.6)",
      },
    ],
  });

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Inicio</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Gráfico de Compras Mensuales */}
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Compras Mensuales</h2>
          <Bar data={chartData("Compras Mensuales", totalComprasMensual)} />
        </div>

        {/* Gráfico de Compras Semanales */}
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Compras Semanales</h2>
          <Bar data={chartData("Compras Semanales", totalComprasSemanal)} />
        </div>

        {/* Gráfico de Ventas Mensuales */}
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Ventas Mensuales</h2>
          <Bar data={chartData("Ventas Mensuales", totalVentasMensual)} />
        </div>

        {/* Gráfico de Ventas Semanales */}
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Ventas Semanales</h2>
          <Bar data={chartData("Ventas Semanales", totalVentasSemanal)} />
        </div>
      </div>
    </div>
  );
}
