import React, { useState, useEffect } from 'react';
import { GameState, LeaderboardEntry } from '../types/game';
import { getLeaderboard } from '../utils/supabase';
import { Search, Info } from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
  onStart: (playerName: string) => void;
  onRestart: () => void;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, onStart, onRestart }) => {
  const { score, highScore, gameStatus } = gameState;
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState('');
  const [leaderboardError, setLeaderboardError] = useState(false);
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(showFullLeaderboard ? undefined : 10);
        setLeaderboard(data);
        setLeaderboardError(false);
      } catch (err) {
        setLeaderboardError(true);
        console.error('Failed to fetch leaderboard:', err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [showFullLeaderboard]);

  const handleStart = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    setError('');
    onStart(playerName);
  };

  const filteredLeaderboard = leaderboard.filter(entry =>
    entry.player_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleLeaderboard = () => {
    setShowFullLeaderboard(!showFullLeaderboard);
    setIsSearching(!showFullLeaderboard);
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* HUD - Score display and Credits button */}
      <div className="absolute top-4 left-4 flex items-start gap-4">
        <div className="bg-black bg-opacity-50 p-2 rounded-md text-white">
          <div className="text-lg font-bold">Score: {score}</div>
          <div className="text-sm">High Score: {highScore}</div>
        </div>
        <button
          onClick={() => setShowCredits(true)}
          className="bg-black bg-opacity-50 p-2 rounded-md text-white hover:bg-opacity-70 transition-all pointer-events-auto"
        >
          <Info size={24} />
        </button>
      </div>

      {/* Credits Modal */}
      {showCredits && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center pointer-events-auto">
          <div className="bg-gray-900 p-8 rounded-lg max-w-md text-white">
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Credits</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">Development</h3>
                <p>Yahm Herzlich</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">Beta Testing</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Austin McDaniel</li>
                  <li>Kingston Fuller</li>
                  <li>Torren Tomingin</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-purple-300">Special Thanks</h3>
                <p>The Baboons</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCredits(false)}
              className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className={`absolute top-4 right-4 bg-black bg-opacity-50 p-4 rounded-md text-white transition-all duration-300 ${showFullLeaderboard ? 'w-96 h-[80vh]' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Top Players</h2>
          <button
            onClick={toggleLeaderboard}
            className="text-sm text-purple-300 hover:text-purple-100 pointer-events-auto"
          >
            {showFullLeaderboard ? 'Show Less' : 'Show All'}
          </button>
        </div>

        {showFullLeaderboard && (
          <div className="mb-4 relative pointer-events-auto">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md pr-10"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
        )}

        <div className={`space-y-1 ${showFullLeaderboard ? 'h-[calc(80vh-120px)] overflow-y-auto' : ''}`}>
          {!leaderboardError ? (
            filteredLeaderboard.length > 0 ? (
              filteredLeaderboard.map((entry, index) => (
                <div key={entry.id} className="flex justify-between items-center p-2 hover:bg-white/10 rounded">
                  <div>
                    <span className="mr-2">{index + 1}.</span>
                    <span>{entry.player_name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>{entry.score}</span>
                    {showFullLeaderboard && (
                      <span className="text-xs text-gray-400">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400">
                {searchTerm ? 'No players found' : 'No scores yet'}
              </div>
            )
          ) : (
            <div className="text-gray-400">Leaderboard unavailable</div>
          )}
        </div>
      </div>

      {/* Start screen */}
      {gameStatus === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 pointer-events-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Parkour Stickman</h1>
            <div className="mb-6">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="px-4 py-2 rounded-md text-black"
                maxLength={20}
              />
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 rounded-md">
                  <span className="text-white">A/←</span>
                </div>
                <span className="text-white">Move Left</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 rounded-md">
                  <span className="text-white">D/→</span>
                </div>
                <span className="text-white">Move Right</span>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 rounded-md">
                  <span className="text-white">W/↑</span>
                </div>
                <span className="text-white">Jump (press twice for double jump)</span>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6">
              Slide along walls to slow your fall<br/>
              Jump off walls to reach distant platforms
            </p>
            
            <button 
              onClick={handleStart}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full pointer-events-auto transition-transform transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
      
      {/* Game Over screen */}
      {gameStatus === 'gameOver' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 pointer-events-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Game Over</h1>
            <p className="text-2xl text-gray-300 mb-2">Score: {score}</p>
            <p className="text-xl text-gray-400 mb-8">High Score: {highScore}</p>
            
            <button 
              onClick={onRestart}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full pointer-events-auto transition-transform transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {/* Mobile controls */}
      <div className="md:hidden absolute bottom-0 left-0 w-full h-32 flex items-center justify-between px-4 pointer-events-auto">
        {gameStatus === 'playing' && (
          <>
            <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <span className="text-4xl text-white opacity-50">←</span>
            </div>
            <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <span className="text-4xl text-white opacity-50">↑</span>
            </div>
            <div className="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
              <span className="text-4xl text-white opacity-50">→</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameUI;