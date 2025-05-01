import { createClient } from '@supabase/supabase-js';
import type { LeaderboardEntry } from '../types/game';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'http://localhost:3000',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'fallback-key'
);

export const saveScore = async (playerName: string, score: number): Promise<void> => {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('Supabase not configured - scores will not be saved');
    return;
  }

  try {
    await supabase
      .from('leaderboard')
      .insert([{ player_name: playerName, score }]);
  } catch (error) {
    console.error('Error saving score:', error);
  }
};

export const getLeaderboard = async (limit?: number): Promise<LeaderboardEntry[]> => {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.warn('Supabase not configured - leaderboard will not be loaded');
    return [];
  }

  try {
    let query = supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};