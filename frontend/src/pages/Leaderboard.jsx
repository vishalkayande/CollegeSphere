import { useState, useEffect } from 'react';
import { Trophy, Medal, Target, Star, ChevronUp, ChevronDown } from 'lucide-react';

const Leaderboard = () => {
  // Placeholder data for gamified leaderboard
  const [rankings, setRankings] = useState([
    { id: 1, name: 'Alice Smith', college: 'MIT', points: 1250, change: 'up' },
    { id: 2, name: 'Bob Johnson', college: 'Stanford', points: 1100, change: 'down' },
    { id: 3, name: 'Charlie Brown', college: 'IIT Bombay', points: 950, change: 'up' },
    { id: 4, name: 'Diana Prince', college: 'Harvard', points: 880, change: 'none' },
    { id: 5, name: 'Ethan Hunt', college: 'Oxford', points: 720, change: 'up' },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <img src="/logo.png" alt="CollegeSphere Logo" className="h-24 w-auto mx-auto mb-6 drop-shadow-md" />
        <h1 className="text-4xl font-black text-gray-900 mb-2 italic">LEADERBOARD</h1>
        <p className="text-gray-500 font-medium tracking-wide uppercase text-sm">Real-time participant rankings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {rankings.slice(0, 3).map((player, index) => (
          <div 
            key={player.id} 
            className={`relative p-8 rounded-[2.5rem] border-2 flex flex-col items-center text-center transition-transform hover:-translate-y-2 duration-300 ${
              index === 0 ? 'bg-blue-600 border-blue-600 text-white scale-110 z-10' : 
              index === 1 ? 'bg-white border-gray-100 text-gray-900' : 
              'bg-white border-gray-100 text-gray-900'
            }`}
          >
            <div className={`absolute -top-4 bg-white rounded-xl px-4 py-1 shadow-md text-xs font-black uppercase tracking-widest ${
              index === 0 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {index === 0 ? 'Champion' : index === 1 ? 'Runner Up' : 'Third Place'}
            </div>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 text-3xl font-black border-4 ${
              index === 0 ? 'bg-white/20 border-white/30' : 'bg-gray-50 border-gray-100'
            }`}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </div>
            <h3 className="text-xl font-bold mb-1">{player.name}</h3>
            <p className={`text-sm mb-4 font-medium ${index === 0 ? 'text-blue-100' : 'text-gray-400'}`}>{player.college}</p>
            <div className={`text-3xl font-black ${index === 0 ? 'text-yellow-400' : 'text-blue-600'}`}>
              {player.points} <span className="text-xs font-bold uppercase ml-1">pts</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Rank</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Participant</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">College</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rankings.map((player, index) => (
                <tr key={player.id} className="hover:bg-blue-50/50 transition duration-150 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-gray-300 group-hover:text-blue-600 transition">#{index + 1}</span>
                      {player.change === 'up' && <ChevronUp className="w-4 h-4 text-green-500" />}
                      {player.change === 'down' && <ChevronDown className="w-4 h-4 text-red-500" />}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition">
                        {player.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-800">{player.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium">{player.college}</td>
                  <td className="px-8 py-6 text-right">
                    <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-black text-sm border border-blue-100">
                      {player.points}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
