export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'coach' | 'atleta';
  email?: string;
  phone?: string;
}

export interface AthleteData {
  id: string;
  userId: string;
  vdot: number;
  plan: string;
  weeklyVolume: number[];
  activities: Activity[];
  stats: {
    sleep: string;
    hrv: string;
    weight: string;
    recovery: string;
  };
  prs: { dist: string; time: string; pace: string; date: string }[];
}

export interface Activity {
  id: string;
  date: string;
  type: string;
  distance: string;
  time: string;
  pace: string;
  notes: string;
}
