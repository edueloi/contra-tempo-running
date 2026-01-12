export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'coach' | 'atleta';
  email?: string;
  phone?: string;
}

export interface TrainingPlan {
  id: string;
  name: string;
  level: string;
  goal: string;
  weeklyTargetKm: number;
  notes: string;
  workouts: Workout[];
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  title: string;
  day: string;
  type: string;
  distanceKm: number;
  durationMin: number;
  pace: string;
  notes: string;
}

export interface ActivityEntry {
  id: string;
  date: string;
  type: string;
  distanceKm: number;
  timeMin: number;
  pace: string;
  notes: string;
}

export interface MetricsEntry {
  id: string;
  date: string;
  sleepHours: number;
  hrv: number;
  weightKg: number;
  recoveryPct: number;
}

export interface AlertItem {
  id: string;
  athleteId: string;
  type: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AthleteData {
  id: string;
  userId: string;
  vdot: number;
  plan: string;
  planId: string | null;
  weeklyVolume: number[];
  activities: ActivityEntry[];
  metrics: MetricsEntry[];
  stats: {
    sleep: string;
    hrv: string;
    weight: string;
    recovery: string;
  };
  prs: { dist: string; time: string; pace: string; date: string }[];
}
