"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CestaSaludable() {
  const [cart, setCart] = useState([]);
  const [healthyCart, setHealthyCart] = useState([]);

  useEffect(() => {
    // Recuperar la cesta desde localStorage o estado global
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    // Aquí deberías implementar la lógica para generar la cesta saludable.
    // Por ahora, solo clonamos la cesta original.
    setHealthyCart(storedCart); 
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-4xl text-black font-bold mb-6">Comparación de Cestas</h1>
      
      <div className="flex justify-center gap-16 w-full max-w-6xl">
        {/* Cesta Seleccionada */}
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl text-black font-semibold mb-4">Tu Cesta</h2>
          <ul className="bg-white p-4 text-black rounded shadow-md">
            {cart.length === 0 ? (
              <p>No hay productos en la cesta.</p>
            ) : (
              cart.map((item, index) => (
                <li key={index} className="flex items-center border-b p-2">
                  <Image src={item.photo} alt={item.name} width={50} height={50} className="rounded-md mr-4" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>{item.price}€ (x{item.quantity})</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Cesta Saludable */}
        <div className="w-1/2 bg-green-100 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl text-black font-semibold mb-4">Cesta Saludable</h2>
          
        </div>
      </div>

      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        Volver a la tienda
      </Link>
    </div>
  );
}
