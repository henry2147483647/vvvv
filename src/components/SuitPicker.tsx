import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { SUITS, getSuitSymbol, getSuitColor } from '../constants';

interface SuitPickerProps {
  onSelect: (suit: Suit) => void;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ onSelect }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-6">Choose a New Suit</h2>
        <div className="grid grid-cols-2 gap-4">
          {SUITS.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100
                hover:border-indigo-500 hover:bg-indigo-50 transition-all group
              `}
            >
              <span className={`text-5xl mb-2 ${getSuitColor(suit)} group-hover:scale-110 transition-transform`}>
                {getSuitSymbol(suit)}
              </span>
              <span className="text-slate-600 font-medium capitalize">{suit}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
