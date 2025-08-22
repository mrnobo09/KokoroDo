import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <h1 className="text-4xl text-white mb-4">Welcome to the Worker App</h1>
      <p className="text-lg text-gray-300">This is the home screen of the worker application.</p>
    </div>
  );
}

export default Home;