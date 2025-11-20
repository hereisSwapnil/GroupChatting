import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Shield, Zap, Globe } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <MessageSquare className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            ChatApp
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
            Login
          </Link>
          <Link to="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Connect with anyone, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              anywhere in the world.
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Experience the next generation of messaging. Secure, fast, and beautiful. 
            Designed for modern teams and communities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
              Start Chatting Now
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              Login to Account
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
        >
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-primary" />}
            title="Lightning Fast"
            description="Real-time message delivery with zero latency. Built for speed and reliability."
          />
          <FeatureCard 
            icon={<Shield className="w-8 h-8 text-accent" />}
            title="Secure & Private"
            description="End-to-end encryption ensures your conversations stay private and secure."
          />
          <FeatureCard 
            icon={<Globe className="w-8 h-8 text-blue-400" />}
            title="Global Connect"
            description="Connect with friends and colleagues across the globe instantly."
          />
        </motion.div>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-card p-8 rounded-2xl text-left hover:transform hover:-translate-y-2 transition-all duration-300">
    <div className="w-14 h-14 bg-dark-lighter/50 rounded-xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

export default LandingPage;
