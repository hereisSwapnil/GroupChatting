import { motion } from "framer-motion";

const YourMessage = ({ message }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex justify-end mb-4"
    >
      <div className="bg-indigo-500 text-white py-3 px-5 rounded-2xl rounded-tr-none shadow-lg shadow-indigo-500/20 max-w-[70%]">
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
};

export default YourMessage;
