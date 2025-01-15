"use client";
import { useEffect, useState } from "react";

// Definir el tipo para Cliente
type Cliente = {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
};

// Definir el tipo para Venta
type Venta = {
  id: number;
  clienteId: number;
  total: number;
};

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState({
    total: "",
    clienteId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingVenta, setEditingVenta] = useState<Venta | null>(null);

  useEffect(() => {
    const fetchVentas = async () => {
      const response = await fetch("/api/ventas");
      const data = await response.json();
      setVentas(data);
    };

    const fetchClientes = async () => {
      const response = await fetch("/api/clientes");
      const data = await response.json();
      setClientes(data);
    };

    fetchVentas();
    fetchClientes();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const updatedData = {
      ...formData,
      total: Number(formData.total),
      clienteId: Number(formData.clienteId),
    };

    if (isEditing && editingVenta) {
      // Actualizar venta
      const response = await fetch(`/api/ventas/${editingVenta.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedVenta = await response.json();
        setVentas((prevVentas) =>
          prevVentas.map((venta) =>
            venta.id === updatedVenta.id ? updatedVenta : venta
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Error al actualizar la venta:", errorData);
      }
    } else {
      // Crear nueva venta
      const response = await fetch("/api/ventas", {
        method: "POST",
        body: JSON.stringify(updatedData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newVenta = await response.json();
        setVentas((prevVentas) => [...prevVentas, newVenta]);
      } else {
        console.error("Error al agregar la venta");
      }
    }

    // Reiniciar formulario
    setFormData({ total: "", clienteId: "" });
    setIsEditing(false);
    setEditingVenta(null);
  } catch (error) {
    console.error("Error al procesar la venta:", error);
  }
};
