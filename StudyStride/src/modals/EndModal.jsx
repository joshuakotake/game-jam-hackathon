import React from 'react';

const EndModal = ({ healthLost, onRestart }) => {
  const getRanking = (healthLost) => {
    if (healthLost / 2 >= 9) return 'F';
    if (healthLost / 2 >= 7) return 'D';
    if (healthLost / 2 >= 5) return 'C';
    if (healthLost / 2 >= 3) return 'B';
    if (healthLost / 2 >= 1) return 'A';
    return 'S';
  };

  const getRankingColor = (rank) => {
    switch (rank) {
      case 'S': return 'text-yellow-400';
      case 'A': return 'text-green-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-orange-400';
      case 'D': return 'text-red-400';
      case 'F': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getRankingMessage = (rank) => {
    switch (rank) {
      case 'S': return 'Perfect! You maintained excellent health throughout!';
      case 'A': return 'Excellent! You kept yourself in great shape!';
      case 'B': return 'Good job! You managed your health well!';
      case 'C': return 'Not bad! There\'s room for improvement in self-care.';
      case 'D': return 'You struggled with self-care. Try to balance better next time.';
      case 'F': return 'Your health suffered significantly. Remember to take care of yourself!';
      default: return '';
    }
  };

  const rank = getRanking(healthLost);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Task Complete!
          </h2>
          
          <div className="mb-6">
            <div className="text-6xl font-bold mb-2">
              <span className={getRankingColor(rank)}>{rank}</span>
            </div>
            <div className="text-lg font-semibold text-gray-700 mb-2">
              Total Health Lost: {healthLost / 2}
            </div>
            <div className="text-sm text-gray-600">
              {getRankingMessage(rank)}
            </div>
          </div>

          <div className="mb-6 text-left bg-gray-100 p-4 rounded">
            <h3 className="font-semibold text-gray-800 mb-2">Ranking System:</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-yellow-400 font-semibold">S Rank:</span>
                <span>0 health lost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-400 font-semibold">A Rank:</span>
                <span>1-2 health lost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400 font-semibold">B Rank:</span>
                <span>3-4 health lost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-400 font-semibold">C Rank:</span>
                <span>5-6 health lost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400 font-semibold">D Rank:</span>
                <span>7-8 health lost</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 font-semibold">F Rank:</span>
                <span>9+ total health lost</span>
              </div>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Start New Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndModal;