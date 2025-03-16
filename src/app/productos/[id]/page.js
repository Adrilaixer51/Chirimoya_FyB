"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Papa from "papaparse";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProductoDetalle() {
  const { id } = useParams();  // Recibimos el ID de la URL
  const [producto, setProducto] = useState(null);
  const [historicoPrecios, setHistoricoPrecios] = useState([]);
  const [precioActual, setPrecioActual] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [productosTotales, setProductosTotales] = useState([]);


  useEffect(() => {
    if (!id) return;

    let decodedId = decodeURIComponent(id).trim();
    
    // Cargar el archivo CSV y procesarlo
    fetch("/MercadonaLimpiado3.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            // Buscar el producto con el id
            const productosCoincidentes = result.data.filter((p) => {
              // Usamos el id para hacer la comparación
              return p.id && p.id.toString() === decodedId;
            });

            if (productosCoincidentes.length === 0) {
              setError("Producto no encontrado");
              setCargando(false);
              return;
            }

            setProducto(productosCoincidentes[0]);
            setProductosTotales(result.data); // Guarda todos los productos para usarlos luego


            // Convertir el histórico en formato usable
            const historicoOrdenado = productosCoincidentes
              .map(p => ({
                fecha: p.fecha_actual || "Fecha desconocida",
                precio: p.price_instructions_7,
              }))
              .sort((a, b) => (a.fecha > b.fecha ? -1 : 1));

            setHistoricoPrecios(historicoOrdenado);

            // Buscar el precio del 26/11/2024
            const precioFechaFija = historicoOrdenado.find(p => p.fecha === "2024-11-26");
            setPrecioActual(precioFechaFija ? precioFechaFija.precio : historicoOrdenado[0]?.precio);

            // Obtener productos relacionados (misma categoría)
            const productosRelacionados = result.data.filter((p) => p.categories_1 === productosCoincidentes[0].categories_1 && p.id !== productosCoincidentes[0].id);
            setProductosRelacionados(productosRelacionados.slice(0, 8));

            setCargando(false);
          },
          error: (error) => {
            setError("Error al procesar los datos");
            setCargando(false);
          }
        });
      })
      .catch(() => {
        setError("Error al cargar datos");
        setCargando(false);
      });
  }, [id]);

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (cargando) return <p className="text-center mt-10">Cargando información del producto...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-10">
      <div className="flex w-full max-w-5xl">
        {/* Información del producto a la izquierda */}
        <div className="w-1/2 bg-white p-6 shadow-md rounded-lg">
          <h1 className="text-3xl text-black font-bold">{producto.display_name}</h1>
          {producto.photos && (
            <Image src={producto.photos} alt={producto.display_name} width={300} height={300} className="rounded-lg shadow-md mt-4" />
          )}
          <p className="text-xl text-gray-600 mt-4">Marca: {producto.brand}</p>
          <p className="text-lg text-gray-600 font-semibold">Precio (26/11/2024): {precioActual}€</p>
          <p className="text-md text-gray-500">Categoría: {producto.categories_1}</p>
          <p className="text-md text-gray-500">ID: {producto.id}</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Volver a la vista principal
          </button>
        </div>

        {/* Histórico de precios y gráfica a la derecha */}
        <div className="w-1/2 ml-6">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Histórico de Precios</h2>
            <ul className="divide-y divide-gray-300">
              {historicoPrecios.length > 0 ? (
                historicoPrecios.map((entry, index) => (
                  <li key={index} className="flex justify-between py-2">
                    <span className="text-black">{entry.fecha}</span>
                    <span className="text-black font-semibold">{entry.precio}€</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No hay datos históricos disponibles</p>
              )}
            </ul>
          </div>

          {/* Gráfica de evolución de precios */}
          <div className="bg-white shadow-md rounded-lg p-7 mt-5">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Evolución del Precio</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicoPrecios}>
                <CartesianGrid strokeDasharray="2 3" />
                <XAxis dataKey="fecha" tick={{ fontSize: 13 }} tickFormatter={(fecha) => new Date(fecha).toLocaleDateString("es-ES")} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip/>
                <Line type="monotone" datakey="fecha" dataKey="precio" stroke="#1E88E5"  strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="w-full max-w-5xl mt-10">
        <h2 className="text-2xl text-black font-semibold mb-4">Productos Relacionados</h2>
        <div className="grid grid-cols-4 gap-6">
          {productosRelacionados.map((prod, index) => (
            <div key={index} className="bg-white text-black p-4 rounded-lg shadow-md hover:bg-[#A869EB] hover:text-white transition  cursor-pointer"
              onClick={() => {
                setProducto(prod);
              
                // Obtener el histórico de precios correcto del producto seleccionado
                const historicoNuevoProducto = productosTotales
                  .filter(p => p.id === prod.id)
                  .map(p => ({
                    fecha: p.fecha_actual || "Fecha desconocida",
                    precio: p.price_instructions_7,
                  }))
                  .sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
              
                // Buscar el precio del 26/11/2024 o el más reciente si no está
                const precioFechaFija = historicoNuevoProducto.find(p => p.fecha === "2024-11-26");
                setPrecioActual(precioFechaFija ? precioFechaFija.precio : historicoNuevoProducto[0]?.precio);
              
                setHistoricoPrecios(historicoNuevoProducto);
              
                // Actualizar productos relacionados
                const nuevosRelacionados = productosTotales
                  .filter(p => p.categories_1 === prod.categories_1 && p.id !== prod.id)
                  .sort(() => Math.random() - 0.5) // Mezcla aleatoriamente
                  .slice(0, 8);
              
                setProductosRelacionados(nuevosRelacionados);
              }}
              
            >
              
              {prod.photos && (
                <Image src={prod.photos} alt={prod.display_name} width={200} height={200} className="rounded-lg" />
              )}
              <h3 className="text-lg font-semibold mt-4">{prod.display_name}</h3>
              <p className="text-black-600">
                {(() => {
                  const historicoNuevoProducto = productosTotales
                    .filter(p => p.id === prod.id)
                    .map(p => ({
                      fecha: p.fecha_actual || "Fecha desconocida",
                      precio: p.price_instructions_7,
                    }))
                    .sort((a, b) => (a.fecha > b.fecha ? -1 : 1));

                  const precioFechaFija = historicoNuevoProducto.find(p => p.fecha === "2024-11-26");
                  return precioFechaFija ? precioFechaFija.precio : historicoNuevoProducto[0]?.precio;
                })()}€
              </p>
              <p className="text-sm text-black-500">{prod.categories_1}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
