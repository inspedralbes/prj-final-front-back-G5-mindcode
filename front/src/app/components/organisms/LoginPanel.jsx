import React from 'react';
import Tilt from 'react-parallax-tilt';
import Panel from '../atoms/Panel';

const LoginPanel = ({ onLogin }) => {
  return (
    <Panel>
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        glareEnable={true}
        glareMaxOpacity={0.15}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-[0_0_40px_0_rgba(255,255,255,0.2)] hover:scale-[1.01]">
          <h5 className="text-1xl font-bold mb-6 text-center">
            Autentiqueu-vos utilitzant el vostre compte a:
          </h5>
          <button
            onClick={onLogin}
            className="bg-white text-black font-semibold py-3 w-full rounded-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 533.5 544.3">
              <path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4" />
              <path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853" />
              <path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04" />
              <path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335" />
            </svg>
            Google / @inspedralbes.cat
          </button>
        </div>
      </Tilt>
    </Panel>
  );
};

export default LoginPanel;
