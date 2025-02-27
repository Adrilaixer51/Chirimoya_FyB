"use client";
import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import Papa from "papaparse";

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

const categoryMap = {
  "Carnicería": ["Carne"],
  "Charcutería y quesos": ["Charcutería y quesos"],
  "Pescados, mariscos y ahumados": ["Marisco y pescado"],
  "Verduras": ["Fruta y verdura"],
  "Frutas": ["Fruta y verdura"],
  "Leche, huevos y mantequilla": ["Huevos"],
  "Yogures y postres": ["Postres y yogures"],
  "Arroz, pasta y legumbres": ["Arroz"],
  "Aceites, salsas y especias": ["Aceite"],
  "Conservas, caldos y cremas": ["Conservas"],
  "Panes, harinas y masas": ["Panadería y pastelería"],
  "Café, cacao e infusiones": ["Cacao"],
  "Azúcar, chocolates y caramelos": ["Azúcar"],
  "Galletas, bollos y cereales": ["Cereales y galletas"],
  "Patatas fritas y encurtidos": ["Aperitivos"],
  "Pizzas y platos preparados": ["Pizzas y platos preparados"],
  "Congelados": ["Congelados"],
  "Aguas, refrescos y zumos": ["Agua y refrescos", "zumos"],  // Dos categorías en CSV
  "Cervezas y vinos": ["Bodega"],
};


export default function Home() {
  const [startIndex, setStartIndex] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const itemsPerPage = 4;
  const [csvData, setCsvData] = useState([]);
  const [isDiaActive, setIsDiaActive] = useState(true);
  const [isMercadonaActive, setIsMercadonaActive] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");



  const handlePrev = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 4 : prev));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev < categories.length - itemsPerPage ? prev + 4 : prev));
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };  

  useEffect(() => {
    fetch("/MercadonaLimpiado3.csv")
      .then((response) => response.text())
      .then((csvText) => {
        console.log("Contenido del CSV recibido:\n", csvText); // Verifica que el archivo se carga correctamente
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            console.log("Datos parseados con PapaParse:", result.data); // Ver qué estructura tiene cada fila
            const productsData = result.data
              .map((row) =>
                row.photos?.startsWith("http")
                  ? {
                      photo: row.photos,
                      name: row.display_name,  // Asegurar que el nombre esté aquí
                      brand: row.brand,
                      price: row.price_instructions_7,
                      category: row.categories_1,
                      supermarket: row.super,
                      time: row.fecha_actual,
                    }
                  : null
              )
              .filter((img) => img !== null);
  
            console.log("Productos a mostrar:", productsData); // Ver si realmente hay URLs válidas
  
            let filteredProducts = productsData;

            // Filtrar por supermercado según los botones activos
            filteredProducts = filteredProducts.filter((product) => {
              if (!isDiaActive && product.supermarket === "DIA") return false;
              if (!isMercadonaActive && product.supermarket === "Mercadona") return false;
              return true;
            });
  
            // Aplicar filtro de búsqueda primero
            if (searchTerm) {
              const regex = new RegExp(searchTerm, "i");
              filteredProducts = filteredProducts
                .filter((product) => regex.test(product.name)
              );
            } 
            // Si hay una categoría seleccionada, filtrar por categoría
            else if (selectedCategory) {
              const validCategories = categoryMap[selectedCategory] || [];
              filteredProducts = productsData
                .filter((product) => validCategories.includes(product.category))
                .slice(0, 50);
            } 
            // Si no hay búsqueda ni categoría, mostrar productos aleatorios
            else {
              filteredProducts = productsData.sort(() => 0.5 - Math.random()).slice(0, 50);
            }
  
            console.log("Productos finales a mostrar:", filteredProducts);
            setProducts(filteredProducts);
          },
        });
      })
      .catch((error) => console.error("Error al cargar el CSV:", error));
  }, [selectedCategory, searchTerm, isDiaActive, isMercadonaActive]);
  

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
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
        <h1 className="text-white justify-center text-6xl font-sans">Chirimoya</h1>
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
            <li key={index} className="text-center cursor-pointer" onClick={() => handleCategoryClick(category.name)}>
              <div className={`p-2 rounded-lg shadow-md border border-gray-300 transition-all duration-300
                ${selectedCategory === category.name ? "bg-[#663399] text-white" : "bg-white text-black hover:bg-[#663399] hover:text-white"}`}>
                <Image src={category.image} alt={category.name} width={265} height={265} className="rounded-md" />
                <p>{category.name}</p>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={handleNext} className="absolute right-0 p-2 bg-[#663399] rounded-full shadow-md">
          <ChevronRight className="w-8 h-8" />
        </button>
      </nav>
      {selectedCategory && (
        <div className="flex justify-center mt-4">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition" 
            onClick={() => setSelectedCategory(null)}
          >
            Mostrar todos los productos
          </button>
        </div>
      )}


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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}            />
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
        <div className="flex justify-center mt-4 space-x-5">
          <Image
            src="/DiaLogo.png"
            alt="Dia Logo"
            width={44}
            height={44}
            priority
            className={`rounded cursor-pointer transition-all duration-300 ${
              isDiaActive ? "filter-none" : "grayscale"
            }`}
            onClick={() => setIsDiaActive(!isDiaActive)}
          />
          <Image
            src="/MercadonaLogo.png"
            alt="Mercadona Logo"
            width={51}
            height={44}
            priority
            className={`rounded cursor-pointer transition-all duration-300 ${
              isMercadonaActive ? "filter-none" : "grayscale"
            }`}
            onClick={() => setIsMercadonaActive(!isMercadonaActive)}
          />
        </div>
        <div className="grid grid-cols-5 gap-4 p-4">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-2 shadow-md bg-white text-black text-center hover:bg-[#663399] hover:text-white transition-all duration-300 cursor-pointer"
              onClick={() => openModal(product)}
            >
              <Image
                src={product.photo}
                alt={product.name}
                width={150}
                height={150}
                className="rounded-lg"
              />
              <p className="text-sm font-medium mt-2">{product.name}</p>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-black" onClick={closeModal}>
              <X size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <Image src={selectedProduct.photo} alt={selectedProduct.name} width={120} height={120} className="rounded-lg" />
              <div>
                <h2 className="text-xl text-black font-bold">{selectedProduct.name}</h2>
                <p className="text-gray-700">Marca: {selectedProduct.brand}</p>
                <p className="text-lg font-semibold text-green-600">{selectedProduct.price} €</p>
                <p className="text-gray-700">Supermercado: {selectedProduct.supermarket}</p>
                <p className="text-gray-700">Fecha: {selectedProduct.time}</p>
                <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIE DE PÁGINA */}
      <footer className="w-full bg-[#111111] text-center p-4 text-white text-sm">
        &copy; {new Date().getFullYear()} Chirimoya - Todos los derechos reservados.
      </footer>
    </div>
  );
}
