import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { fetchFormQuestions } from "../../services/communicationManager"; // Ensure the correct path

const FormWithStarryBackground = () => {
  const mountRef = useRef(null);
  const [questions, setQuestions] = useState([]); // State to store fetched questions
  const formId = 1; // Replace with dynamic formId if needed

  useEffect(() => {
    // Fetch questions from API
    const getQuestions = async () => {
      try {
        const data = await fetchFormQuestions(formId);
        if (data && data.body) {
          setQuestions(data.body);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    getQuestions();
  }, []);

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

    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    camera.position.z = 1000;

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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white bg-opacity-20 p-8 rounded-lg w-[644px] relative shadow-md">
            <div className="bg-white bg-opacity-20 absolute -top-5 left-1/2 transform -translate-x-1/2 w-12 h-5 rounded-t-lg shadow-md"></div>

            <div className="bg-opacity-60 rounded-md">
              <form>
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <div key={question.question_id} className="mb-4">
                      <label className="block text-gray-300 mb-2">
                        - - {question.question_text} - -
                      </label>

                      {question.question_type === "multiple-choice" ? (
                        <select className="w-full p-3 bg-gray-700 bg-opacity-50 text-white border border-gray-600 rounded-md focus:border-gray-300 focus:ring-2 focus:ring-gray-300">
                          {question.options.map((option, i) => (
                            <option key={i} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={question.question_type === "text" ? "text" : "email"}
                          placeholder="Type your answer"
                          className="w-full p-3 bg-gray-700 bg-opacity-50 text-white border border-gray-500 rounded-md focus:border-gray-300 focus:ring-2 focus:ring-gray-300"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300">Loading questions...</p>
                )}

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
