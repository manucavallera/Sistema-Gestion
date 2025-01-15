"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

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

  // Preparar datos para el gráfico de barras
  const barChartData = Object.keys(weeklyCompras).map((week) => ({
    week: `Semana ${week}`,
    compras: weeklyCompras[week],
    ventas: weeklyVentas[week] || 0,
  }));

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Inicio</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Gráfico de Compras Mensuales */}
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Compras Mensuales</h2>
          <BarChart
            width={400}
            height={300}
            data={[
              {
                name: "Compras Mensuales",
                total: Object.values(weeklyCompras).reduce((a, b) => a + b, 0),
              },
            ]}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='total' fill='rgba(54, 162, 235, 0.6)' />
          </BarChart>
        </div>

        {/* Gráfico de Ventas Mensuales */}
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Ventas Mensuales</h2>
          <BarChart
            width={400}
            height={300}
            data={[
              {
                name: "Ventas Mensuales",
                total: Object.values(weeklyVentas).reduce((a, b) => a + b, 0),
              },
            ]}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Bar dataKey='total' fill='rgba(75, 192, 192, 0.6)' />
          </BarChart>
        </div>

        {/* Gráfico de Compras y Ventas Semanales */}
        <div className='col-span-2 bg-white p-4 rounded-lg shadow-lg min-h-[300px]'>
          <h2 className='text-xl font-semibold mb-2'>
            Compras y Ventas Semanales
          </h2>
          <BarChart width={600} height={300} data={barChartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='week' />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey='compras'
              fill='rgba(54, 162, 235, 0.6)'
              name='Compras'
            />
            <Bar
              dataKey='ventas'
              fill='rgba(75, 192, 192, 0.6)'
              name='Ventas'
            />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
