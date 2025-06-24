import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Medal, Award, Target } from 'lucide-react';

export default function Leaderboard() {
  const { leaderboard, loading } = useData();
  const { user } = useAuth();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
          <Trophy className="h-8 w-8 text-green-600" />
          <span>Leaderboard</span>
        </h1>
        <p className="text-gray-600 mt-2">
          See how you stack up against other predictors
        </p>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Top 3</h2>
          <div className="flex justify-center items-end space-x-4">
            {/* 2nd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-lg p-4 mb-2 h-24 flex flex-col justify-center">
                <Medal className="h-8 w-8 mx-auto mb-1" />
                <span className="text-sm font-bold">2nd</span>
              </div>
              <p className="font-semibold text-gray-800">{leaderboard[1]?.username}</p>
              <p className="text-sm text-gray-600">{leaderboard[1]?.total_points} pts</p>
            </div>

            {/* 1st Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg p-4 mb-2 h-32 flex flex-col justify-center">
                <Trophy className="h-10 w-10 mx-auto mb-1" />
                <span className="text-lg font-bold">1st</span>
              </div>
              <p className="font-semibold text-gray-800">{leaderboard[0]?.username}</p>
              <p className="text-sm text-gray-600">{leaderboard[0]?.total_points} pts</p>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-lg p-4 mb-2 h-20 flex flex-col justify-center">
                <Award className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm font-bold">3rd</span>
              </div>
              <p className="font-semibold text-gray-800">{leaderboard[2]?.username}</p>
              <p className="text-sm text-gray-600">{leaderboard[2]?.total_points} pts</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Full Rankings</h2>
        </div>
        
        {leaderboard.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = user?.id === entry.id;
              const accuracy = entry.total_predictions > 0 
                ? Math.round((entry.correct_predictions / entry.total_predictions) * 100)
                : 0;

              return (
                <div
                  key={entry.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    isCurrentUser ? 'bg-green-50 border-l-4 border-green-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadge(rank)}`}>
                        {getRankIcon(rank)}
                      </div>

                      {/* User Info */}
                      <div>
                        <p className={`font-semibold ${isCurrentUser ? 'text-green-800' : 'text-gray-800'}`}>
                          {entry.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Target className="h-4 w-4" />
                            <span>{entry.correct_predictions}/{entry.total_predictions} correct</span>
                          </span>
                          <span>{accuracy}% accuracy</span>
                        </div>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-800">
                        {entry.total_points}
                      </p>
                      <p className="text-sm text-gray-600">points</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No rankings yet
            </h3>
            <p className="text-gray-600">
              Be the first to make predictions and climb the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}