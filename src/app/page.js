"use client";
import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

const categories = [
  { name: "Carnicería", image: "/Carne.jpg" },
  { name: "Charcutería y quesos", image: "/Quesos.jpg" },
  { name: "Pescados, mariscos y ahumados", image: "/PescadosFinal.jpg" },
  { name: "Verduras", image: "/Vegetales.jpg" },
  { name: "Frutas", image: "/Frutas.jpg" },
  { name: "Leche, huevos y mantequilla", image: "/Huevos.jpg" },
  { name: "Yogures y postres", image: "/Yogur.jpg" },
  { name: "Arroz, pasta y legumbres", image: "/Pasta.jpg" },
  { name: "Aceites, salsas y especias", image: "/Aceites.jpg" },
  { name: "Conservas, caldos y cremas", image: "/Caldos.jpg" },
  { name: "Panes, harinas y masas", image: "/Pan.jpg" },
  { name: "Café, cacao e infusiones", image: "/Cafe.jpg" },
  { name: "Azúcar, chocolates y caramelos", image: "/Chocolate.jpg" },
  { name: "Galletas, bollos y cereales", image: "/Galletas.jpg" },
  { name: "Patatas fritas y encurtidos", image: "/PatatasFritas.jpg" },
  { name: "Pizzas y platos preparados", image: "/Pizza.jpg" },
  { name: "Congelados", image: "/Congelados.jpg" },
  { name: "Aguas, refrescos y zumos", image: "/Refresco.jpg" },
  { name: "Cervezas y vinos", image: "/Vino.jpg" },
];

export default function Home() {
  const [startIndex, setStartIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const itemsPerPage = 4;

  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev < categories.length - itemsPerPage ? prev + 1 : prev));
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-no-repeat bg-fixed" style={{ backgroundImage: "url('/FondoSupermercado.jpg')" }}>
      {/* CABECERA */}
      <header className="w-full bg-[#00563B] shadow-lg p-4 flex justify-between items-center px-9">
        <div className="logo">
          <Image src="/Logo.png" 
          alt="Chirimoya Logo" 
          width={70} 
          height={45} 
          priority />
        </div>
        <h1 className="text-white justify-center text-6xl !font-sans">Chirimoya</h1>
        <div className="cursor-pointer" onClick={() => setCartOpen(true)}>
          <ShoppingCart className="h-12 w-12 text-white hover:text-purple-600 transition-colors" />
        </div>
      </header>

      {/* SIDEBAR DEL CARRITO */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-[#0B5351] shadow-lg p-4 transition-transform z-50 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setCartOpen(false)} className="absolute top-2 right-2">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">Carrito</h2>
        <p>Cesta</p>
      </div>

      {/* MENÚ DE NAVEGACIÓN - CARRUSEL */}
      <nav className="w-full p-4 flex justify-center items-center relative">
        <button onClick={handlePrev} className="absolute left-0 p-2 bg-[#663399] rounded-full shadow-md">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <ul className="flex space-x-4 overflow-hidden">
          {categories.slice(startIndex, startIndex + itemsPerPage).map((category, index) => (
            <li key={index} className="text-center">
              <div className="bg-white text-black p-2 rounded-lg shadow-md border border-gray-300 hover:bg-[#663399] hover:text-white transition-all duration-300">
                <Image src={category.image} 
                alt={category.name} 
                width={265} 
                height={265} 
                className="rounded-md" />
                <p>{category.name}</p>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleNext} className="absolute right-0 p-2 bg-[#663399] rounded-full shadow-md">
          <ChevronRight className="w-8 h-8" />
        </button>
      </nav>

      {/*CUERPO PRINCIPAL */}
      <main className="flex flex-col items-center justify-center flex-1 p-8 pl-50px">
        <div className="shadow-lg justify-center rounded-2xl p-6 w-full max-w-lg bg-[#663399] border border-[2px] border-[#B284BE]">
          <div className="flex justify-center mb-4">
            
          </div>
          <h1 className="text-3xl font-bold text-center mb-4 text-white-800">
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
      </main>

      {/* PIE DE PÁGINA */}
      <footer className="w-full bg-[#111111] text-center p-4 text-white text-sm">
        &copy; {new Date().getFullYear()} Chirimoya - Todos los derechos reservados.
      </footer>
    </div>
  );
}
