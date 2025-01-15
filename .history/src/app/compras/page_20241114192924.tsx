"use client";
import { useEffect, useState, useCallback } from "react";

interface Proveedor {
  id: number;
  razonSocial: string;
  saldo: number;
}

interface Cheque {
  id: number;
  proveedorId: number;
  monto: number;
}

interface Compra {
  id: number;
  fecha: string;
  total: number;
  proveedorId: number;
  proveedor: Proveedor | null;
  metodoPago: string;
  estado: string;
  chequeId?: number | null; // Añadir chequeId como opcional
}

const ComprasPage = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState<Compra>({
    id: 0,
    fecha: new Date().toISOString().split("T")[0],
    total: 0,
    proveedorId: 0,
    proveedor: null,
    metodoPago: "",
    estado: "PENDIENTE",
  });
  const [selectedChequeId, setSelectedChequeId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchCompras = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/compras");
      if (!response.ok) throw new Error("Error al obtener las compras");
      const data = await response.json();
      setCompras(data);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProveedores = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/proveedores");
      if (!response.ok) throw new Error("Error al obtener los proveedores");
      const data = await response.json();
      setProveedores(data);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCheques = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cheques");
      if (!response.ok) throw new Error("Error al obtener los cheques");
      const data = await response.json();
      setCheques(data);
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompras();
    fetchProveedores();
    fetchCheques();
  }, [fetchCompras, fetchProveedores, fetchCheques]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "proveedorId") {
      const selectedProveedor = proveedores.find(
        (prov) => prov.id === Number(value)
      );
      setNuevaCompra((prev) => ({
        ...prev,
        proveedorId: Number(value),
        proveedor: selectedProveedor || null,
      }));
      setSelectedChequeId(null); // Resetear el cheque seleccionado al cambiar el proveedor
    } else if (name === "total") {
      setNuevaCompra((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === "metodoPago") {
      setNuevaCompra((prev) => ({ ...prev, [name]: value })); // Asegúrate de que esto esté correcto
      setSelectedChequeId(null); // Resetear el cheque seleccionado al cambiar el método de pago
    } else {
      setNuevaCompra((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/compras/${nuevaCompra.id}` : "/api/compras";

    const fecha = new Date(nuevaCompra.fecha);
    if (isNaN(fecha.getTime())) {
      alert("Fecha inválida. Por favor, introduce una fecha válida.");
      return;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...nuevaCompra,
          chequeId: selectedChequeId, // Incluir chequeId en la solicitud
        }),
      });

      if (!response.ok) throw new Error("Error al guardar la compra");
      const data = await response.json();
      setSuccessMessage("Compra guardada exitosamente");
      setCompras((prev) => [...prev, data]);
      setNuevaCompra({
        id: 0,
        fecha: new Date().toISOString().split("T")[0],
        total: 0,
        proveedorId: 0,
        proveedor: null,
        metodoPago: "",
        estado: "PENDIENTE",
      });
      setSelectedChequeId(null);
      setIsEditing(false);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleEdit = (compra: Compra) => {
    setNuevaCompra(compra);
    setSelectedChequeId(compra.chequeId || null);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta compra?")) {
      try {
        const response = await fetch(`/api/compras/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Error al eliminar la compra");
        setCompras((prev) => prev.filter((compra) => compra.id !== id));
        setSuccessMessage("Compra eliminada exitosamente");
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  return (
    <div>
      <h1>Gestión de Compras</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type='date'
          name='fecha'
          value={nuevaCompra.fecha}
          onChange={handleChange}
        />
        <select
          name='proveedorId'
          value={nuevaCompra.proveedorId}
          onChange={handleChange}
        >
          <option value=''>Selecciona un proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>
              {proveedor.razonSocial}
            </option>
          ))}
        </select>
        <input
          type='number'
          name='total'
          value={nuevaCompra.total}
          onChange={handleChange}
        />
        <select
          name='metodoPago'
          value={nuevaCompra.metodoPago}
          onChange={handleChange}
        >
          <option value=''>Selecciona un método de pago</option>
          <option value='efectivo'>Efectivo</option>
          <option value='cheque'>Cheque</option>
        </select>
        {nuevaCompra.metodoPago === "cheque" && (
          <select
            value={selectedChequeId || ""}
            onChange={(e) => setSelectedChequeId(Number(e.target.value))}
          >
            <option value=''>Selecciona un cheque</option>
            {cheques.map((cheque) => (
              <option key={cheque.id} value={cheque.id}>
                Cheque {cheque.id} - Monto: {cheque.monto}
              </option>
            ))}
          </select>
        )}
        <button type='submit'>{isEditing ? "Actualizar" : "Agregar"}</button>
      </form>
      <ul>
        {compras.map((compra) => (
          <li key={compra.id}>
            {compra.fecha} - {compra.proveedor?.razonSocial} - Total:{" "}
            {compra.total} - Método de Pago: {compra.metodoPago}
            <button onClick={() => handleEdit(compra)}>Editar</button>
            <button onClick={() => handleDelete(compra.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComprasPage;
