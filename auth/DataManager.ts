import { AthleteData, User } from '../types/auth';

// Sistema de dados local
class DataManager {
  private static USERS_KEY = 'contratempo_users';
  private static ATHLETES_KEY = 'contratempo_athletes';
  private static COACH_KEY = 'contratempo_coach';

  static initializeCoach() {
    const users = this.getUsers();
    const coachExists = users.find((u) => u.role === 'coach');

    if (!coachExists) {
      const coach: User = {
        id: 'coach_1',
        username: 'coach',
        password: 'coach123',
        name: 'Coach Adriano',
        role: 'coach',
        email: 'coach@contratempo.com',
      };
      users.push(coach);
      this.saveUsers(users);
    }
  }

  static getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveUsers(users: User[]) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static authenticate(username: string, password: string): User | null {
    const users = this.getUsers();
    return users.find((u) => u.username === username && u.password === password) || null;
  }

  static registerAthlete(
    username: string,
    password: string,
    name: string,
    email: string,
    phone: string
  ): User {
    const users = this.getUsers();
    const newUser: User = {
      id: `athlete_${Date.now()}`,
      username,
      password,
      name,
      role: 'atleta',
      email,
      phone,
    };
    users.push(newUser);
    this.saveUsers(users);

    // Criar dados iniciais do atleta
    const athleteData: AthleteData = {
      id: newUser.id,
      userId: newUser.id,
      vdot: 0,
      plan: 'Iniciante',
      weeklyVolume: [0, 0, 0, 0, 0, 0, 0],
      activities: [],
      stats: {
        sleep: '0h 0m',
        hrv: '0ms',
        weight: '0kg',
        recovery: '0%',
      },
      prs: [],
    };
    this.saveAthleteData(athleteData);

    return newUser;
  }

  static getAthleteData(userId: string): AthleteData | null {
    const data = localStorage.getItem(this.ATHLETES_KEY);
    const athletes: AthleteData[] = data ? JSON.parse(data) : [];
    return athletes.find((a) => a.userId === userId) || null;
  }

  static getAllAthletesData(): AthleteData[] {
    const data = localStorage.getItem(this.ATHLETES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAthleteData(athleteData: AthleteData) {
    const data = localStorage.getItem(this.ATHLETES_KEY);
    let athletes: AthleteData[] = data ? JSON.parse(data) : [];

    const index = athletes.findIndex((a) => a.userId === athleteData.userId);
    if (index >= 0) {
      athletes[index] = athleteData;
    } else {
      athletes.push(athleteData);
    }

    localStorage.setItem(this.ATHLETES_KEY, JSON.stringify(athletes));
  }

  static getAthletes(): User[] {
    const users = this.getUsers();
    return users.filter((u) => u.role === 'atleta');
  }
}

export default DataManager;
