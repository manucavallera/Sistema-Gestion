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

  // Obtener el número de semana del año para una fecha dada
  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((date.getDay() + 1 + days) / 7);
  };

  // Agrupar datos por semana
  const calculateWeeklyTotals = (data: (Compra | Venta)[]) => {
    const totalsByWeek: { [key: string]: number } = {};
    data.forEach((item) => {
      const week = getWeekNumber(new Date(item.fecha));
      totalsByWeek[week] = (totalsByWeek[week] || 0) + item.total;
    });
    return totalsByWeek;
  };

  // Obtener datos semanales
  const weeklyCompras = calculateWeeklyTotals(compras);
  const weeklyVentas = calculateWeeklyTotals(ventas);

  // Datos para el gráfico de líneas
  const lineChartData = {
    labels: Object.keys(weeklyCompras).map((week) => `Semana ${week}`),
    datasets: [
      {
        label: "Compras Semanales",
        data: Object.values(weeklyCompras),
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        fill: true,
        tension: 0.4,
      },
      {
        label: "Ventas Semanales",
        data: Object.values(weeklyVentas),
        borderColor: "rgba(75, 192, 192, 0.8)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-3xl font-bold text-center mb-8'>Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Gráfico de Barras para Compras Mensuales */}
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>Compras Mensuales</h2>
          <Bar
            data={{
              labels: ["Compras Mensuales"],
              datasets: [
                {
                  label: "Compras Mensuales",
                  data: [
                    Object.values(weeklyCompras).reduce((a, b) => a + b, 0),
                  ],
                  backgroundColor: "rgba(54, 162, 235, 0.7)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        {/* Gráfico de Barras para Ventas Mensuales */}
        <div className='bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>Ventas Mensuales</h2>
          <Bar
            data={{
              labels: ["Ventas Mensuales"],
              datasets: [
                {
                  label: "Ventas Mensuales",
                  data: [
                    Object.values(weeklyVentas).reduce((a, b) => a + b, 0),
                  ],
                  backgroundColor: "rgba(75, 192, 192, 0.7)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>

        {/* Gráfico de Líneas para Compras y Ventas Semanales */}
        <div className='col-span-2 bg-white p-6 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-4 text-center'>
            Compras y Ventas Semanales
          </h2>
          <Line
            data={lineChartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" as const },
              },
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
