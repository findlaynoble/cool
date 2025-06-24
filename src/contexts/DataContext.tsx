import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export interface Team {
  id: number;
  name: string;
  logo: string;
  short_name: string;
}

export interface Fixture {
  id: number;
  home_team: Team;
  away_team: Team;
  match_date: string;
  status: 'upcoming' | 'live' | 'finished';
  home_score?: number;
  away_score?: number;
  winner?: 'home' | 'away' | 'draw';
}

export interface Prediction {
  id: number;
  fixture_id: number;
  user_id: string;
  predicted_winner: 'home' | 'away' | 'draw';
  points_earned?: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  total_points: number;
  correct_predictions: number;
  total_predictions: number;
}

interface DataContextType {
  teams: Team[];
  fixtures: Fixture[];
  predictions: Prediction[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  makePrediction: (fixtureId: number, winner: 'home' | 'away' | 'draw') => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTeams = async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error loading teams:', error);
      return;
    }
    
    setTeams(data || []);
  };

  const loadFixtures = async () => {
    const { data, error } = await supabase
      .from('fixtures')
      .select(`
        *,
        home_team:teams!fixtures_home_team_id_fkey(*),
        away_team:teams!fixtures_away_team_id_fkey(*)
      `)
      .order('match_date');
    
    if (error) {
      console.error('Error loading fixtures:', error);
      return;
    }
    
    setFixtures(data || []);
  };

  const loadPredictions = async () => {
    if (!user) {
      setPredictions([]);
      return;
    }

    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error loading predictions:', error);
      return;
    }
    
    setPredictions(data || []);
  };

  const loadLeaderboard = async () => {
    const { data, error } = await supabase
      .from('leaderboard_view')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error loading leaderboard:', error);
      return;
    }
    
    setLeaderboard(data || []);
  };

  const makePrediction = async (fixtureId: number, winner: 'home' | 'away' | 'draw') => {
    if (!user) throw new Error('Must be logged in to make predictions');

    // Check if prediction already exists
    const existingPrediction = predictions.find(p => p.fixture_id === fixtureId);
    
    if (existingPrediction) {
      // Update existing prediction
      const { error } = await supabase
        .from('predictions')
        .update({ predicted_winner: winner })
        .eq('id', existingPrediction.id);
      
      if (error) throw error;
    } else {
      // Create new prediction
      const { error } = await supabase
        .from('predictions')
        .insert({
          fixture_id: fixtureId,
          user_id: user.id,
          predicted_winner: winner,
        });
      
      if (error) throw error;
    }

    await loadPredictions();
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      loadTeams(),
      loadFixtures(),
      loadPredictions(),
      loadLeaderboard(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const value = {
    teams,
    fixtures,
    predictions,
    leaderboard,
    loading,
    makePrediction,
    refreshData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}