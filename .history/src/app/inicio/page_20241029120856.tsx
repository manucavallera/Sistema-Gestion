"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

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
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      const [comprasRes, ventasRes] = await Promise.all([
        fetch("/api/compras"),
        fetch("/api/ventas"),
      ]);
      const comprasData = await comprasRes.json();
      const ventasData = await ventasRes.json();

      setCompras(comprasData);
      setVentas(ventasData);
      setLoading(false); // Actualiza el estado de carga
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Mensaje de carga
  }

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

  const areaChartData = Object.keys(weeklyCompras).map((week) => ({
    week: `Semana ${week}`,
    compras: weeklyCompras[week],
    ventas: weeklyVentas[week] || 0,
  }));

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Inicio</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Compras Mensuales</h2>
          <div style={{ width: "100%", height: 300 }}>
            <BarChart
              data={compras.map((compra) => ({
                name: compra.fecha,
                total: compra.total,
              }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='total' fill='rgba(54, 162, 235, 0.6)' />
            </BarChart>
          </div>
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Ventas Mensuales</h2>
          <div style={{ width: "100%", height: 300 }}>
            <BarChart
              data={ventas.map((venta) => ({
                name: venta.fecha,
                total: venta.total,
              }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='total' fill='rgba(75, 192, 192, 0.6)' />
            </BarChart>
          </div>
        </div>

        <div className='col-span-2 bg-white p-4 rounded-lg shadow-lg min-h-[300px]'>
          <h2 className='text-xl font-semibold mb-2'>
            Compras y Ventas Semanales
          </h2>
          <div style={{ width: "100%", height: 300 }}>
            <LineChart data={areaChartData}>
              <XAxis dataKey='week' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='compras'
                stroke='rgba(54, 162, 235, 0.8)'
              />
              <Line
                type='monotone'
                dataKey='ventas'
                stroke='rgba(75, 192, 192, 0.8)'
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}
