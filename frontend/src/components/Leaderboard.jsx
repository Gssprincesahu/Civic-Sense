import React from "react";
import { Link } from "react-router-dom";

const Leaderboard = () => {
  const users = [
    { rank: 1, name: "Alice", points: 120 },
    { rank: 2, name: "Bob", points: 95 },
    { rank: 3, name: "Charlie", points: 80 },
    { rank: 4, name: "David", points: 60 },
    { rank: 5, name: "Eva", points: 50 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-yellow-600 text-2xl">🏆</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
        <p className="text-gray-600">Top contributors in the community</p>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full max-w-2xl bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Rank</th>
              <th className="p-3">Name</th>
              <th className="p-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.rank}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-3 font-semibold text-gray-800">
                  {user.rank === 1
                    ? "🥇"
                    : user.rank === 2
                    ? "🥈"
                    : user.rank === 3
                    ? "🥉"
                    : user.rank}
                </td>
                <td className="p-3">{user.name}</td>
                <td className="p-3 text-right font-medium text-blue-600">
                  {user.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        {/* How to Increase Reputation */}
      <div className="w-full max-w-2xl bg-white shadow rounded-xl p-6 mt-8 overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          How to Increase Your Reputation
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Earn Points */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Earn Points By:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Reporting valid community issues (+10 points)</li>
              <li>Having your issues resolved (+20 points)</li>
              <li>Adding helpful comments (+5 points)</li>
              <li>Receiving upvotes on reports (+2 points each)</li>
            </ul>
          </div>

          {/* Best Practices */}
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Best Practices:</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Include clear photos with your reports</li>
              <li>Provide detailed descriptions</li>
              <li>Use accurate location information</li>
              <li>Engage constructively with the community</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
