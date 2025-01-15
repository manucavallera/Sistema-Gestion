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

  const getWeekNumber = (date: Date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((date.getDay() + 1 + days) / 7);
  };

  const calculateWeeklyTotals = (data: (Compra | Venta)[]) => {
    const totalsByWeek: { [key: string]: number } = {};
    data.forEach((item) => {
      const week = getWeekNumber(new Date(item.fecha));
      totalsByWeek[week] = (totalsByWeek[week] || 0) + item.total;
    });
    return totalsByWeek;
  };

  const weeklyCompras = calculateWeeklyTotals(compras);
  const weeklyVentas = calculateWeeklyTotals(ventas);

  const lineChartData = {
    labels: Object.keys(weeklyCompras).map((week) => `Semana ${week}`),
    datasets: [
      {
        label: "Compras Semanales",
        data: Object.values(weeklyCompras),
        borderColor: "rgba(54, 162, 235, 0.8)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.4, // suaviza las líneas
      },
      {
        label: "Ventas Semanales",
        data: Object.values(weeklyVentas),
        borderColor: "rgba(75, 192, 192, 0.8)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0,0,0,0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        cornerRadius: 5,
        titleFont: { weight: "bold" },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Semanas",
          color: "#333",
          font: {
            size: 16,
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Totales ($)",
          color: "#333",
          font: {
            size: 16,
          },
        },
      },
    },
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Inicio</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Compras Mensuales</h2>
          <Bar
            data={{
              labels: ["Compras Mensuales"],
              datasets: [
                {
                  label: "Compras Mensuales",
                  data: [
                    Object.values(weeklyCompras).reduce((a, b) => a + b, 0),
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
                  data: [
                    Object.values(weeklyVentas).reduce((a, b) => a + b, 0),
                  ],
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
          />
        </div>

        <div className='col-span-2 bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>
            Compras y Ventas Semanales
          </h2>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
}
