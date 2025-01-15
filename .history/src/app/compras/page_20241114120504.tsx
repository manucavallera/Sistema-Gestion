"use client";
import { useEffect, useState } from "react";

interface Proveedor {
  id: number;
  razonSocial: string;
  saldo: number; // Agregar saldo al proveedor
}

interface Compra {
  id: number;
  fecha: string; // Mantener como string para manejar el formato ISO
  total: number;
  proveedorId: number;
  proveedor: Proveedor | null; // Proveedor puede ser nulo
  metodoPago: string; // Agregar método de pago
  estado: string; // Agregar estado a la compra
}

const ComprasPage = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nuevaCompra, setNuevaCompra] = useState<Compra>({
    id: 0,
    fecha: new Date().toISOString().split("T")[0],
    total: 0,
    proveedorId: 0,
    proveedor: null,
    metodoPago: "", // Inicializar el método de pago
    estado: "Por Pagar", // Inicializar el estado por defecto
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompras = async () => {
      setLoading(true);
      const response = await fetch("/api/compras");
      if (!response.ok) {
        setError("Error al obtener las compras");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setCompras(data);
      setError(null); // Resetear error
      setLoading(false);
    };

    const fetchProveedores = async () => {
      setLoading(true);
      const response = await fetch("/api/proveedores");
      if (!response.ok) {
        setError("Error al obtener los proveedores");
        setLoading(false);
        return;
      }
      const data = await response.json();
      setProveedores(data);
      setError(null); // Resetear error
      setLoading(false);
    };

    fetchCompras();
    fetchProveedores();
  }, []);

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
    } else {
      setNuevaCompra((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/compras/${nuevaCompra.id}` : "/api/compras";

    // Validación de fecha
    const fecha = new Date(nuevaCompra.fecha);
    if (isNaN(fecha.getTime())) {
      alert("Fecha inválida. Por favor, selecciona una fecha válida.");
      return;
    }

    if (!nuevaCompra.proveedor || !nuevaCompra.proveedor.razonSocial) {
      alert("Por favor, selecciona un proveedor válido.");
      return;
    }

    // Validación de saldo
    const selectedProveedor = proveedores.find(
      (prov) => prov.id === nuevaCompra.proveedorId
    );
    if (
      nuevaCompra.estado === "Pagado" &&
      selectedProveedor &&
      selectedProveedor.saldo < nuevaCompra.total
    ) {
      alert(
        "El saldo del proveedor no es suficiente para registrar esta compra como 'Pagado'."
      );
      return;
    }

    // Validación de total
    if (nuevaCompra.total <= 0) {
      alert("El total debe ser un número positivo.");
      return;
    }

    const compraData = {
      fecha: fecha.toISOString(),
      total: nuevaCompra.total,
      proveedorId: nuevaCompra.proveedorId,
      metodoPago: nuevaCompra.metodoPago,
      estado: nuevaCompra.estado, // Incluir el estado en la solicitud
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compraData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${errorData.message || "Error desconocido"}`);
      }

      const compraCreada = await response.json();
      if (isEditing) {
        setCompras((prev) =>
          prev.map((compra) =>
            compra.id === compraCreada.id ? compraCreada : compra
          )
        );
      } else {
        setCompras((prev) => [...prev, compraCreada]);
      }
      resetForm();
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      alert(error.message);
    }
  };

  const resetForm = () => {
    setNuevaCompra({
      id: 0,
      fecha: new Date().toISOString().split("T")[0],
      total: 0,
      proveedorId: 0,
      proveedor: null,
      metodoPago: "",
      estado: "Por Pagar", // Reiniciar el estado por defecto
    });
    setIsEditing(false);
  };

  const handleEdit = (compra: Compra) => {
    setNuevaCompra({
      ...compra,
      fecha: new Date(compra.fecha).toISOString().split("T")[0], // Asegurarse de que la fecha esté en el formato correcto
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/compras/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setCompras((prev) => prev.filter((compra) => compra.id !== id));
    } else {
      console.error("Error al eliminar la compra");
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-4'>Compras</h1>
      {error && <div className='text-red-500'>{error}</div>}
      {loading && <div className='text-blue-500'>Cargando...</div>}
      <form
        onSubmit={handleSubmit}
        className='mb-6 bg-white shadow-md rounded px-8 pt-6 pb-8'
      >
        <h2 className='text-xl font-semibold mb-4'>
          {isEditing ? "Editar Compra" : "Agregar Nueva Compra"}
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='date'
            name='fecha'
            value={nuevaCompra.fecha}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <input
            type='number'
            name='total'
            placeholder='Total'
            value={nuevaCompra.total}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          />
          <select
            name='proveedorId'
            value={nuevaCompra.proveedor?.id || ""}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          >
            <option value='' disabled>
              Seleccionar proveedor
            </option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.razonSocial} - Saldo: {proveedor.saldo}
              </option>
            ))}
          </select>
          <select
            name='metodoPago'
            value={nuevaCompra.metodoPago}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          >
            <option value='' disabled>
              Seleccionar método de pago
            </option>
            <option value='EFECTIVO'>Efectivo</option>
            <option value='TARJETA'>Tarjeta</option>
            <option value='TRANSFERENCIA'>Transferencia</option>
            <option value='CHEQUE'>Cheque</option>
          </select>
          <select
            name='estado'
            value={nuevaCompra.estado}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          >
            <option value='Por Pagar'>Por Pagar</option>
            <option value='Pagado'>Pagado</option>
            <option value='Cancelado'>Cancelado</option>
          </select>
        </div>
        <button
          type='submit'
          className='mt-4 bg-blue-500 text-white rounded p-2'
        >
          {isEditing ? "Actualizar Compra" : "Registrar Compra"}
        </button>
      </form>
      <table className='min-w-full bg-white border border-gray-300'>
        <thead>
          <tr>
            <th className='border border-gray-300 p-2'>Fecha</th>
            <th className='border border-gray-300 p-2'>Total</th>
            <th className='border border-gray-300 p-2'>Proveedor</th>
            <th className='border border-gray-300 p-2'>Método de Pago</th>
            <th className='border border-gray-300 p-2'>Estado</th>
            <th className='border border-gray-300 p-2'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((compra) => (
            <tr key={compra.id}>
              <td className='border border-gray-300 p-2'>
                {new Date(compra.fecha).toLocaleDateString("es-ES")}
              </td>
              <td className='border border-gray-300 p-2'>{compra.total}</td>
              <td className='border border-gray-300 p-2'>
                {compra.proveedor
                  ? `${compra.proveedor.razonSocial} - Saldo: ${compra.proveedor.saldo}`
                  : "Proveedor no disponible"}
              </td>
              <td className='border border-gray-300 p-2'>
                {compra.metodoPago || "Método no disponible"}
              </td>
              <td className='border border-gray-300 p-2'>{compra.estado}</td>
              <td className='border border-gray-300 p-2'>
                <button
                  onClick={() => handleEdit(compra)}
                  className='text-blue-500'
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(compra.id)}
                  className='text-red-500 ml-2'
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
