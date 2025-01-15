"use client";
import { useEffect, useState } from "react";

// Define la interfaz para un cheque
interface Cheque {
  id: number; // o string, dependiendo de cómo manejes los IDs
  numero: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  clienteId?: string | null;
  proveedorId?: string | null;
  banco: string;
  sucursal: string;
}

const PaginaCheques = () => {
  const [numeroCheque, setNumeroCheque] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [razonSocialCliente, setRazonSocialCliente] = useState("");
  const [razonSocialProveedor, setRazonSocialProveedor] = useState("");
  const [banco, setBanco] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [error, setError] = useState("");
  const [editingCheque, setEditingCheque] = useState<Cheque | null>(null);
  const [clienteId, setClienteId] = useState<string | null>(null); // Nuevo estado para el ID del cliente
  const [proveedorId, setProveedorId] = useState<string | null>(null); // Nuevo estado para el ID del proveedor

  // Obtener cheques al montar el componente
  useEffect(() => {
    const obtenerCheques = async () => {
      try {
        const respuesta = await fetch("/api/cheques");
        const datos: Cheque[] = await respuesta.json();
        setCheques(datos);
      } catch (err) {
        console.error("Error al obtener los cheques:", err);
      }
    };

    obtenerCheques();
  }, []);

  const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const datosCheque: Omit<Cheque, "id"> = {
      numero: numeroCheque,
      monto: parseFloat(monto),
      fechaEmision: fechaEmision,
      fechaVencimiento: fechaVencimiento,
      clienteId: clienteId, // Usar el ID del cliente
      proveedorId: proveedorId, // Usar el ID del proveedor
      banco: banco,
      sucursal: sucursal,
    };

    try {
      const respuesta = editingCheque
        ? await fetch(`/api/cheques/${editingCheque.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosCheque),
          })
        : await fetch("/api/cheques", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosCheque),
          });

      if (!respuesta.ok) {
        const datosError = await respuesta.json();
        setError(datosError.message);
        return;
      }

      const nuevoCheque: Cheque = await respuesta.json();
      setCheques((prev) => {
        if (editingCheque) {
          return prev.map((cheque) =>
            cheque.id === nuevoCheque.id ? nuevoCheque : cheque
          );
        }
        return [...prev, nuevoCheque];
      });

      // Reiniciar el formulario
      reiniciarFormulario();
    } catch (err) {
      console.error("Error al crear o editar el cheque:", err);
      setError("Error al crear o editar el cheque");
    }
  };

  const reiniciarFormulario = () => {
    setNumeroCheque("");
    setMonto("");
    setFechaEmision("");
    setFechaVencimiento("");
    setRazonSocialCliente("");
    setRazonSocialProveedor("");
    setBanco("");
    setSucursal("");
    setError("");
    setEditingCheque(null);
    setClienteId(null); // Reiniciar el ID del cliente
    setProveedorId(null); // Reiniciar el ID del proveedor
  };

  const manejarCambio = (e: React  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case "numeroCheque":
        setNumeroCheque(value);
        break;
      case "monto":
        setMonto(value);
        break;
      case "fechaEmision":
        setFechaEmision(value);
        break;
      case "fechaVencimiento":
        setFechaVencimiento(value);
        break;
      case "razonSocialCliente":
        setRazonSocialCliente(value);
        break;
      case "razonSocialProveedor":
        setRazonSocialProveedor(value);
        break;
      case "banco":
        setBanco(value);
        break;
      case "sucursal":
        setSucursal(value);
        break;
      default:
        break;
    }
  };

  const buscarCliente = async () => {
    if (razonSocialCliente) {
      try {
        const respuesta = await fetch(`/api/clientes?razonSocial=${razonSocialCliente}`);
        const datos = await respuesta.json();
        if (datos.length > 0) {
          // Suponiendo que solo tomamos el primer cliente encontrado
          datos[0].id && setClienteId(datos[0].id);
        } else {
          setError("Cliente no encontrado.");
        }
      } catch (err) {
        console.error("Error al buscar cliente:", err);
        setError("Error al buscar cliente");
      }
    }
  };

  const buscarProveedor = async () => {
    if (razonSocialProveedor) {
      try {
        const respuesta = await fetch(`/api/proveedores?razonSocial=${razonSocialProveedor}`);
        const datos = await respuesta.json();
        if (datos.length > 0) {
          // Suponiendo que solo tomamos el primer proveedor encontrado
          datos[0].id && setProveedorId(datos[0].id);
        } else {
          setError("Proveedor no encontrado.");
        }
      } catch (err) {
        console.error("Error al buscar proveedor:", err);
        setError("Error al buscar proveedor");
      }
    }
  };

  const eliminarCheque = async (id: number) => {
    try {
      const respuesta = await fetch(`/api/cheques/${id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        const datosError = await respuesta.json();
        setError(datosError.message);
        return;
      }

      setCheques((prev) => prev.filter((cheque) => cheque.id !== id));
    } catch (err) {
      console.error("Error al eliminar el cheque:", err);
      setError("Error al eliminar el cheque");
    }
  };

  const editarCheque = (cheque: Cheque) => {
    setNumeroCheque(cheque.numero);
    setMonto(cheque.monto.toString());
    setFechaEmision(cheque.fechaEmision);
    setFechaVencimiento(cheque.fechaVencimiento);
    setRazonSocialCliente(cheque.clienteId || "");
    setRazonSocialProveedor(cheque.proveedorId || "");
    setBanco(cheque.banco);
    setSucursal(cheque.sucursal);
    setEditingCheque(cheque);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Gestión de Cheques</h1>
      <form onSubmit={manejarEnvio} className='mb-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <input
            type='text'
            name='numeroCheque'
            placeholder='Número de Cheque'
            value={numeroCheque}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='number'
            name='monto'
            placeholder='Monto'
            value={monto}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='date'
            name='fechaEmision'
            placeholder='Fecha de Emisión'
            value={fechaEmision}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required
          />
          <input
            type='date'
            name='fechaVencimiento'
            placeholder='Fecha de Vencimiento'
            value={fechaVencimiento}
            onChange={manejarCambio}
            className='border border-gray-300 rounded p-2'
            required