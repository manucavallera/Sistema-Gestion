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

  // Datos de prueba (comentar después de probar)
  const lineChartData = {
    labels: Object.keys(weeklyCompras).map((week) => `Semana ${week}`),
    datasets: [
      {
        label: "Compras Semanales",
        data: Object.values(weeklyCompras),
        borderColor: "rgba(54, 162, 235, 0.6)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        fill: true,
      },
      {
        label: "Ventas Semanales",
        data: Object.values(weeklyVentas),
        borderColor: "rgba(75, 192, 192, 0.6)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
      },
    ],
  };

  // Datos de prueba para verificar si el gráfico se muestra
  const testLineChartData = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: "Compras Semanales",
        data: [1000, 1500, 2000, 2500],
        borderColor: "rgba(54, 162, 235, 0.6)",
        backgroundColor: "rgba(54, 162, 235, 0.1)",
        fill: true,
      },
      {
        label: "Ventas Semanales",
        data: [800, 1200, 1600, 2200],
        borderColor: "rgba(75, 192, 192, 0.6)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
      },
    ],
  };

  // Mostrar datos de prueba
  console.log("Datos de Compras Semanales:", weeklyCompras);
  console.log("Datos de Ventas Semanales:", weeklyVentas);
  console.log("lineChartData:", lineChartData);

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

        {/* Gráfico de líneas para Compras y Ventas Semanales */}
        <div className='col-span-2 bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>
            Compras y Ventas Semanales
          </h2>
          <Line data={lineChartData} />
          {/* Usa testLineChartData para ver si el gráfico se muestra correctamente */}
          {/* <Line data={testLineChartData} /> */}
        </div>
      </div>
    </div>
  );
}
