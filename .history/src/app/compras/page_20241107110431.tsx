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
  monto: number;
  fecha: string;
}

// Declarar el tipo de retorno del componente
const ComprasPage: React.FC = (): JSX.Element => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState<Omit<Compra, "id">>({
    proveedorId: 0,
    monto: 0,
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
    if (nuevaCompra.proveedorId && nuevaCompra.monto > 0 && nuevaCompra.fecha) {
      setError(null);
      setLoading(true);
      try {
        if (compraEditando) {
          // Editar compra existente
          const response = await updatePurchase(compraEditando.id, nuevaCompra);
          const updatedCompra = response.data;
          setCompras(
            compras.map((compra) =>
              compra.id === updatedCompra.id ? updatedCompra : compra
            )
          );
        } else {
          // Agregar nueva compra
          const response = await createPurchase(nuevaCompra);
          const compraCreada = response.data;
          setCompras([...compras, compraCreada]);
        }

        // Reiniciar el formulario
        setNuevaCompra({ proveedorId: 0, monto: 0, fecha: "" });
        setCompraEditando(null);
      } catch (err) {
        setError("Error al guardar la compra");
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
    } catch (err) {
      setError("Error al eliminar la compra");
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
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
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
          placeholder='Monto'
          value={nuevaCompra.monto}
          onChange={(e) =>
            setNuevaCompra({ ...nuevaCompra, monto: +e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <input
          type='date'
          placeholder='Fecha'
          value={nuevaCompra.fecha}
          onChange={(e) =>
            setNuevaCompra({ ...nuevaCompra, fecha: e.target.value })
          }
          className='border border-gray-300 p-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <button
          onClick={guardarCompra}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md'
        >
          {compraEditando ? "Editar" : "Agregar"}
        </button>
      </div>
      <table className='min-w-full border border-gray-200'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='px-4 py-2'>Proveedor</th>
            <th className='px-4 py-2'>Monto</th>
            <th className='px-4 py-2'>Fecha</th>
            <th className='px-4 py-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id} className='hover:bg-gray-50'>
              <td className='px-4 py-2'>
                {
                  proveedores.find(
                    (proveedor) => proveedor.id === compra.proveedorId
                  )?.razonSocial
                }
              </td>
              <td className='px-4 py-2'>${compra.monto}</td>
              <td className='px-4 py-2'>{compra.fecha}</td>
              <td className='px-4 py-2'>
                <button
                  onClick={() => iniciarEdicion(compra)}
                  className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md'
                >
                  Editar
                </button>
                <button
                  onClick={() => eliminarCompra(compra.id)}
                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md'
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
