import { motion } from "framer-motion";

const OtherMessage = ({ message, image, name }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-end gap-3 mb-4"
    >
      <img 
        alt={name} 
        src={image} 
        className="w-8 h-8 rounded-full object-cover border border-white/10" 
      />
      <div className="bg-white/10 text-gray-200 py-3 px-5 rounded-2xl rounded-bl-none border border-white/5 max-w-[70%]">
        <p className="text-xs text-indigo-500 mb-1 font-medium">{name}</p>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
};

export default OtherMessage;
