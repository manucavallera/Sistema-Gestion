// src/app/compras/page.tsx
import { useEffect, useState } from "react";

export default function ComprasPage() {
  const [compras, setCompras] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [formData, setFormData] = useState({
    total: "",
    proveedorId: "", // Aquí se guardará el ID del proveedor
  });

  useEffect(() => {
    const fetchCompras = async () => {
      const response = await fetch("/api/compras");
      const data = await response.json();
      setCompras(data);
    };

    const fetchProveedores = async () => {
      const response = await fetch("/api/proveedores");
      const data = await response.json();
      setProveedores(data);
    };

    fetchCompras();
    fetchProveedores();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/compras", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // Aquí puedes agregar lógica para actualizar la lista de compras
  };

  return (
    <div>
      <h1>Compras</h1>
      <form onSubmit={handleSubmit}>
        <select name='proveedorId' onChange={handleInputChange} required>
          <option value=''>Seleccionar Proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.id} value={proveedor.id}>
              {proveedor.razonSocial}
            </option>
          ))}
        </select>
        <input
          type='number'
          name='total'
          placeholder='Total'
          value={formData.total}
          onChange={handleInputChange}
          required
        />
        <button type='submit'>Agregar Compra</button>
      </form>
      {/* Aquí puedes listar las compras */}
    </div>
  );
}
