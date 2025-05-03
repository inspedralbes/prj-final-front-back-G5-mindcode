"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Float } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useState, useRef, Suspense } from "react";
import Button from "../../components/atoms/Button";
import * as THREE from "three";

const PythonBlocksGame = () => {
  const router = useRouter();
  const [code, setCode] = useState([]);
  const [message, setMessage] = useState("Arrastra los bloques al área de código");
  const [gameCompleted, setGameCompleted] = useState(false);

  const blocks = [
    { id: "def", text: "def", position: [-3, 0.5, 0], color: "#4285F4" },
    { id: "if", text: "if", position: [0, 0.5, 0], color: "#34A853" },
    { id: "print", text: "print", position: [3, 0.5, 0], color: "#EA4335" },
    { id: "for", text: "for", position: [-3, -1.5, 0], color: "#FBBC05" },
    { id: "while", text: "while", position: [0, -1.5, 0], color: "#673AB7" },
    { id: "return", text: "return", position: [3, -1.5, 0], color: "#FF5722" },
  ];

  const targetArea = {
    position: [0, -3, 0],
    size: [8, 1, 4]
  };

  const addToCode = (blockId) => {
    if (code.length >= 6) return;
    
    const newCode = [...code, blockId];
    setCode(newCode);
    
    // Verificar si el código es correcto
    if (newCode.join(" ") === "def if print for while return") {
      setMessage("¡Correcto! Has creado un programa Python válido.");
      setGameCompleted(true);
    } else if (newCode.length === 6) {
      setMessage("Casi... intenta otro orden de bloques");
    }
  };

  const resetGame = () => {
    setCode([]);
    setMessage("Arrastra los bloques al área de código");
    setGameCompleted(false);
  };

  return (
    <div className="h-screen w-full bg-gray-100 dark:bg-black text-white relative">
      <h1 className="text-center pt-4 text-2xl font-bold text-green-500">🐍 Python Blocks Game</h1>
      
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={() => router.push("/Jocs")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ⬅️ Volver
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <div className="bg-black bg-opacity-70 p-4 inline-block rounded-lg">
          <p className="text-xl mb-2">{message}</p>
          <p className="text-lg mb-4">Código: {code.join(" ") || "..."}</p>
          {gameCompleted && (
            <Button 
              onClick={resetGame}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Jugar de nuevo
            </Button>
          )}
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
        
        <OrbitControls enableZoom={true} enablePan={true} />
        
        {/* Piso */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* Área de destino para el código */}
        <mesh position={targetArea.position} rotation={[0, 0, 0]}>
          <boxGeometry args={targetArea.size} />
          <meshStandardMaterial color="#333" transparent opacity={0.3} />
        </mesh>
        
        {/* Bloques de código */}
        <Suspense fallback={null}>
          {blocks.map((block) => (
            <DraggableBlock 
              key={block.id}
              id={block.id}
              text={block.text}
              position={block.position}
              color={block.color}
              targetArea={targetArea}
              onDrop={addToCode}
              disabled={gameCompleted}
            />
          ))}
        </Suspense>
        
        {/* Mostrar código actual */}
        {code.map((blockId, index) => {
          const block = blocks.find(b => b.id === blockId);
          const xPos = -3 + (index % 3) * 3;
          const zPos = -5 + Math.floor(index / 3) * 1.5;
          
          return (
            <mesh key={index} position={[xPos, -3, zPos]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={block.color} />
              <Text
                position={[0, 0, 0.51]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {block.text}
              </Text>
            </mesh>
          );
        })}
      </Canvas>
    </div>
  );
};

const DraggableBlock = ({ id, text, position, color, targetArea, onDrop, disabled }) => {
  const meshRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [originalPos] = useState(new THREE.Vector3(...position));
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ mouse, camera }) => {
    if (dragging && !disabled) {
      // Convertir la posición del mouse a coordenadas 3D
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      
      meshRef.current.position.x = pos.x;
      meshRef.current.position.y = pos.y;
    }
  });
  
  const handlePointerDown = () => {
    if (disabled) return;
    setDragging(true);
  };
  
  const handlePointerUp = () => {
    if (!dragging || disabled) return;
    
    setDragging(false);
    
    // Verificar si el bloque está en el área de destino
    const blockPos = meshRef.current.position;
    const targetMinX = targetArea.position[0] - targetArea.size[0]/2;
    const targetMaxX = targetArea.position[0] + targetArea.size[0]/2;
    const targetMinY = targetArea.position[1] - targetArea.size[1]/2;
    const targetMaxY = targetArea.position[1] + targetArea.size[1]/2;
    const targetMinZ = targetArea.position[2] - targetArea.size[2]/2;
    const targetMaxZ = targetArea.position[2] + targetArea.size[2]/2;
    
    if (
      blockPos.x >= targetMinX && blockPos.x <= targetMaxX &&
      blockPos.y >= targetMinY && blockPos.y <= targetMaxY &&
      blockPos.z >= targetMinZ && blockPos.z <= targetMaxZ
    ) {
      onDrop(id);
      // Devolver el bloque a su posición original
      meshRef.current.position.copy(originalPos);
    } else {
      // Devolver el bloque a su posición original
      meshRef.current.position.copy(originalPos);
    }
  };
  
  return (
    <Float speed={hovered ? 0 : 2} rotationIntensity={hovered ? 0 : 0.5} floatIntensity={hovered ? 0 : 0.1}>
      <mesh
        ref={meshRef}
        position={originalPos}
        castShadow
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={() => !disabled && setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : color} 
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
        <Text
          position={[0, 0, 0.51]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </mesh>
    </Float>
  );
};

export default PythonBlocksGame;