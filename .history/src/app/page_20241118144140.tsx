import Link from "next/link";

const links = [
  {
    href: "/inicio",
    label: "Ir al Inicio",
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
  },
  {
    href: "/clientes",
    label: "Gestión de Clientes",
    bgColor: "bg-green-500",
    hoverColor: "hover:bg-green-600",
  },
  {
    href: "/proveedores",
    label: "Gestión de Proveedores",
    bgColor: "bg-purple-500",
    hoverColor: "hover:bg-purple-600",
  },
  {
    href: "/compras",
    label: "Gestión de Compras",
    bgColor: "bg-orange-500",
    hoverColor: "hover:bg-orange-600",
  },
  {
    href: "/ventas",
    label: "Gestión de Ventas",
    bgColor: "bg-red-500",
    hoverColor: "hover:bg-red-600",
  },

  {
    href: "/imprimir",
    label: "Imprimir Recibos y Remitos",
    bgColor: "bg-indigo-500",
    hoverColor: "hover:bg-indigo-600",
  },

  {
    href: "/cheques",
    label: "Gestión de Cheques",
    bgColor: "bg-pink-500",
    hoverColor: "hover:bg-pink-600",
  }, // Nuevo enlace para cheques
];

const HomePage = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-background'>
      <h1 className='text-5xl font-bold'>
        Sistema de Gestión de Cuenta Corriente
      </h1>
      <p className='mt-4 text-lg'>
        Bienvenido al sistema de gestión, donde puedes administrar clientes,
        proveedores, compras, ventas y más.
      </p>
      <div className='mt-8 flex flex-col space-y-4'>
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <button
              className={`px-4 py-2 text-white ${link.bgColor} rounded ${link.hoverColor}`}
            >
              {link.label}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
