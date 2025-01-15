"use client";
import React, { useState, useEffect } from "react";
import {
  getAllPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
} from "../../services/purchasesService";
import axios from "axios";

// Definir el tipo para una compra
interface Compra {
  id: number;
  proveedorId: number;
  total: number;
  fecha: string;
}

// Declarar el tipo de retorno del componente
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

  // Cargar compras y proveedores desde la API al montar el componente
  useEffect(() => {
    const cargarComprasYProveedores = async () => {
      setLoading(true);
      try {
        const [comprasResponse, proveedoresResponse] = await Promise.all([
          getAllPurchases(),
          axios.get("/api/proveedores"),
        ]);
        setCompras(comprasResponse);
        setProveedores(proveedoresResponse.data);
      } catch (err) {
        setError("Error al cargar las compras o los proveedores");
      } finally {
        setLoading(false);
      }
    };
    cargarComprasYProveedores();
  }, []);

  // Función para guardar una compra nueva o editada
  const guardarCompra = async () => {
    if (nuevaCompra.proveedorId && nuevaCompra.total > 0 && nuevaCompra.fecha) {
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

  // Función para eliminar una compra
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

  // Iniciar la edición de una compra
  const iniciarEdicion = (compra: Compra) => {
    setNuevaCompra(compra);
    setCompraEditando(compra);
    setError(null);
  };

  return (
    <div className='p-4 bg-background'>
      <h1 className='text-2xl font-bold mb-4'>Lista de Compras</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {loading && <div className='text-blue-500 mb-4'>Cargando...</div>}
      <div className='mb-4'>
        <select
          value={nuevaCompra.proveedorId}
          onChange={(e) =>
            setNuevaCompra({ ...nuevaCompra, proveedorId: +e.target.value })
          }
          className='border border-gray-300 p-2 mr-2'
        >
          <option value={0}>Seleccionar Proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>
              {proveedor.razonSocial}
            </option>
          ))}
        </select>
        <input
          type='number'
          value={nuevaCompra.total}
          onChange={(e) =>
            setNuevaCompra({ ...nuevaCompra, total: +e.target.value })
          }
          placeholder='Total'
          className='border border-gray-300 p-2 mr-2'
        />
        <input
          type='date'
          value={nuevaCompra.fecha}
          onChange={(e) =>
            setNuevaCompra({ ...nuevaCompra, fecha: e.target.value })
          }
          className='border border-gray-300 p-2 mr-2'
        />
        <button onClick={guardarCompra} className='bg-blue-500 text-white p-2'>
          {compraEditando ? "Actualizar Compra" : "Agregar Compra"}
        </button>
      </div>
      <table className='min-w-full border-collapse border border-gray-300'>
        <thead>
          <tr>
            <th className='border border-gray-300 p-2'>Proveedor</th>
            <th className='border border-gray-300 p-2'>Total</th>
            <th className='border border-gray-300 p-2'>Fecha</th>
            <th className='border border-gray-300 p-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id}>
              <td className='border border-gray-300 p-2'>
                {(compra &&
                  proveedores.find(
                    (proveedor) => proveedor.id === compra.proveedorId
                  )?.razonSocial) ||
                  "Proveedor no encontrado"}
              </td>
              <td className='border border-gray-300 p-2'>
                {compra ? compra.total : "Total no disponible"}
              </td>
              <td className='border border-gray-300 p-2'>
                {compra ? compra.fecha : "Fecha no disponible"}
              </td>
              <td className='border border-gray-300 p-2'>
                <button
                  onClick={() => iniciarEdicion(compra)}
                  className='bg-yellow-500 text-white p-1 mr-1'
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCompra(compra.id)}
                  className='bg-red-500 text-white p-1'
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComprasPage;
