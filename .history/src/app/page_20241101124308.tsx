// src/app/page.tsx
import Link from "next/link";

const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-background'>
      <h1 className='text-5xl font-bold'>Sistema de Gestión</h1>
      <p className='mt-4 text-lg'>
        Bienvenido al sistema de gestión de clientes, proveedores y más.
      </p>
      <div className='mt-8'>
        <Link href='/inicio'>
          <button className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600'>
            Ir al Inicio
          </button>
        </Link>
        <Link href='/clientes'>
          <button className='px-4 py-2 ml-4 text-white bg-green-500 rounded hover:bg-green-600'>
            Gestión de Clientes
          </button>
        </Link>
        <Link href='/proveedores'>
          <button className='px-4 py-2 ml-4 text-white bg-purple-500 rounded hover:bg-purple-600'>
            Gestión de Proveedores
          </button>
        </Link>
        <Link href='/compras'>
          <button className='px-4 py-2 ml-4 text-white bg-orange-500 rounded hover:bg-orange-600'>
            Gestión de Compras
          </button>
        </Link>
        <Link href='/ventas'>
          <button className='px-4 py-2 ml-4 text-white bg-red-500 rounded hover:bg-red-600'>
            Gestión de Ventas
          </button>
        </Link>
        {/* Enlace a la página de archivos archivados */}
        <Link href='/archivados'>
          <button className='px-4 py-2 ml-4 text-white bg-gray-500 rounded hover:bg-gray-600'>
            Archivos Antiguos
          </button>
        </Link>
        {/* Puedes agregar más enlaces a otras secciones aquí */}
      </div>
    </div>
  );
};

export default HomePage;
