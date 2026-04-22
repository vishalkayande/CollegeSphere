import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-4 relative" 
      style={{ backgroundImage: 'url("/background.jpg")' }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-4">
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="CollegeSphere Logo" 
          className="h-48 md:h-64 w-auto mb-6 drop-shadow-2xl animate-in fade-in zoom-in duration-700" 
        />

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight drop-shadow-md">
          Welcome to <span className="text-[#003B5C]">College</span><span className="text-[#00B5AD]">Sphere</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 font-medium mb-10 drop-shadow-sm">
          The ultimate platform for academic event management and student collaboration.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/login" 
            className="px-10 py-4 bg-[#003B5C] hover:bg-[#002a42] text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl border border-[#003B5C]"
          >
            Login to Account
          </Link>
          <Link 
            to="/signup" 
            className="px-10 py-4 bg-transparent hover:bg-white/10 text-white text-lg font-bold rounded-xl transition-all transform hover:scale-105 shadow-xl border-2 border-white backdrop-blur-sm"
          >
            Create New Account
          </Link>
        </div>
      </div>

      {/* Footer-like text */}
      <div className="absolute bottom-8 text-gray-400 text-sm font-medium z-10">
        © 2026 CollegeSphere. All rights reserved.
      </div>
    </div>
  );
};

export default Home;
