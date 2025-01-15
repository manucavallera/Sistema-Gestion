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
        console.log("Compras cargadas:", comprasResponse); // Verifica el contenido
        setCompras(
          comprasResponse.filter(
            (compra: Compra) =>
              compra && compra.id && compra.proveedorId && compra.total && compra.fecha
          )
        ); // Filtrar compras indefinidas
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
    if (nuevaCompra.proveedorId > 0 && nuevaCompra.total > 0 && nuevaCompra.fecha) {
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
      setLoading(false );
  };

  // Renderizar el componente
  return (
    <div>
      <h1>Compras</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={(e) => { e.preventDefault(); guardarCompra(); }}>
        <input
          type="number"
          placeholder="Proveedor ID"
          value={nuevaCompra.proveedorId}
          onChange={(e) => setNuevaCompra({ ...nuevaCompra, proveedorId: Number(e.target.value) })}
        />
        <input
          type="number"
          placeholder="Total"
          value={nuevaCompra.total}
          onChange={(e) => setNuevaCompra({ ...nuevaCompra, total: Number(e.target.value) })}
        />
        <input
          type="date"
          placeholder="Fecha"
          value={nuevaCompra.fecha}
          onChange={(e) => setNuevaCompra({ ...nuevaCompra, fecha: e.target.value })}
        />
        <button type="submit">{compraEditando ? 'Actualizar' : 'Agregar'} Compra</button>
      </form>
      <ul>
        {compras.map((compra) => (
          <li key={compra.id}>
            {`Proveedor ID: ${compra.proveedorId}, Total: ${compra.total}, Fecha: ${compra.fecha}`}
            <button onClick={() => setCompraEditando(compra)}>Editar</button>
            <button onClick={() => eliminarCompra(compra.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComprasPage;