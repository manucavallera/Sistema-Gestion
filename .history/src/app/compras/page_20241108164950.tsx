"use client";
import React, { useState, useEffect } from "react";
import {
  getAllPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from "../../services/purchasesService";
import axios from "axios";

interface Compra {
  id: number;
  proveedorId: number;
  total: number;
  fecha: string;
}

const ComprasPage: React.FC = (): JSX.Element => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState<Omit<Compra, "id">>({
    proveedorId: 0,
    total: 0,
    fecha: "",
  });
  const [compraEditando, setCompraEditando] = useState<Compra | null>(null);
  const [proveedores, setProveedores] = useState<
    { id: number; razonSocial: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const cargarComprasYProveedores = async () => {
      setLoading(true);
      try {
        const [comprasResponse, proveedoresResponse] = await Promise.all([
          getAllPurchases(),
          axios.get("/api/proveedores"),
        ]);
        setCompras(
          comprasResponse.filter(
            (compra: Compra) =>
              compra &&
              compra.id &&
              compra.proveedorId &&
              compra.total &&
              compra.fecha
          )
        );
        setProveedores(proveedoresResponse.data);
      } catch (err) {
        setError("Error al cargar las compras o los proveedores");
      } finally {
        setLoading(false);
      }
    };
    cargarComprasYProveedores();
  }, []);

  const guardarCompra = async () => {
    if (
      nuevaCompra.proveedorId > 0 &&
      nuevaCompra.total > 0 &&
      nuevaCompra.fecha
    ) {
      setError(null);
      setLoading(true);
      try {
        if (compraEditando) {
          const response = await updatePurchase(compraEditando.id, nuevaCompra);
          const updatedCompra = response.data;
          setCompras(
            compras.map((compra) =>
              compra.id === updatedCompra.id ? updatedCompra : compra
            )
          );
        } else {
          const response = await createPurchase(nuevaCompra);
          const compraCreada = response.data;
          setCompras([...compras, compraCreada]);
        }

        setNuevaCompra({ proveedorId: 0, total: 0, fecha: "" });
        setCompraEditando(null);
      } catch (err: any) {
        setError(err.response?.data?.error || "Error al guardar la compra");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Por favor, completa todos los campos correctamente.");
    }
  };

  const eliminarCompra = async (id: number) => {
    setLoading(true);
    try {
      await deletePurchase(id);
      setCompras(compras.filter((compra) => compra.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al eliminar la compra");
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (compra: Compra) => {
    setCompraEditando(compra);
    setNuevaCompra({
      proveedorId: compra.proveedorId,
      total: compra.total,
      fecha: compra.fecha,
    });
  };

  return (
    <div className='max-w-2xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white'>
      <h1 className='text-2xl font-bold text-center text-gray-800'>Compras</h1>
      {loading && <p className='text-center text-gray-500'>Cargando...</p>}
      {error && <p className='text-red-500 text-center'>{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          guardarCompra();
        }}
        className='flex flex-col space-y-4 mb-6'
      >
        <input
          type='number'
          placeholder='Proveedor ID'
          value={nuevaCompra.proveedorId}
          onChange={(e) =>
            setNuevaCompra({
              ...nuevaCompra,
              proveedorId: Number(e.target.value),
            })
          }
          className='p-2 border border-gray-300 rounded'
        />
        <input
          type='number'
          placeholder='Total'
          value={nuevaCompra.total}
          onChange={(e) =>
            setNuevaCompra({ ...nuevaCompra, total: Number(e.target.value) })
          }
          className='p-2 border border-gray-300 rounded'
        />
        <input
          type='date'
          placeholder='Fecha'
          value={nuevaCompra.fecha}
          onChange={(e) =>
            setNuevaCompra({ ...nuevaCompra, fecha: e.target.value })
          }
          className='p-2 border border-gray-300 rounded'
        />
        <button
          type='submit'
          className='p-2 bg-green-500 text-white rounded hover:bg-green-600'
        >
          {compraEditando ? "Actualizar" : "Agregar"} Compra
        </button>
      </form>
      <ul className='space-y-2'>
        {compras.map((compra) => (
          <li
            key={compra.id}
            className='flex justify-between items-center p-2 border border-gray-300 rounded bg-gray-50'
          >
            {`Proveedor ID: ${compra.proveedorId}, Total: ${compra.total}, Fecha: ${compra.fecha}`}
            <div>
              <button
                onClick={() => iniciarEdicion(compra)}
                className='bg-blue-500 text-white rounded px-2 py-1 hover:bg-blue-600 mr-2'
              >
                Editar
              </button>
              <button
                onClick={() => eliminarCompra(compra.id)}
                className='bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600'
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComprasPage;
