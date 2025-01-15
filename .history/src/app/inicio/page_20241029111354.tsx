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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await fetch("/api/compras");
        if (!response.ok) throw new Error("Error al obtener compras");
        const data = await response.json();
        setCompras(data);
      } catch (err) {
        setError("Error al cargar los datos de compras");
      }
    };

    const fetchVentas = async () => {
      try {
        const response = await fetch("/api/ventas");
        if (!response.ok) throw new Error("Error al obtener ventas");
        const data = await response.json();
        setVentas(data);
      } catch (err) {
        setError("Error al cargar los datos de ventas");
      }
    };

    fetchCompras();
    fetchVentas();
  }, []);

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

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 100, // Ajusta el valor según tu rango de datos
        },
      },
    },
  };

  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Inicio</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Compras Mensuales</h2>
          <Bar
            data={chartData("Compras Mensuales", totalComprasMensual)}
            options={chartOptions}
          />
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Compras Semanales</h2>
          <Bar
            data={chartData("Compras Semanales", totalComprasSemanal)}
            options={chartOptions}
          />
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Ventas Mensuales</h2>
          <Bar
            data={chartData("Ventas Mensuales", totalVentasMensual)}
            options={chartOptions}
          />
        </div>

        <div className='bg-white p-4 rounded-lg shadow-lg'>
          <h2 className='text-xl font-semibold mb-2'>Ventas Semanales</h2>
          <Bar
            data={chartData("Ventas Semanales", totalVentasSemanal)}
            options={chartOptions}
          />
        </div>
      </div>
    </div>
  );
}
