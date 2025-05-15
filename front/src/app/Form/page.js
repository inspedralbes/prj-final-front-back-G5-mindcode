"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const FormWithStarryBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });

    const starVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    camera.position.z = 500;

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
        if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
        window.removeEventListener("resize", handleResize);
      };
      
  }, []);

  return (
    <div ref={mountRef} style={{ position: "absolute", width: "100%", height: "100%" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
    
        <div className="flex items-center justify-center min-h-screen">
            
      {/* Semi-transparent Container */}
      <div className="bg-opacity-80 p-8 rounded-lg w-[644px] relative shadow-[0_0_2px_#ffffff80,inset_0_0_2px_#ffffff80,0_0_5px_#ffffff80,0_0_15px_#ffffff80,0_0_25px_#ffffff80]">

        {/* White Top Tab */}
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-5 rounded-t-lg shadow-[0_0_2px_#ffffff80,inset_0_0_2px_#ffffff80,0_0_5px_#ffffff80,0_0_15px_#ffffff80,0_0_25px_#ffffff80]
"></div>

        {/* Form with Semi-transparent Background */}
        <div className=" bg-opacity-60 rounded-md">
       
          <form>
            {/* Questions */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">- - Pregunta 1 - - </label>
              <select className="w-full p-3 bg-gray-700 bg-opacity-50 text-white border border-gray-500 rounded-md focus:border-gray-300 focus:ring-2 focus:ring-gray-300">
                <option>0</option>
                <option>2</option>
                <option>4</option>
                <option>5</option>
              </select>
            </div>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">- - Pregunta 2 - -</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-3 bg-gray-700 bg-opacity-50 text-white border border-gray-500 rounded-md focus:border-gray-300 focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">- - Pregunta 3 - -</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 bg-gray-700 bg-opacity-50 text-white border border-gray-500 rounded-md focus:border-gray-300 focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* Submit Button */}
            <button className="w-full p-3 mt-4 bg-gray-500 text-white font-bold rounded-md hover:bg-gray-400 transition">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>

      
      
        </div>
    </div>

  );
};

export default FormWithStarryBackground;
