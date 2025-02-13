import Image from "next/image";
import { ShoppingCart } from "lucide-react"; // Importamos el icono de cesta

export default function Home() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Icono de la cesta en la esquina superior derecha */}
      <div className="absolute top-6 right-6 cursor-pointer">
        <ShoppingCart className="h-8 w-8 text-gray-800 hover:text-blue-600 transition-colors" />
      </div>

      {/* Contenedor principal */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <div className="flex justify-center mb-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={120}
            height={30}
            priority
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Buscador de Productos
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
