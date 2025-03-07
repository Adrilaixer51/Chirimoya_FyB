"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Papa from "papaparse"; // Asegúrate de tener instalada la librería papaparse

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;
            
    // 🔍 Decodificar la URL y limpiar caracteres conflictivos
    let decodedId = decodeURIComponent(id).trim();
    console.log("ID decodificado:", decodedId);
    
    fetch("/MercadonaLimpiado3.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            console.log("Datos CSV cargados:", result.data); // Depuración

            const productoEncontrado = result.data.find((p) => {
              // Normalizar y comparar las cadenas en minúsculas sin acentos
              const productoName = p.display_name?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
              const idDecodificado = decodedId.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

              console.log(`Comparando: "${productoName}" con "${idDecodificado}"`);
              return productoName === idDecodificado;
            });

            if (!productoEncontrado) {
              console.error("Producto no encontrado:", decodedId);
              setError("Producto no encontrado");
            } else {
              setProducto(productoEncontrado);
            }
            setCargando(false);
          },
          error: (error) => {
            console.error("Error al analizar el CSV:", error);
            setError("Error al procesar los datos");
            setCargando(false);
          }
        });
      })
      .catch((error) => {
        console.error("Error al cargar el CSV:", error);
        setError("Error al cargar datos");
        setCargando(false);
      });
  }, [id]);

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (cargando) return <p className="text-center mt-10">Cargando información del producto...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <h1 className="text-3xl text-black font-bold">{producto.display_name}</h1>
      {producto.photos && (
        <Image src={producto.photos} alt={producto.display_name} width={300} height={300} className="rounded-lg shadow-md mt-4" />
      )}
      <p className="text-xl text-gray-600 mt-4">Marca: {producto.brand}</p>
      <p className="text-lg text-gray-600">Precio: {producto.price_instructions_7}€</p>
      <p className="text-md text-gray-500">Categoría: {producto.categories_1}</p>
    </div>
  );
}
