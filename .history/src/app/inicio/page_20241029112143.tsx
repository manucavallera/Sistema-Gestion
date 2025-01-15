"use client";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar componentes de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

  // Calcular totales diarios
  const calculateDailyTotals = (data: (Compra | Venta)[]) => {
    const totalsByDate: { [key: string]: number } = {};
    data.forEach((item) => {
      const date = item.fecha.slice(0, 10); // Obtener solo la fecha
      totalsByDate[date] = (totalsByDate[date] || 0) + item.total;
    });
    return totalsByDate;
  };

  // Obtener datos para los gráficos de líneas
  const dailyCompras = calculateDailyTotals(compras);
  const dailyVentas = calculateDailyTotals(ventas);

  // Formato para ChartJS
  const lineChartData = {
    labels: Object.keys(dailyCompras),
    datasets: [
      {
        label: "Compras",
        data: Object.values(dailyCompras),
        borderColor: "rgba(54, 162, 235, 0.6)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        fill: true,
      },
      {
        label: "Ventas",
        data: Object.values(dailyVentas),
        borderColor: "rgba(75, 192, 192, 0.6)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
      },
    ],
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Inicio</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Gráficos de Barras para Compras y Ventas */}
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Compras Mensuales</h2>
          <Bar
            data={{
              labels: ["Compras Mensuales"],
              datasets: [
                {
                  label: "Compras Mensuales",
                  data: [
                    Object.values(dailyCompras).reduce((a, b) => a + b, 0),
                  ],
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                },
              ],
            }}
          />
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Ventas Mensuales</h2>
          <Bar
            data={{
              labels: ["Ventas Mensuales"],
              datasets: [
                {
                  label: "Ventas Mensuales",
                  data: [Object.values(dailyVentas).reduce((a, b) => a + b, 0)],
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
          />
        </div>

        {/* Gráfico de líneas para Compras y Ventas diarias */}
        <div className='col-span-2 bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>
            Compras y Ventas Diarias
          </h2>
          <Line data={lineChartData} />
        </div>
      </div>
    </div>
  );
}
