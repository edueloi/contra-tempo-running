import {
  ActivityEntry,
  AlertItem,
  AthleteData,
  MetricsEntry,
  TrainingPlan,
  User,
} from '../types/auth';

class DataManager {
  private static USERS_KEY = 'contratempo_users';
  private static ATHLETES_KEY = 'contratempo_athletes';
  private static PLANS_KEY = 'contratempo_plans';
  private static ALERTS_KEY = 'contratempo_alerts';

  private static createId(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  }

  private static nowIso() {
    return new Date().toISOString();
  }

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

  static updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates };
    this.saveUsers(users);
    return users[index];
  }

  static deleteUser(userId: string) {
    const users = this.getUsers().filter((u) => u.id !== userId);
    this.saveUsers(users);

    const athletes = this.getAllAthletesData().filter((a) => a.userId != userId);
    localStorage.setItem(this.ATHLETES_KEY, JSON.stringify(athletes));

    const alerts = this.getAlerts().filter((a) => a.athleteId !== userId);
    this.saveAlerts(alerts);
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

    const athleteData: AthleteData = this.createDefaultAthleteData(newUser.id);
    this.saveAthleteData(athleteData);

    return newUser;
  }

  static getAthleteData(userId: string): AthleteData | null {
    const data = localStorage.getItem(this.ATHLETES_KEY);
    const athletes: AthleteData[] = data ? JSON.parse(data) : [];
    const athlete = athletes.find((a) => a.userId === userId) || null;
    return athlete ? this.normalizeAthleteData(athlete) : null;
  }

  static ensureAthleteData(userId: string): AthleteData {
    const existing = this.getAthleteData(userId);
    if (existing) return existing;

    const created = this.createDefaultAthleteData(userId);
    this.saveAthleteData(created);
    return created;
  }

  static getAllAthletesData(): AthleteData[] {
    const data = localStorage.getItem(this.ATHLETES_KEY);
    const athletes: AthleteData[] = data ? JSON.parse(data) : [];
    return athletes.map((a) => this.normalizeAthleteData(a));
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

  static updateAthleteData(userId: string, updates: Partial<AthleteData>) {
    const athlete = this.ensureAthleteData(userId);
    const updated: AthleteData = { ...athlete, ...updates };
    this.saveAthleteData(updated);
    this.recalculateAlertsForAthlete(userId);
    return updated;
  }

  static getAthletes(): User[] {
    const users = this.getUsers();
    return users.filter((u) => u.role === 'atleta');
  }

  static addActivity(userId: string, payload: Omit<ActivityEntry, 'id'>) {
    const athlete = this.ensureAthleteData(userId);
    const entry: ActivityEntry = { id: this.createId('activity'), ...payload };
    const activities = [...athlete.activities, entry];
    this.saveAthleteData({ ...athlete, activities });
    this.recalculateAlertsForAthlete(userId);
    return entry;
  }

  static addMetrics(userId: string, payload: Omit<MetricsEntry, 'id'>) {
    const athlete = this.ensureAthleteData(userId);
    const entry: MetricsEntry = { id: this.createId('metrics'), ...payload };
    const metrics = [...athlete.metrics, entry];
    this.saveAthleteData({ ...athlete, metrics });
    this.recalculateAlertsForAthlete(userId);
    return entry;
  }

  static getPlans(): TrainingPlan[] {
    const data = localStorage.getItem(this.PLANS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static savePlans(plans: TrainingPlan[]) {
    localStorage.setItem(this.PLANS_KEY, JSON.stringify(plans));
  }

  static createPlan(payload: Omit<TrainingPlan, 'id' | 'createdAt' | 'updatedAt'>) {
    const plans = this.getPlans();
    const now = this.nowIso();
    const plan: TrainingPlan = {
      ...payload,
      id: this.createId('plan'),
      createdAt: now,
      updatedAt: now,
    };
    plans.push(plan);
    this.savePlans(plans);
    return plan;
  }

  static updatePlan(planId: string, updates: Partial<TrainingPlan>) {
    const plans = this.getPlans();
    const index = plans.findIndex((p) => p.id === planId);
    if (index === -1) return null;
    plans[index] = { ...plans[index], ...updates, updatedAt: this.nowIso() };
    this.savePlans(plans);
    return plans[index];
  }

  static deletePlan(planId: string) {
    const plans = this.getPlans().filter((p) => p.id !== planId);
    this.savePlans(plans);

    const athletes = this.getAllAthletesData().map((a) =>
      a.planId === planId ? { ...a, planId: null } : a
    );
    localStorage.setItem(this.ATHLETES_KEY, JSON.stringify(athletes));
  }

  static assignPlanToAthlete(userId: string, planId: string | null) {
    const athlete = this.ensureAthleteData(userId);
    this.saveAthleteData({ ...athlete, planId });
    this.recalculateAlertsForAthlete(userId);
  }

  static getAlerts(): AlertItem[] {
    const data = localStorage.getItem(this.ALERTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveAlerts(alerts: AlertItem[]) {
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
  }

  static resolveAlert(alertId: string) {
    const alerts = this.getAlerts();
    const index = alerts.findIndex((a) => a.id === alertId);
    if (index === -1) return;
    alerts[index] = { ...alerts[index], resolvedAt: this.nowIso() };
    this.saveAlerts(alerts);
  }

  static recalculateAlertsForAthlete(userId: string) {
    const athlete = this.ensureAthleteData(userId);
    const alerts = this.getAlerts();
    const unresolved = alerts.filter((a) => a.athleteId !== userId || a.resolvedAt);

    const nextAlerts: AlertItem[] = [];
    const latestMetrics = this.getLatestMetrics(athlete.metrics);
    const weeklyVolume = this.getWeeklyVolume(athlete.activities, 7);
    const plan = athlete.planId ? this.getPlans().find((p) => p.id === athlete.planId) : null;

    if (latestMetrics && latestMetrics.sleepHours > 0 && latestMetrics.sleepHours < 6) {
      nextAlerts.push(this.buildAlert(userId, 'sono', 'medium', 'Sono baixo nas ultimas 24h.'));
    }

    if (latestMetrics && latestMetrics.recoveryPct > 0 && latestMetrics.recoveryPct < 60) {
      nextAlerts.push(this.buildAlert(userId, 'recovery', 'medium', 'Recovery abaixo de 60%.'));
    }

    if (plan && plan.weeklyTargetKm > 0 && weeklyVolume > plan.weeklyTargetKm * 1.2) {
      nextAlerts.push(this.buildAlert(userId, 'volume', 'high', 'Volume semanal acima do alvo.'));
    }

    if (weeklyVolume === 0) {
      nextAlerts.push(this.buildAlert(userId, 'inatividade', 'low', 'Nenhum treino registrado na semana.'));
    }

    this.saveAlerts([...unresolved, ...nextAlerts]);
  }

  static getWeeklyVolume(activities: ActivityEntry[], days: number) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return activities
      .filter((a) => new Date(a.date).getTime() >= cutoff)
      .reduce((sum, a) => sum + (Number(a.distanceKm) || 0), 0);
  }

  static getLatestMetrics(metrics: MetricsEntry[]) {
    if (!metrics.length) return null;
    return [...metrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  static buildAlert(userId: string, type: string, severity: AlertItem['severity'], message: string) {
    return {
      id: this.createId('alert'),
      athleteId: userId,
      type,
      severity,
      message,
      createdAt: this.nowIso(),
    } as AlertItem;
  }

  static normalizeAthleteData(athlete: AthleteData): AthleteData {
    return {
      id: athlete.id,
      userId: athlete.userId,
      vdot: athlete.vdot || 0,
      plan: athlete.plan || 'Iniciante',
      planId: athlete.planId ?? null,
      weeklyVolume: athlete.weeklyVolume || [0, 0, 0, 0, 0, 0, 0],
      activities: athlete.activities || [],
      metrics: athlete.metrics || [],
      stats: athlete.stats || {
        sleep: '0h 0m',
        hrv: '0ms',
        weight: '0kg',
        recovery: '0%',
      },
      prs: athlete.prs || [],
    };
  }

  static createDefaultAthleteData(userId: string): AthleteData {
    return {
      id: userId,
      userId,
      vdot: 0,
      plan: 'Iniciante',
      planId: null,
      weeklyVolume: [0, 0, 0, 0, 0, 0, 0],
      activities: [],
      metrics: [],
      stats: {
        sleep: '0h 0m',
        hrv: '0ms',
        weight: '0kg',
        recovery: '0%',
      },
      prs: [],
    };
  }
}

export default DataManager;
