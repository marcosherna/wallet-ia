import { isSupabaseConfigured, supabase } from "./supabase";
import type {
  Account,
  CategoryBudget,
  Goal,
  Loan,
  Preferences,
  Transaction,
} from "../core/types/Finance";
import { seed } from "../core/mocks/Finance";
import { FinancialProfile } from "../features/onboarding/onboarding.data";
import { ChatMessage } from "../features/ai/aiService";

export interface UserProfileData {
  id: string;
  email: string;
  fullName: string;
  jobStatus: string;
  monthlyIncome: number;
  primaryGoal: string;
  onboardingCompleted: boolean;
  preferences: Preferences;
}

// Memoria local de respaldo cuando Supabase/Firebase no está configurado (Modo Demo / Offline)
let localState = {
  accounts: [...seed.accounts],
  transactions: [...seed.transactions],
  goals: [...seed.goals],
  budgets: [...seed.budgets],
  loans: [...seed.loans],
  preferences: { ...seed.preferences },
  messages: [] as ChatMessage[],
  profile: {
    id: "demo-user",
    email: "demo@wallet-ia.app",
    fullName: "Usuario Demo",
    jobStatus: "employed",
    monthlyIncome: 3500,
    primaryGoal: "emergency",
    onboardingCompleted: true,
    preferences: { ...seed.preferences },
  } as UserProfileData,
};

export const databaseService = {
  async getProfile(userId: string): Promise<UserProfileData | null> {
    if (!isSupabaseConfigured()) {
      return localState.profile;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        email: data.email || "",
        fullName: data.full_name || "",
        jobStatus: data.job_status || "",
        monthlyIncome: Number(data.monthly_income) || 0,
        primaryGoal: data.primary_goal || "",
        onboardingCompleted: Boolean(data.onboarding_completed),
        preferences: {
          currency: data.currency || "USD",
          biometrics: Boolean(data.biometrics),
          pinEnabled: Boolean(data.pin_enabled),
          notifications: Boolean(data.notifications),
          themeMode: data.theme_mode || "system",
        },
      };
    } catch (e) {
      console.warn("Error fetching profile from database:", e);
      return localState.profile;
    }
  },

  async updateProfile(
    userId: string,
    patch: Partial<UserProfileData>,
  ): Promise<boolean> {
    localState.profile = { ...localState.profile, ...patch };

    if (!isSupabaseConfigured()) return true;

    try {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (patch.fullName !== undefined)
        updatePayload.full_name = patch.fullName;
      if (patch.jobStatus !== undefined)
        updatePayload.job_status = patch.jobStatus;
      if (patch.monthlyIncome !== undefined)
        updatePayload.monthly_income = patch.monthlyIncome;
      if (patch.primaryGoal !== undefined)
        updatePayload.primary_goal = patch.primaryGoal;
      if (patch.onboardingCompleted !== undefined)
        updatePayload.onboarding_completed = patch.onboardingCompleted;

      const { error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", userId);

      return !error;
    } catch (e) {
      console.warn("Error updating profile in database:", e);
      return false;
    }
  },

  async saveOnboarding(
    userId: string,
    profile: FinancialProfile,
  ): Promise<boolean> {
    localState.profile = {
      ...localState.profile,
      jobStatus: profile.jobStatus,
      monthlyIncome: Number(profile.monthlyIncome) || 0,
      primaryGoal: profile.primaryGoal,
      onboardingCompleted: true,
    };

    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        job_status: profile.jobStatus,
        monthly_income: Number(profile.monthlyIncome) || 0,
        primary_goal: profile.primaryGoal,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });
      return !error;
    } catch (e) {
      console.warn("Error saving onboarding to database:", e);
      return false;
    }
  },

  async updatePreferences(
    userId: string,
    patch: Partial<Preferences>,
  ): Promise<boolean> {
    localState.preferences = { ...localState.preferences, ...patch };

    if (!isSupabaseConfigured()) return true;

    try {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (patch.currency !== undefined) updatePayload.currency = patch.currency;
      if (patch.biometrics !== undefined)
        updatePayload.biometrics = patch.biometrics;
      if (patch.pinEnabled !== undefined)
        updatePayload.pin_enabled = patch.pinEnabled;
      if (patch.notifications !== undefined)
        updatePayload.notifications = patch.notifications;
      if (patch.themeMode !== undefined)
        updatePayload.theme_mode = patch.themeMode;

      const { error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", userId);

      return !error;
    } catch (e) {
      console.warn("Error updating preferences in database:", e);
      return false;
    }
  },

  // ==========================================
  // CARGA COMPLETA DE FINANZAS
  // ==========================================
  async loadAllFinanceData(userId: string) {
    if (!isSupabaseConfigured()) {
      return {
        accounts: localState.accounts,
        transactions: localState.transactions,
        goals: localState.goals,
        budgets: localState.budgets,
        loans: localState.loans,
        preferences: localState.preferences,
      };
    }

    try {
      const [
        accountsRes,
        transactionsRes,
        goalsRes,
        budgetsRes,
        loansRes,
        profileRes,
      ] = await Promise.all([
        supabase.from("accounts").select("*").eq("user_id", userId),
        supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("date", { ascending: false }),
        supabase.from("goals").select("*").eq("user_id", userId),
        supabase.from("budgets").select("*").eq("user_id", userId),
        supabase.from("loans").select("*").eq("user_id", userId),
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
      ]);

      const accounts: Account[] = (accountsRes.data || []).map((row) => ({
        id: row.id,
        name: row.name,
        type: row.type,
        balance: Number(row.balance) || 0,
        institution: row.institution || undefined,
      }));

      const transactions: Transaction[] = (transactionsRes.data || []).map(
        (row) => ({
          id: row.id,
          type: row.type,
          amount: Number(row.amount) || 0,
          categoryId: row.category_id,
          accountId: row.account_id,
          toAccountId: row.to_account_id || undefined,
          note: row.note || "",
          tags: row.tags || [],
          date: row.date,
        }),
      );

      const goals: Goal[] = (goalsRes.data || []).map((row) => ({
        id: row.id,
        name: row.name,
        target: Number(row.target) || 0,
        saved: Number(row.saved) || 0,
        deadline: row.deadline,
        icon: row.icon,
        monthlyContribution: Number(row.monthly_contribution) || 0,
      }));

      const budgets: CategoryBudget[] = (budgetsRes.data || []).map((row) => ({
        id: row.id,
        categoryId: row.category_id,
        limit: Number(row.limit_amount) || 0,
      }));

      const loans: Loan[] = (loansRes.data || []).map((row) => ({
        id: row.id,
        name: row.name,
        kind: row.kind,
        principal: Number(row.principal) || 0,
        apr: Number(row.apr) || 0,
        termMonths: Number(row.term_months) || 0,
        monthlyPayment: Number(row.monthly_payment) || 0,
        paymentDay: Number(row.payment_day) || 1,
        paidInstallments: Number(row.paid_installments) || 0,
      }));

      const profile = profileRes.data;
      const preferences: Preferences = profile
        ? {
            currency: profile.currency || "USD",
            biometrics: Boolean(profile.biometrics),
            pinEnabled: Boolean(profile.pin_enabled),
            notifications: Boolean(profile.notifications),
            themeMode: profile.theme_mode || "system",
          }
        : seed.preferences;

      // Si es un usuario nuevo en la BD, creamos datos base para que no empiece vacío
      if (
        accounts.length === 0 &&
        transactions.length === 0 &&
        goals.length === 0
      ) {
        return {
          accounts: seed.accounts,
          transactions: seed.transactions,
          goals: seed.goals,
          budgets: seed.budgets,
          loans: seed.loans,
          preferences,
        };
      }

      return {
        accounts,
        transactions,
        goals,
        budgets,
        loans,
        preferences,
      };
    } catch (e) {
      console.warn("Error loading data from database:", e);
      return {
        accounts: localState.accounts,
        transactions: localState.transactions,
        goals: localState.goals,
        budgets: localState.budgets,
        loans: localState.loans,
        preferences: localState.preferences,
      };
    }
  },

  // ==========================================
  // TRANSACCIONES (CRUD)
  // ==========================================
  async addTransaction(userId: string, tx: Transaction): Promise<boolean> {
    localState.transactions = [tx, ...localState.transactions];
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from("transactions").insert({
        id: tx.id,
        user_id: userId,
        type: tx.type,
        amount: tx.amount,
        category_id: tx.categoryId,
        account_id: tx.accountId,
        to_account_id: tx.toAccountId ?? null,
        note: tx.note,
        tags: tx.tags,
        date: tx.date,
      });
      return !error;
    } catch (e) {
      console.warn("Error adding transaction to database:", e);
      return false;
    }
  },

  async updateTransaction(
    userId: string,
    id: string,
    patch: Partial<Pick<Transaction, "categoryId" | "note" | "tags">>,
  ): Promise<boolean> {
    localState.transactions = localState.transactions.map((t) =>
      t.id === id ? { ...t, ...patch } : t,
    );
    if (!isSupabaseConfigured()) return true;

    try {
      const updateData: Record<string, any> = {};
      if (patch.categoryId) updateData.category_id = patch.categoryId;
      if (patch.note !== undefined) updateData.note = patch.note;
      if (patch.tags !== undefined) updateData.tags = patch.tags;

      const { error } = await supabase
        .from("transactions")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error updating transaction in database:", e);
      return false;
    }
  },

  async deleteTransaction(userId: string, id: string): Promise<boolean> {
    localState.transactions = localState.transactions.filter(
      (t) => t.id !== id,
    );
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error deleting transaction from database:", e);
      return false;
    }
  },

  // ==========================================
  // CUENTAS (CRUD)
  // ==========================================
  async addAccount(userId: string, account: Account): Promise<boolean> {
    localState.accounts = [...localState.accounts, account];
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from("accounts").insert({
        id: account.id,
        user_id: userId,
        name: account.name,
        type: account.type,
        balance: account.balance,
        institution: account.institution ?? null,
      });
      return !error;
    } catch (e) {
      console.warn("Error adding account to database:", e);
      return false;
    }
  },

  async updateAccountBalance(
    userId: string,
    accountId: string,
    newBalance: number,
  ): Promise<boolean> {
    localState.accounts = localState.accounts.map((a) =>
      a.id === accountId ? { ...a, balance: newBalance } : a,
    );
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("accounts")
        .update({ balance: newBalance })
        .eq("id", accountId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error updating account balance in database:", e);
      return false;
    }
  },

  async deleteAccount(userId: string, accountId: string): Promise<boolean> {
    localState.accounts = localState.accounts.filter((a) => a.id !== accountId);
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("id", accountId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error deleting account from database:", e);
      return false;
    }
  },

  // ==========================================
  // METAS (CRUD)
  // ==========================================
  async addGoal(userId: string, goal: Goal): Promise<boolean> {
    localState.goals = [...localState.goals, goal];
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from("goals").insert({
        id: goal.id,
        user_id: userId,
        name: goal.name,
        target: goal.target,
        saved: goal.saved,
        deadline: goal.deadline,
        icon: goal.icon,
        monthly_contribution: goal.monthlyContribution,
      });
      return !error;
    } catch (e) {
      console.warn("Error adding goal to database:", e);
      return false;
    }
  },

  async updateGoalSaved(
    userId: string,
    goalId: string,
    saved: number,
  ): Promise<boolean> {
    localState.goals = localState.goals.map((g) =>
      g.id === goalId ? { ...g, saved } : g,
    );
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("goals")
        .update({ saved })
        .eq("id", goalId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error updating goal saved in database:", e);
      return false;
    }
  },

  async updateGoal(
    userId: string,
    goalId: string,
    patch: Partial<Goal>,
  ): Promise<boolean> {
    localState.goals = localState.goals.map((g) =>
      g.id === goalId ? { ...g, ...patch } : g,
    );
    if (!isSupabaseConfigured()) return true;

    try {
      const updateData: Record<string, any> = {};
      if (patch.name !== undefined) updateData.name = patch.name;
      if (patch.target !== undefined) updateData.target = patch.target;
      if (patch.saved !== undefined) updateData.saved = patch.saved;
      if (patch.deadline !== undefined) updateData.deadline = patch.deadline;
      if (patch.icon !== undefined) updateData.icon = patch.icon;
      if (patch.monthlyContribution !== undefined)
        updateData.monthly_contribution = patch.monthlyContribution;

      const { error } = await supabase
        .from("goals")
        .update(updateData)
        .eq("id", goalId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error updating goal in database:", e);
      return false;
    }
  },

  async deleteGoal(userId: string, goalId: string): Promise<boolean> {
    localState.goals = localState.goals.filter((g) => g.id !== goalId);
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", goalId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error deleting goal from database:", e);
      return false;
    }
  },

  // ==========================================
  // PRESUPUESTOS (CRUD)
  // ==========================================
  async saveBudget(userId: string, budget: CategoryBudget): Promise<boolean> {
    localState.budgets = localState.budgets.some(
      (b) => b.categoryId === budget.categoryId,
    )
      ? localState.budgets.map((b) =>
          b.categoryId === budget.categoryId
            ? { ...b, limit: budget.limit }
            : b,
        )
      : [...localState.budgets, budget];

    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from("budgets").upsert(
        {
          id: budget.id,
          user_id: userId,
          category_id: budget.categoryId,
          limit_amount: budget.limit,
        },
        { onConflict: "user_id,category_id" },
      );
      return !error;
    } catch (e) {
      console.warn("Error saving budget in database:", e);
      return false;
    }
  },

  async deleteBudget(userId: string, budgetId: string): Promise<boolean> {
    localState.budgets = localState.budgets.filter((b) => b.id !== budgetId);
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("budgets")
        .delete()
        .eq("id", budgetId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error deleting budget from database:", e);
      return false;
    }
  },

  // ==========================================
  // PRÉSTAMOS (CRUD)
  // ==========================================
  async addLoan(userId: string, loan: Loan): Promise<boolean> {
    localState.loans = [...localState.loans, loan];
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from("loans").insert({
        id: loan.id,
        user_id: userId,
        name: loan.name,
        kind: loan.kind,
        principal: loan.principal,
        apr: loan.apr,
        term_months: loan.termMonths,
        monthly_payment: loan.monthlyPayment,
        payment_day: loan.paymentDay,
        paid_installments: loan.paidInstallments,
      });
      return !error;
    } catch (e) {
      console.warn("Error adding loan to database:", e);
      return false;
    }
  },

  async updateLoanPaidInstallments(
    userId: string,
    loanId: string,
    paidInstallments: number,
  ): Promise<boolean> {
    localState.loans = localState.loans.map((l) =>
      l.id === loanId ? { ...l, paidInstallments } : l,
    );
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("loans")
        .update({ paid_installments: paidInstallments })
        .eq("id", loanId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error updating loan installment in database:", e);
      return false;
    }
  },

  async updateLoan(
    userId: string,
    loanId: string,
    patch: Partial<Loan>,
  ): Promise<boolean> {
    localState.loans = localState.loans.map((l) =>
      l.id === loanId ? { ...l, ...patch } : l,
    );
    if (!isSupabaseConfigured()) return true;

    try {
      const updateData: Record<string, any> = {};
      if (patch.name !== undefined) updateData.name = patch.name;
      if (patch.kind !== undefined) updateData.kind = patch.kind;
      if (patch.principal !== undefined) updateData.principal = patch.principal;
      if (patch.apr !== undefined) updateData.apr = patch.apr;
      if (patch.termMonths !== undefined)
        updateData.term_months = patch.termMonths;
      if (patch.monthlyPayment !== undefined)
        updateData.monthly_payment = patch.monthlyPayment;
      if (patch.paymentDay !== undefined)
        updateData.payment_day = patch.paymentDay;
      if (patch.paidInstallments !== undefined)
        updateData.paid_installments = patch.paidInstallments;

      const { error } = await supabase
        .from("loans")
        .update(updateData)
        .eq("id", loanId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error updating loan in database:", e);
      return false;
    }
  },

  async deleteLoan(userId: string, loanId: string): Promise<boolean> {
    localState.loans = localState.loans.filter((l) => l.id !== loanId);
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("loans")
        .delete()
        .eq("id", loanId)
        .eq("user_id", userId);

      return !error;
    } catch (e) {
      console.warn("Error deleting loan from database:", e);
      return false;
    }
  },

  // ==========================================
  // MENSAJES DE CHAT (ASESOR IA)
  // ==========================================
  async loadChatMessages(userId: string): Promise<ChatMessage[]> {
    if (!isSupabaseConfigured()) {
      return localState.messages;
    }

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error || !data) return localState.messages;

      return data.map((m) => ({
        id: m.id,
        role: m.role,
        text: m.text,
      }));
    } catch (e) {
      console.warn("Error loading chat messages from database:", e);
      return localState.messages;
    }
  },

  async saveChatMessage(
    userId: string,
    message: ChatMessage,
  ): Promise<boolean> {
    localState.messages.push(message);
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        id: message.id,
        user_id: userId,
        role: message.role,
        text: message.text,
      });
      return !error;
    } catch (e) {
      console.warn("Error saving chat message to database:", e);
      return false;
    }
  },

  async clearChatMessages(userId: string): Promise<boolean> {
    localState.messages = [];
    if (!isSupabaseConfigured()) return true;

    try {
      const { error } = await supabase
        .from("chat_messages")
        .delete()
        .eq("user_id", userId);
      return !error;
    } catch (e) {
      console.warn("Error clearing chat messages from database:", e);
      return false;
    }
  },
};
