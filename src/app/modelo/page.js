"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { motion } from "framer-motion";

function RotatingModel({ modelPath }) {
  const meshRef = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02; // Rotación constante en el eje Y
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={gltf.scene} 
      scale={0.5} 
      position={[0, 0, 0]} 
    />
  );
}

export default function Scene() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-150 relative overflow-hidden">
      <Canvas camera={{ position: [0, 1, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <RotatingModel modelPath="/cubic_shopping_cart.glb" />
      </Canvas>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute bottom-10 text-black text-2xl font-bold bg-gradient-to-t from-gray-200 to-transparent p-4 text-center"
      >
        Carrito de la Compra
      </motion.div>
    </div>
  );    
}
