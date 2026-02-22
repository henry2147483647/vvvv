import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card as CardComponent } from './components/Card';
import { SuitPicker } from './components/SuitPicker';
import { Suit, Rank, Card, GameState, Turn } from './types';
import { createDeck, shuffle, isValidMove } from './constants';
import { Trophy, RotateCcw, User, Cpu, Info } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentSuit: null,
    currentRank: null,
    turn: 'player',
    status: 'dealing',
    winner: null,
  });

  const [showSuitPicker, setShowSuitPicker] = useState(false);
  const [pendingEightCard, setPendingEightCard] = useState<Card | null>(null);
  const [message, setMessage] = useState("Welcome to Tina Crazy 8s!");

  // Initialize Game
  const initGame = useCallback(() => {
    const fullDeck = shuffle(createDeck());
    const pHand = fullDeck.splice(0, 8);
    const aHand = fullDeck.splice(0, 8);
    
    // Find a non-8 card for the start
    let firstDiscardIndex = fullDeck.findIndex(c => c.rank !== Rank.EIGHT);
    if (firstDiscardIndex === -1) firstDiscardIndex = 0;
    const firstDiscard = fullDeck.splice(firstDiscardIndex, 1)[0];

    setState({
      deck: fullDeck,
      playerHand: pHand,
      aiHand: aHand,
      discardPile: [firstDiscard],
      currentSuit: firstDiscard.suit,
      currentRank: firstDiscard.rank,
      turn: 'player',
      status: 'playing',
      winner: null,
    });
    setMessage("Your turn! Match the suit or rank.");
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check for winner
  useEffect(() => {
    if (state.status === 'playing') {
      if (state.playerHand.length === 0) {
        setState(prev => ({ ...prev, status: 'gameOver', winner: 'player' }));
      } else if (state.aiHand.length === 0) {
        setState(prev => ({ ...prev, status: 'gameOver', winner: 'ai' }));
      }
    }
  }, [state.playerHand.length, state.aiHand.length, state.status]);

  // AI Logic
  useEffect(() => {
    if (state.status === 'playing' && state.turn === 'ai') {
      const timer = setTimeout(() => {
        const playableCards = state.aiHand.filter(c => 
          isValidMove(c, state.currentSuit!, state.currentRank!)
        );

        if (playableCards.length > 0) {
          // AI plays a card
          // Prefer non-8s if possible, or play 8 if nothing else
          const cardToPlay = playableCards.find(c => c.rank !== Rank.EIGHT) || playableCards[0];
          
          if (cardToPlay.rank === Rank.EIGHT) {
            // AI picks most frequent suit in hand
            const suitCounts = state.aiHand.reduce((acc, c) => {
              acc[c.suit] = (acc[c.suit] || 0) + 1;
              return acc;
            }, {} as Record<Suit, number>);
            
            const bestSuit = (Object.keys(suitCounts) as Suit[]).sort((a, b) => suitCounts[b] - suitCounts[a])[0] || Suit.HEARTS;
            
            playCard('ai', cardToPlay, bestSuit);
            setMessage(`AI played an 8 and chose ${bestSuit}!`);
          } else {
            playCard('ai', cardToPlay);
            setMessage(`AI played ${cardToPlay.rank} of ${cardToPlay.suit}.`);
          }
        } else {
          // AI draws
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.turn, state.status]);

  const playCard = (turn: Turn, card: Card, newSuit?: Suit) => {
    setState(prev => {
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
      const newHand = prev[handKey].filter(c => c.id !== card.id);
      
      return {
        ...prev,
        [handKey]: newHand,
        discardPile: [card, ...prev.discardPile],
        currentSuit: newSuit || card.suit,
        currentRank: card.rank,
        turn: turn === 'player' ? 'ai' : 'player',
      };
    });
  };

  const drawCard = (turn: Turn) => {
    setState(prev => {
      if (prev.deck.length === 0) {
        setMessage(`${turn === 'player' ? 'You' : 'AI'} had to skip! No cards left in deck.`);
        return { ...prev, turn: turn === 'player' ? 'ai' : 'player' };
      }

      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
      
      setMessage(`${turn === 'player' ? 'You' : 'AI'} drew a card.`);
      
      return {
        ...prev,
        deck: newDeck,
        [handKey]: [...prev[handKey], drawnCard],
        turn: turn === 'player' ? 'ai' : 'player',
      };
    });
  };

  const handlePlayerCardClick = (card: Card) => {
    if (state.turn !== 'player' || state.status !== 'playing') return;

    if (card.rank === Rank.EIGHT) {
      setPendingEightCard(card);
      setShowSuitPicker(true);
    } else if (isValidMove(card, state.currentSuit!, state.currentRank!)) {
      playCard('player', card);
      setMessage("Nice move!");
    }
  };

  const handleSuitSelect = (suit: Suit) => {
    if (pendingEightCard) {
      playCard('player', pendingEightCard, suit);
      setPendingEightCard(null);
      setShowSuitPicker(false);
      setMessage(`You chose ${suit}!`);
    }
  };

  return (
    <div className="min-h-screen felt-gradient font-sans text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-display font-black text-2xl italic shadow-lg">T</div>
          <h1 className="text-xl font-display font-bold tracking-tight">Tina Crazy 8s</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium">
            <Info size={16} />
            <span>Match Suit or Rank. 8 is Wild!</span>
          </div>
          <button 
            onClick={initGame}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Restart Game"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 relative p-4 flex flex-col items-center justify-between max-w-6xl mx-auto w-full">
        
        {/* AI Hand */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-white/60">
            <Cpu size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">AI Opponent ({state.aiHand.length})</span>
          </div>
          <div className="flex -space-x-12 sm:-space-x-16 overflow-visible">
            {state.aiHand.map((card, i) => (
              <CardComponent 
                key={card.id} 
                card={card} 
                isFaceDown 
                index={i}
                className="scale-75 sm:scale-90"
              />
            ))}
          </div>
        </div>

        {/* Center Table */}
        <div className="flex items-center gap-8 sm:gap-16 my-8">
          {/* Draw Pile */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-indigo-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div 
              onClick={() => state.turn === 'player' && drawCard('player')}
              className={`
                relative w-24 h-36 sm:w-32 sm:h-48 rounded-xl border-2 border-white/20 
                flex items-center justify-center cursor-pointer transition-transform
                ${state.turn === 'player' ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'}
                bg-indigo-800 shadow-2xl
              `}
            >
              <div className="text-white/20 text-4xl font-black italic">T</div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-white/40 uppercase">
                Draw ({state.deck.length})
              </div>
            </div>
          </div>

          {/* Discard Pile */}
          <div className="relative">
            <AnimatePresence mode="popLayout">
              {state.discardPile.slice(0, 1).map((card) => (
                <CardComponent 
                  key={card.id} 
                  card={card} 
                  className="shadow-2xl"
                />
              ))}
            </AnimatePresence>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="text-xs font-bold text-white/40 uppercase mb-1">Current</div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                <span className="text-sm font-bold">{state.currentSuit?.toUpperCase()}</span>
                <span className="text-sm opacity-50">/</span>
                <span className="text-sm font-bold">{state.currentRank}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl text-center"
          >
            <p className="text-lg font-display font-semibold text-white">{message}</p>
          </motion.div>
        </div>

        {/* Player Hand */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 text-white/60">
            <User size={18} />
            <span className="text-sm font-semibold uppercase tracking-wider">Your Hand ({state.playerHand.length})</span>
          </div>
          <div className="flex -space-x-12 sm:-space-x-16 hover:space-x-2 transition-all duration-300 p-4">
            {state.playerHand.map((card, i) => (
              <CardComponent 
                key={card.id} 
                card={card} 
                index={i}
                isPlayable={state.turn === 'player' && isValidMove(card, state.currentSuit!, state.currentRank!)}
                onClick={() => handlePlayerCardClick(card)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showSuitPicker && (
          <SuitPicker onSelect={handleSuitSelect} />
        )}

        {state.status === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="bg-white rounded-3xl p-12 max-w-md w-full shadow-2xl text-center text-slate-900">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trophy size={48} className="text-white" />
              </div>
              <h2 className="text-4xl font-display font-black mb-2">
                {state.winner === 'player' ? 'YOU WON!' : 'AI WON!'}
              </h2>
              <p className="text-slate-500 mb-8 text-lg">
                {state.winner === 'player' 
                  ? 'Fantastic playing! You cleared your hand first.' 
                  : 'Better luck next time! The AI was too fast.'}
              </p>
              <button
                onClick={initGame}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xl transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Turn Indicator */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8">
        <div className={`
          px-6 py-3 rounded-2xl border-2 transition-all duration-500 flex items-center gap-3 shadow-2xl
          ${state.turn === 'player' 
            ? 'bg-indigo-600 border-indigo-400 scale-110' 
            : 'bg-slate-800 border-slate-700 opacity-50'}
        `}>
          <div className={`w-3 h-3 rounded-full ${state.turn === 'player' ? 'bg-green-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="font-display font-bold uppercase tracking-widest text-sm">
            {state.turn === 'player' ? 'Your Turn' : 'AI Thinking...'}
          </span>
        </div>
      </div>
    </div>
  );
}
