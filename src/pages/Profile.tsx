import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { User, Target, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();
  const { predictions, leaderboard, fixtures } = useData();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userStats = leaderboard.find(entry => entry.id === user.id);
  const userRank = leaderboard.findIndex(entry => entry.id === user.id) + 1;
  
  const correctPredictions = predictions.filter(p => p.points_earned && p.points_earned > 0).length;
  const totalPredictions = predictions.length;
  const accuracy = totalPredictions > 0 ? Math.round((correctPredictions / totalPredictions) * 100) : 0;
  
  const recentPredictions = predictions
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-4 rounded-full">
            <User className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {user.user_metadata?.username || 'Player'}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Rank</p>
              <p className="text-2xl font-bold text-gray-800">
                {userRank > 0 ? `#${userRank}` : 'Unranked'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Points</p>
              <p className="text-2xl font-bold text-gray-800">
                {userStats?.total_points || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Predictions</p>
              <p className="text-2xl font-bold text-gray-800">{totalPredictions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Accuracy</p>
              <p className="text-2xl font-bold text-gray-800">{accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prediction History */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Predictions</h2>
          {recentPredictions.length > 0 ? (
            <div className="space-y-3">
              {recentPredictions.map((prediction) => {
                const fixture = fixtures.find(f => f.id === prediction.fixture_id);
                if (!fixture) return null;

                const predictionText = prediction.predicted_winner === 'home'
                  ? fixture.home_team.short_name
                  : prediction.predicted_winner === 'away'
                  ? fixture.away_team.short_name
                  : 'Draw';

                return (
                  <div
                    key={prediction.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {fixture.home_team.short_name} vs {fixture.away_team.short_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Predicted: {predictionText}
                      </p>
                    </div>
                    <div className="text-right">
                      {prediction.points_earned !== undefined ? (
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          prediction.points_earned > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {prediction.points_earned > 0 ? '+' : ''}{prediction.points_earned} pts
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No predictions yet. Start predicting to see your history!
            </p>
          )}
        </div>

        {/* Performance Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Correct Predictions</span>
              <span className="font-semibold text-green-600">{correctPredictions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Incorrect Predictions</span>
              <span className="font-semibold text-red-600">{totalPredictions - correctPredictions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Predictions</span>
              <span className="font-semibold text-gray-800">{totalPredictions}</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold text-blue-600">{accuracy}%</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}