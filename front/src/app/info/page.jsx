    "use client";

    import { useRouter } from "next/navigation";
    import { useEffect, useState, useRef } from "react";
    import { Typewriter } from 'react-simple-typewriter';
    import styles from './InfoPage.module.css';

    export default function InfoPage() {
      const router = useRouter();
      const [isMounted, setIsMounted] = useState(false);
      const [isFlipping, setIsFlipping] = useState(false);
      const [flippedCards, setFlippedCards] = useState([]);
      const containerRef = useRef();
      const [hoveredCard, setHoveredCard] = useState(null);

      useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
      }, []);

      const handleBackClick = () => {
        setIsFlipping(true);
        setTimeout(() => router.push("/"), 1000);
      };

      const toggleFlip = (index) => {
        setFlippedCards(prev => 
          prev.includes(index) 
            ? prev.filter(i => i !== index) 
            : [...prev, index]
        );
      };

      const features = [
        {
          title: " Plataforma per a Professors",
          icon: "👨‍🏫",
          backContent: (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-purple-300">Funcionalitats</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <div>
                    <strong>Panell de Progrés</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <div>
                    <strong>Gestió de classes</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <div>
                    <strong>Reports Detallats</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✓</span>
                  <div>
                    <strong>Integració amb Google</strong>
                  </div>
                </li>
              </ul>
            </div>
          )
        },
        {
          title: "Tutor IA",
          icon: "🤖",
          backContent: (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-cyan-300">Capacidades de IA</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <div>
                    <strong>Respostes Contextuals</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <div>
                    <strong>Exemples de Codi</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <div>
                    <strong>Explicacions Pas a Pas</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">✓</span>
                  <div>
                    <strong>Restricció per Llenguatge</strong>
                  </div>
                </li>
              </ul>
            </div>
          )
        },
        {
          title: "Avaluació Automàtica",
          icon: "📝",
          backContent: (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-indigo-300">Herramientas</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">✓</span>
                  <div>
                    <strong>Proves Personalitzades</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">✓</span>
                  <div>
                    <strong>Reforç Setmanal</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">✓</span>
                  <div>
                    <strong>Seguiment de Progrés</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">✓</span>
                  <div>
                    <strong>Retroalimentació Instantània</strong>
                  </div>
                </li>
              </ul>
            </div>
          )
        },
        {
          title: "Aprenentatge Gamificat",
          icon: "🎮",
          backContent: (
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-green-300">Elements de Joc</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong>Taules de Classificació</strong>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong>Jocs per Conceptes</strong>
                  </div>
                </li>
              </ul>
            </div>
          )
        }
      ];

      return (
        <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className={`absolute rounded-full bg-purple-500/10 ${styles.floatParticle}`}
                style={{
                  width: `${Math.random() * 10 + 5}px`,
                  height: `${Math.random() * 10 + 5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 20 + 10}s`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          <div ref={containerRef} className={`relative w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFlipping ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} style={{ transformOrigin: 'left center' }}>
            <button 
              onClick={handleBackClick} 
              className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 transition-all duration-300 group shadow-lg hover:shadow-purple-500/30 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Tornar a Login
            </button>

            <div className={`container mx-auto px-6 py-24 max-w-6xl transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${isMounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className={`${styles.floatSlow} mb-6 text-center`}>
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300 inline-block"> <span className={`text-cyan-300 ${styles.pulseSlow} inline-block`}>MindCode</span>
                </h1>
                <div className="mt-2 h-1 w-24 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto rounded-full" />
              </div>
              
              <div className="text-center max-w-3xl mx-auto mb-16">
                <Typewriter
                    words={["La plataforma on aprendre programació es converteix en una aventura interactiva, amb IA especialitzada i seguiment personalitzat!"]}
                  loop={1}
                  typeSpeed={40}
                  className="text-xl text-purple-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    onClick={() => toggleFlip(index)}
                    className="relative h-80 cursor-pointer"
                    style={{ perspective: '1000px' }}
                  >
                    <div 
                      className={`relative w-full h-full transition-transform duration-700 ease-in-out ${styles.flipCardInner} ${
                        flippedCards.includes(index) ? styles.flipped : ''
                      }`}
                    >
                      <div className={`${styles.flipCardFront} p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border border-purple-500/20 backdrop-blur-sm flex flex-col justify-center items-center text-center `}>
                        <div className={`text-5xl mb-4 ${styles.wiggleSlow}`}>{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2 text-cyan-200">{feature.title}</h3>
                        <p className="text-purple-100 text-sm mb-4">{feature.description}</p>
                      </div>
                      <div className={`${styles.flipCardBack} p-6 rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-cyan-500/20 backdrop-blur-sm flex flex-col justify-center`}>
                        {feature.backContent}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 p-8 rounded-3xl border border-purple-500/20 backdrop-blur-sm mb-16 relative overflow-hidden">
                <div className={`absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 ${styles.floatDelay}`}></div>
                <h2 className={`text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 ${styles.fadeInUp}`}>
                Com funciona?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((step, i) => (
                    <div 
                      key={i}
                      className={`flex flex-col items-center text-center transition-all duration-500 hover:scale-105 ${styles.staggeredFadeIn}`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-500/20 flex items-center justify-center text-2xl mb-4 border border-purple-500/30 shadow-lg ${styles.pulseSlow}`}>
                        {step}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-cyan-300">
                        {step === 1 && "Profesor crea clase"}
                        {step === 2 && "Estudiants aprenen"}
                        {step === 3 && "Seguimient automàtic"}
                      </h3>
                      <p className="text-purple-100">
                        {step === 1 && "Els professors accedeixen amb Google i configuren les classes amb estudiants."}
                        {step === 2 && "Interactuen amb IA especialitzada per llenguatge i juguen per reforçar conceptes."}
                        {step === 3 && "La plataforma genera tests i estadístiques per a professors i alumnes."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-900/40 to-cyan-900/30 border border-cyan-500/30 mb-16 group hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-500">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8 transition-all duration-500 group-hover:translate-x-2">
                    <h2 className={`text-3xl font-bold mb-4 text-cyan-200 ${styles.fadeInLeft}`}>🎮 Zona de Jocs</h2>
                    <p className={`text-lg text-purple-100 mb-6 ${styles.fadeInLeft}`}>
                      La nostra secció gamificada transforma conceptes complexos en desafiaments divertits. Els estudiants guanyen punts, insígnies i pugen de nivell mentre dominen la programació.

                    </p>
                  </div>
                  <div className="md:w-1/2 flex justify-center transition-all duration-500 group-hover:-translate-x-2">
                    <div className="relative w-full max-w-md h-64 bg-black/30 rounded-xl border border-cyan-500/30 flex items-center justify-center overflow-hidden group-hover:border-cyan-400/50 transition-all duration-500">
                      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
                      <div className="absolute inset-0 rounded-xl border-2 border-dashed border-white/10 m-2 group-hover:border-cyan-400/30 transition-all duration-500"></div>
                      <div className="text-center p-4 z-10">
                        <div className={`text-6xl mb-4 ${styles.bounceSlow}`}>🕹️</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={`absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 ${styles.float}`}></div>
            <div className={`absolute bottom-1/4 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl -z-10 ${styles.floatDelay}`}></div>
            <div className={`absolute top-1/3 left-1/4 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl -z-10 ${styles.pulse}`}></div>
          </div>

          <div 
            className={`absolute inset-0 bg-gray-900 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${isFlipping ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
            style={{ transformOrigin: 'right center' }}
          ></div>
        </div>
      );
    }