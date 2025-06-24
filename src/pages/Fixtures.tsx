import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Fixtures() {
  const { user } = useAuth();
  const { fixtures, predictions, makePrediction, loading } = useData();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'finished'>('upcoming');
  const [submitting, setSubmitting] = useState<number | null>(null);

  const filteredFixtures = fixtures.filter(fixture => {
    if (filter === 'all') return true;
    return fixture.status === filter;
  });

  const handlePrediction = async (fixtureId: number, winner: 'home' | 'away' | 'draw') => {
    if (!user) return;
    
    setSubmitting(fixtureId);
    try {
      await makePrediction(fixtureId, winner);
    } catch (error) {
      console.error('Error making prediction:', error);
    } finally {
      setSubmitting(null);
    }
  };

  const getUserPrediction = (fixtureId: number) => {
    return predictions.find(p => p.fixture_id === fixtureId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'live':
        return <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse" />;
      case 'finished':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-green-600" />
            <span>Fixtures</span>
          </h1>
          
          {!user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800">
                <Link to="/login" className="font-medium underline">Login</Link> to make predictions
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'live', label: 'Live' },
            { key: 'finished', label: 'Finished' },
            { key: 'all', label: 'All' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === key
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures List */}
      <div className="space-y-4">
        {filteredFixtures.length > 0 ? (
          filteredFixtures.map((fixture) => {
            const userPrediction = getUserPrediction(fixture.id);
            const isSubmittingThis = submitting === fixture.id;
            
            return (
              <div
                key={fixture.id}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  {/* Match Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-3">
                      {getStatusIcon(fixture.status)}
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {fixture.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(fixture.match_date).toLocaleDateString()} at{' '}
                        {new Date(fixture.match_date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between max-w-md">
                      {/* Home Team */}
                      <div className="flex items-center space-x-3 flex-1">
                        <img
                          src={fixture.home_team.logo}
                          alt={fixture.home_team.name}
                          className="w-10 h-10"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {fixture.home_team.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {fixture.home_team.short_name}
                          </p>
                        </div>
                      </div>

                      {/* Score or VS */}
                      <div className="px-4 text-center">
                        {fixture.status === 'finished' && fixture.home_score !== undefined ? (
                          <div className="text-2xl font-bold text-gray-800">
                            {fixture.home_score} - {fixture.away_score}
                          </div>
                        ) : (
                          <div className="text-gray-500 font-medium">VS</div>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center space-x-3 flex-1 justify-end">
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {fixture.away_team.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {fixture.away_team.short_name}
                          </p>
                        </div>
                        <img
                          src={fixture.away_team.logo}
                          alt={fixture.away_team.name}
                          className="w-10 h-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Prediction Section */}
                  {user && fixture.status === 'upcoming' && (
                    <div className="lg:ml-8">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        {userPrediction ? 'Your Prediction:' : 'Make Prediction:'}
                      </p>
                      <div className="flex space-x-2">
                        {[
                          { key: 'home', label: fixture.home_team.short_name },
                          { key: 'draw', label: 'Draw' },
                          { key: 'away', label: fixture.away_team.short_name },
                        ].map(({ key, label }) => (
                          <button
                            key={key}
                            onClick={() => handlePrediction(fixture.id, key as any)}
                            disabled={isSubmittingThis}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              userPrediction?.predicted_winner === key
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${isSubmittingThis ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isSubmittingThis ? '...' : label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Show prediction result for finished matches */}
                  {user && fixture.status === 'finished' && userPrediction && (
                    <div className="lg:ml-8">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Your Prediction
                        </p>
                        <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          userPrediction.points_earned && userPrediction.points_earned > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {userPrediction.predicted_winner === 'home'
                            ? fixture.home_team.short_name
                            : userPrediction.predicted_winner === 'away'
                            ? fixture.away_team.short_name
                            : 'Draw'}
                        </div>
                        {userPrediction.points_earned !== undefined && (
                          <p className="text-xs mt-1 text-gray-600">
                            +{userPrediction.points_earned} points
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-100 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No {filter !== 'all' ? filter : ''} fixtures found
            </h3>
            <p className="text-gray-600">
              Check back later for more fixtures to predict on!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}