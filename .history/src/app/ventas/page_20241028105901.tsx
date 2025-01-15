import { useEffect, useState } from "react";

// Define el tipo para Cliente y Venta
type Cliente = {
  id: number;
  razonSocial: string;
};

type Venta = {
  id: number;
  total: number;
  cliente: Cliente;
};

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState({
    total: "",
    clienteId: "",
  });

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/ventas", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFormData({ total: "", clienteId: "" });
    fetchVentas(); // Actualizar la lista después de agregar
  };

  return (
    <div className='p-6 bg-gray-100 min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Ventas</h1>
      <form onSubmit={handleSubmit} className='mb-6'>
        <select
          name='clienteId'
          value={formData.clienteId}
          onChange={handleInputChange}
          required
          className='p-2 border border-gray-300 rounded w-full mb-2'
        >
          <option value=''>Seleccionar Cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.razonSocial}
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
          className='p-2 border border-gray-300 rounded w-full mb-2'
        />
        <button
          type='submit'
          className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
        >
          Agregar Venta
        </button>
      </form>

      <h2 className='text-xl font-semibold mb-2'>Lista de Ventas</h2>
      <ul>
        {ventas.map((venta) => (
          <li
            key={venta.id}
            className='p-4 bg-white shadow mb-2 rounded flex justify-between items-center'
          >
            <span>Cliente: {venta.cliente.razonSocial}</span>
            <span>Total: ${venta.total}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
