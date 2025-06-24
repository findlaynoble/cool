import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Trophy, Target, Users, Calendar } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { fixtures, predictions, leaderboard } = useData();

  const upcomingFixtures = fixtures.filter(f => f.status === 'upcoming').slice(0, 3);
  const userPredictions = predictions.length;
  const userRank = user ? leaderboard.findIndex(entry => entry.id === user.id) + 1 : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Premier League Predictor
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Predict match winners, earn points, and climb the leaderboard!
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/fixtures"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                View Fixtures
              </Link>
            </div>
          ) : (
            <Link
              to="/fixtures"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Make Predictions
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Your Predictions</p>
                <p className="text-2xl font-bold text-gray-800">{userPredictions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Your Rank</p>
                <p className="text-2xl font-bold text-gray-800">
                  {userRank > 0 ? `#${userRank}` : 'Unranked'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-gray-800">{leaderboard.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Fixtures */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-green-600" />
            <span>Upcoming Fixtures</span>
          </h2>
          <Link
            to="/fixtures"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            View All
          </Link>
        </div>

        {upcomingFixtures.length > 0 ? (
          <div className="space-y-4">
            {upcomingFixtures.map((fixture) => (
              <div
                key={fixture.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={fixture.home_team.logo}
                      alt={fixture.home_team.name}
                      className="w-8 h-8"
                    />
                    <span className="font-medium">{fixture.home_team.short_name}</span>
                  </div>
                  <span className="text-gray-500">vs</span>
                  <div className="flex items-center space-x-2">
                    <img
                      src={fixture.away_team.logo}
                      alt={fixture.away_team.name}
                      className="w-8 h-8"
                    />
                    <span className="font-medium">{fixture.away_team.short_name}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(fixture.match_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No upcoming fixtures available</p>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">1</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Make Predictions</h3>
            <p className="text-gray-600">
              Choose the winner for upcoming Premier League matches
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Earn Points</h3>
            <p className="text-gray-600">
              Get points for correct predictions when matches finish
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Climb the Leaderboard</h3>
            <p className="text-gray-600">
              Compete with other players for the top spot
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}