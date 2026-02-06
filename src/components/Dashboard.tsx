import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Income, Expense } from '../types/database';
import IncomeCard from './IncomeCard';
import ExpensesList from './ExpensesList';
import AddExpense from './AddExpense';
import SummaryCards from './SummaryCards';
import CategorySpendingChart from './CategorySpendingChart';
import TopExpenses from './TopExpenses';
import BudgetAlerts from './BudgetAlerts';
import InsightsHub from './InsightsHub';
import MonthTransitionModal from './MonthTransitionModal';
import WelcomeAnimation from './WelcomeAnimation';
import AppTour from './AppTour';
import UserProfileMenu from './UserProfileMenu';
import ErrorBoundary from './ErrorBoundary';
import { Wallet, HelpCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [income, setIncome] = useState<Income | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInDemoMode, setIsInDemoMode] = useState(false);
  
  // Store real data when entering demo mode
  const [realIncome, setRealIncome] = useState<Income | null>(null);
  const [realExpenses, setRealExpenses] = useState<Expense[]>([]);
  
  // Check if welcome animation should be shown
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState<string>('');

  const currentMonthYear = new Date().toISOString().slice(0, 7);

  // Load user profile and check if user should see welcome/tour
  useEffect(() => {
    if (!user) return;

    const checkWelcomeAndTour = async () => {
      const userKey = `user_${user.id}`;
      const hasSeenWelcomeThisSession = sessionStorage.getItem(`${userKey}_welcome_session`);

      // Load user profile to check welcome preference
      let showWelcomeAnimation = true; // Default to true
      let displayNameFromDB = '';

      try {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('display_name, show_welcome_animation')
          .eq('user_id', user.id)
          .single();

        if (!error && profile) {
          displayNameFromDB = profile.display_name || '';
          showWelcomeAnimation = profile.show_welcome_animation !== false;
        }
      } catch (error) {
        // Profile table not ready yet, using defaults
      }

      // Set display name
      if (displayNameFromDB) {
        setUserDisplayName(displayNameFromDB);
      } else {
        setUserDisplayName(user.email?.split('@')[0] || 'Usuário');
      }

      // Saudação: sempre aparece no primeiro login da sessão (se habilitado)
      if (showWelcomeAnimation && !hasSeenWelcomeThisSession) {
        setShowWelcome(true);
        sessionStorage.setItem(`${userKey}_welcome_session`, 'true');
      }
    };

    checkWelcomeAndTour();
  }, [user]);

  // Mark welcome as seen when animation completes
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    
    if (user) {
      const userKey = `user_${user.id}`;
      const hasCompletedTour = localStorage.getItem(`${userKey}_tour`);
      
      // Show tour after welcome animation ONLY if user never completed it before
      if (!hasCompletedTour) {
        setTimeout(() => setShowTour(true), 500);
      }
    }
  };

  const handleTourComplete = () => {
    if (user) {
      const userKey = `user_${user.id}`;
      localStorage.setItem(`${userKey}_tour`, 'true');
    }
    setShowTour(false);
    // Restore real data if in demo mode
    if (isInDemoMode) {
      setIncome(realIncome);
      setExpenses(realExpenses);
      setIsInDemoMode(false);
    }
  };

  const handleRestartTour = () => {
    // Save real data
    setRealIncome(income);
    setRealExpenses(expenses);
    
    // Clear data for demo mode
    setIncome(null);
    setExpenses([]);
    setIsInDemoMode(true);
    
    // Start tour
    setShowTour(true);
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);

    const [incomeResult, expensesResult] = await Promise.all([
      supabase
        .from('income')
        .select('*')
        .eq('user_id', user.id)
        .eq('month_year', currentMonthYear)
        .maybeSingle(),
      supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
    ]);

    if (incomeResult.data) {
      setIncome(incomeResult.data);
    }

    if (expensesResult.data) {
      setExpenses(expensesResult.data);
    }

    setLoading(false);
  };

  const handleIncomeUpdate = (newIncome: Income) => {
    setIncome(newIncome);
  };

  const handleExpenseAdded = (newExpense: Expense) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleExpenseUpdated = (updatedExpense: Expense) => {
    setExpenses(expenses.map(exp =>
      exp.id === updatedExpense.id ? updatedExpense : exp
    ));
  };

  const handleExpenseDeleted = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleBalanceUpdate = async (newBalance: number) => {
    if (!user) return;

    // Update income to reflect new balance
    const newIncomeAmount = newBalance + totalExpenses;
    
    const { data, error } = await supabase
      .from('income')
      .upsert({
        user_id: user.id,
        month_year: currentMonthYear,
        amount: newIncomeAmount,
        source: income?.source || 'Salário'
      })
      .select()
      .single();

    if (!error && data) {
      setIncome(data);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const balance = (income?.amount || 0) - totalExpenses;

  return (
    <>
      {/* Welcome Animation */}
      {showWelcome && (
        <WelcomeAnimation
          userName={userDisplayName}
          onComplete={handleWelcomeComplete}
        />
      )}

      {/* App Tour */}
      {showTour && !showWelcome && (
        <AppTour onComplete={handleTourComplete} />
      )}

      <div 
        className={`min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 transition-all duration-1000 ${
          showWelcome ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Month Transition Modal */}
        <MonthTransitionModal
          expenses={expenses}
          currentBalance={balance}
          onBalanceUpdate={handleBalanceUpdate}
        />

      <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-md">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FinanceControl
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRestartTour}
                className="flex items-center gap-2 px-3 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors duration-200"
                title="Iniciar tour guiado"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-semibold">Ajuda</span>
              </button>
              
              <UserProfileMenu />
            </div>
          </div>
        </div>
      </nav>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-700 ${
        showWelcome ? 'opacity-0' : 'opacity-100'
      }`}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div data-tour="summary-cards">
              <SummaryCards
                income={income?.amount || 0}
                totalExpenses={totalExpenses}
                balance={balance}
              />
            </div>

            {/* Hub de Insights com Abas */}
            <ErrorBoundary componentName="Insights">
              <div data-tour="insights-hub">
                <InsightsHub
                  income={income?.amount || 0}
                  expenses={expenses}
                  currentBalance={balance}
                  disableAutoplay={showTour}
                />
              </div>
            </ErrorBoundary>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1" data-tour="income-card">
                <IncomeCard
                  income={income}
                  monthYear={currentMonthYear}
                  onUpdate={handleIncomeUpdate}
                />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div data-tour="add-expense">
                  <AddExpense onExpenseAdded={handleExpenseAdded} />
                </div>
                <div data-tour="expenses-list">
                  <ExpensesList
                    expenses={expenses}
                    onExpenseUpdated={handleExpenseUpdated}
                    onExpenseDeleted={handleExpenseDeleted}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ErrorBoundary componentName="Gráfico de Gastos">
                <div data-tour="category-chart">
                  <CategorySpendingChart expenses={expenses} />
                </div>
              </ErrorBoundary>
              <div data-tour="top-expenses">
                <TopExpenses expenses={expenses} />
              </div>
            </div>

            {/* Budget Alerts - Floating notifications */}
            <ErrorBoundary componentName="Alertas de Orçamento">
              <BudgetAlerts expenses={expenses} />
            </ErrorBoundary>
          </div>
        )}
      </main>
    </div>
    </>
  );
}
