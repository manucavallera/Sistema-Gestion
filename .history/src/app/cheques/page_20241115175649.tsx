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

// Define la interfaz para un cliente
interface Cliente {
  id: string; // o number, dependiendo de cómo manejes los IDs
  razonSocial: string;
}

// Define la interfaz para un proveedor
interface Proveedor {
  id: string; // o number, dependiendo de cómo manejes los IDs
  razonSocial: string;
}

const PaginaCheques = () => {
  const [numeroCheque, setNumeroCheque] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [banco, setBanco] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [error, setError] = useState("");
  const [editingCheque, setEditingCheque] = useState<Cheque | null>(null);
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [proveedorId, setProveedorId] = useState<string | null>(null);
  
  // Tipamos el estado de clientes y proveedores
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  // Obtener cheques, clientes y proveedores al montar el componente
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

    const obtenerClientes = async () => {
      try {
        const respuesta = await fetch("/api/clientes");
        const datos: Cliente[] = await respuesta.json(); // Asegúrate de que el tipo sea Cliente[]
        setClientes(datos);
      } catch (err) {
        console.error("Error al obtener los clientes:", err);
      }
    };

    const obtenerProveedores = async () => {
      try {
        const respuesta = await fetch("/api/proveedores");
        const datos: Proveedor[] = await respuesta.json(); // Asegúrate de que el tipo sea Proveedor[]
        setProveedores(datos);
      } catch (err) {
        console.error("Error al obtener los proveedores:", err);
      }
    };

    obtenerCheques();
    obtenerClientes();
    obtenerProveedores();
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
    setBanco("");
    setSucursal(""); // Asegúrate de reiniciar correctamente la sucursal
    setError("");
    setEditingCheque(null);
    setClienteId(null); // Reiniciar el ID del cliente
    setProveedorId(null); // Reiniciar el ID del proveedor
  };