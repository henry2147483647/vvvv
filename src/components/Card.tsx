import React from 'react';
import { motion } from 'motion/react';
import { Card as CardType, Suit } from '../types';
import { getSuitColor, getSuitSymbol } from '../constants';

interface CardProps {
  card: CardType;
  isFaceDown?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceDown = false, 
  onClick, 
  isPlayable = false,
  className = '',
  index = 0
}) => {
  const symbol = getSuitSymbol(card.suit);
  const color = getSuitColor(card.suit);

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl border border-black/10 
        flex flex-col items-center justify-center cursor-pointer select-none
        ${isFaceDown ? 'bg-indigo-700' : 'bg-white'}
        ${isPlayable ? 'ring-4 ring-yellow-400 shadow-xl' : 'shadow-md'}
        ${className}
      `}
    >
      {isFaceDown ? (
        <div className="w-full h-full flex items-center justify-center p-2">
          <div className="w-full h-full border-2 border-white/20 rounded-lg flex items-center justify-center">
            <div className="text-white/30 text-4xl font-bold italic">T</div>
          </div>
        </div>
      ) : (
        <>
          <div className={`absolute top-2 left-2 flex flex-col items-center leading-none ${color}`}>
            <span className="text-lg sm:text-xl font-bold">{card.rank}</span>
            <span className="text-sm sm:text-base">{symbol}</span>
          </div>
          
          <div className={`text-4xl sm:text-6xl ${color}`}>
            {symbol}
          </div>

          <div className={`absolute bottom-2 right-2 flex flex-col items-center leading-none rotate-180 ${color}`}>
            <span className="text-lg sm:text-xl font-bold">{card.rank}</span>
            <span className="text-sm sm:text-base">{symbol}</span>
          </div>
        </>
      )}
    </motion.div>
  );
};
