"use client"; // Esto es necesario para que el componente sea un componente del lado del cliente

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
  clienteId: number; // Suponiendo que cada cheque tiene un cliente asociado
}

interface Cliente {
  id: number;
  razonSocial: string;
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
  const [clientes, setClientes] = useState<Cliente[]>([]);
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
  const [detalleCheque, setDetalleCheque] = useState<Cheque | null>(null);
  const [razonSocialProveedor, setRazonSocialProveedor] = useState<string | null>(null);
  const [razonSocialCliente, setRazonSocialCliente] = useState<string | null>(null);
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
      // Ordenar las compras por fecha de más reciente a más antigua
      const comprasOrdenadas = data.sort(
        (a: Compra, b: Compra) =>
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setCompras(comprasOrdenadas);
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

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/clientes");
      if (!response.ok) throw new Error("Error al obtener los clientes");
      const data = await response.json();
      setClientes(data);
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
    fetchClientes();
  }, [fetchCompras, fetchProveedores, fetchCheques, fetchClientes]);

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
      setSelectedChequeId(null);
      setDetalleCheque(null);
      setRazonSocialProveedor(null);
      setRazonSocialCliente(null);
    } else if (name === "total") {
      setNuevaCompra((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === "metodoPago") {
      setNuevaCompra((prev) => ({ ...prev, [name]: value }));
      setSelectedChequeId(null);
      setDetalleCheque(null);
      setRazonSocialProveedor(null);
      setRazonSocialCliente(null);
    } else {
      setNuevaCompra((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChequeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chequeId = Number(e.target.value);
    setSelectedChequeId(chequeId);
    const chequeSeleccionado = cheques.find((cheque) => cheque.id === chequeId);
    setDetalleCheque(chequeSeleccionado || null);

    if (chequeSeleccionado) {
      const proveedorSeleccionado = proveedores.find(
        (prov) => prov.id === chequeSeleccionado.proveedorId
      );
      setRazonSocialProveedor(
        proveedorSeleccionado ? proveedorSeleccionado.razonSocial : null
      );

      const clienteSeleccionado = clientes.find(
        (cliente) => cliente.id === chequeSeleccionado.clienteId
      );
      setRazonSocialCliente(
        clienteSeleccionado ? clienteSeleccionado.razonSocial : null
      );
    } else {
      setRazonSocialProveedor(null);
      setRazonSocialCliente(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/compras/${nuevaCompra.id}` : "/api/compras";

    const fecha = new Date(nuevaCompra.fecha);
    if (isNaN(fecha.getTime())) {
      alert("Fecha inválida. Por favor, selecciona una fecha válida.");
      return;
    }

    if (!nuevaCompra.proveedor || !nuevaCompra.proveedor.razonSocial) {
      alert("Por favor, selecciona un proveedor válido.");
      return;
    }

    const selectedProveedor = proveedores.find(
      (prov) => prov.id === nuevaCompra.proveedorId
    );
    if (
      nuevaCompra.estado === "COMPLETADO" &&
      selectedProveedor &&
      selectedProveedor.saldo < nuevaCompra.total
    ) {
      alert(
        "El saldo del proveedor no es suficiente para registrar esta compra como 'COMPLETADO'."
      );
      return;
    }

    if (nuevaCompra.total <= 0) {
      alert("El total debe ser un número positivo.");
      return;
    }

    const compraData = {
      fecha: fecha.toISOString(),
      total: nuevaCompra.total,
      proveedorId: nuevaCompra.proveedorId,
      metodoPago: nuevaCompra.metodoPago,
      estado: nuevaCompra.estado,
      chequeId: selectedChequeId,
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

      const { compra: compraCreada } = await response.json();
      // Actualizar el saldo del proveedor en el estado
      setProveedores((prev) =>
        prev.map((prov) => {
          if (prov.id === compraCreada.proveedorId) {
            let nuevoSaldo = prov.saldo;

            if (compraCreada.estado === "COMPLETADO" || compraCreada.estado === "CANCELADO") {
              nuevoSaldo -= compraCreada.total; // Resta para COMPLETADO o CANCELADO
            } else if (compraCreada.estado === "PENDIENTE") {
              nuevoSaldo += compraCreada.total; // Suma para PENDIENTE
            }

            return { ...prov, saldo: nuevoSaldo };
 }
          return prov;
        })
      );

      // Actualizar la lista de compras y ordenarlas
      if (isEditing) {
        setCompras((prev) =>
          prev.map((compra) =>
            compra.id === compraCreada.id ? compraCreada : compra
          )
        );
      } else {
        setCompras((prev) => [...prev, compraCreada]);
      }

      // Ordenar las compras después de agregar o editar
      setCompras((prev) =>
        prev.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
      );

      setSuccessMessage(
        isEditing
          ? "Compra actualizada correctamente."
          : "Compra registrada correctamente."
      );
      resetForm();
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      setError(error.message); // Muestra el error en la interfaz
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
      estado: "PENDIENTE",
    });
    setSelectedChequeId(null);
    setDetalleCheque(null);
    setRazonSocialProveedor(null);
    setRazonSocialCliente(null);
    setIsEditing(false);
    setSuccessMessage(null);
  };

  const handleEdit = (compra: Compra) => {
    setNuevaCompra({
      ...compra,
      fecha: new Date(compra.fecha).toISOString().split("T")[0],
    });
    setSelectedChequeId(compra.chequeId || null);
    setDetalleCheque(
      cheques.find((cheque) => cheque.id === compra.chequeId) || null
    );
    if (compra.chequeId) {
      const proveedorSeleccionado = proveedores.find(
        (prov) => prov.id === compra.proveedorId
      );
      setRazonSocialProveedor(
        proveedorSeleccionado ? proveedorSeleccionado.razonSocial : null
      );

      const clienteSeleccionado = clientes.find(
        (cliente) => cliente.id === detalleCheque?.clienteId
      );
      setRazonSocialCliente(
        clienteSeleccionado ? clienteSeleccionado.razonSocial : null
      );
    }
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
      {successMessage && <div className='text-green-500'>{successMessage}</div>}
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
              </option ))}
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
          {nuevaCompra.metodoPago === "CHEQUE" && (
            <select
              name='chequeId'
              value={selectedChequeId || ""}
              onChange={handleChequeChange}
              required
              className='border border-gray-300 rounded p-2'
            >
              <option value='' disabled>
                Seleccionar cheque
              </option>
              {cheques
                .filter(
                  (cheque) => cheque.proveedorId === nuevaCompra.proveedorId
                )
                .map((cheque) => (
                  <option key={cheque.id} value={cheque.id}>
                    Cheque ID: {cheque.id} - Monto: {cheque.monto}
                  </option>
                ))}
            </select>
          )}
          <select
            name='estado'
            value={nuevaCompra.estado}
            onChange={handleChange}
            required
            className='border border-gray-300 rounded p-2'
          >
            <option value='PENDIENTE'>Pendiente</option>
            <option value='COMPLETADO'>Completado</option>
            <option value='CANCELADO'>Cancelado</option>
          </select>
        </div>
        {razonSocialProveedor && (
          <div className='mt-2'>
            <strong>Razón Social del Proveedor:</strong> {razonSocialProveedor}
          </div>
        )}
        {razonSocialCliente && (
          <div className='mt-2'>
            <strong>Razón Social del Cliente:</strong> {razonSocialCliente}
          </div>
        )}
        <button
          type='submit'
          className='mt-4 bg-blue-500 text-white rounded p-2'
        >
          {isEditing ? "Actualizar Compra" : "Registrar Compra"}
        </button>
      </form>
      {detalleCheque && (
        <div className='mt-4 p-4 border border-gray-300 rounded'>
          <h3 className='font-semibold'>Detalles del Cheque:</h3>
          <p>
            <strong>ID:</strong> {detalleCheque.id}
          </p>
          <p>
            <strong>Proveedor ID:</strong> {detalleCheque.proveedorId}
          </p>
          <p>
            <strong>Monto:</strong> {detalleCheque.monto}
          </p>
        </div>
      )}
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