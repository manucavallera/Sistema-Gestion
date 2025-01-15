// app/proveedores/page.tsx (o pages/proveedores.tsx)
import { useEffect, useState } from "react";

interface Proveedor {
  id: number;
  razonSocial: string;
  direccion: string;
  cuit: string;
  zona: string;
  telefono: string;
  email: string;
  saldo: number;
}

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    razonSocial: "",
    direccion: "",
    cuit: "",
    zona: "",
    telefono: "",
    email: "",
    saldo: 0,
  });

  useEffect(() => {
    const fetchProveedores = async () => {
      const response = await fetch("/api/proveedores");
      const data = await response.json();
      setProveedores(data);
    };

    fetchProveedores();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoProveedor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/proveedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoProveedor),
    });

    if (response.ok) {
      const proveedorCreado = await response.json();
      setProveedores((prev) => [...prev, proveedorCreado]);
      setNuevoProveedor({
        razonSocial: "",
        direccion: "",
        cuit: "",
        zona: "",
        telefono: "",
        email: "",
        saldo: 0,
      });
    } else {
      console.error("Error al crear el proveedor");
    }
  };

  return (
    <div>
      <h1>Proveedores</h1>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='razonSocial'
          placeholder='Razón Social'
          value={nuevoProveedor.razonSocial}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='direccion'
          placeholder='Dirección'
          value={nuevoProveedor.direccion}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='cuit'
          placeholder='CUIT'
          value={nuevoProveedor.cuit}
          onChange={handleChange}
          required
        />
        <input
          type='text'
          name='zona'
          placeholder='Zona'
          value={nuevoProveedor.zona}
          onChange={handleChange}
        />
        <input
          type='text'
          name='telefono'
          placeholder='Teléfono'
          value={nuevoProveedor.telefono}
          onChange={handleChange}
        />
        <input
          type='email'
          name='email'
          placeholder='Email'
          value={nuevoProveedor.email}
          onChange={handleChange}
        />
        <input
          type='number'
          name='saldo'
          placeholder='Saldo'
          value={nuevoProveedor.saldo}
          onChange={handleChange}
        />
        <button type='submit'>Agregar Proveedor</button>
      </form>

      <h2>Lista de Proveedores</h2>
      <ul>
        {proveedores.map((proveedor) => (
          <li key={proveedor.id}>
            {proveedor.razonSocial} - {proveedor.direccion} - {proveedor.cuit}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProveedoresPage;
