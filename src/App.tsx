import { Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Layout from "./components/layout/Layout";
import BuildingsPage from "./pages/BuildingsPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import TransactionFormPage from "./pages/TransactionFormPage";
import { homePath } from "./utils/paths";
import MyPaymentsPage from "./pages/MyPaymentsPage";
import ExpensesPage from "./pages/ExpensesPage";
import PaymentGridPage from "./pages/PaymentGridPage";
import DebtorsPage from "./pages/DebtorsPage";
import ResidentsPage from "./pages/ResidentsPage";
import ReceiptPage from "./pages/ReceiptPage";
import Loader from "./components/common/Loader";
import { btn } from "./utils/ui";

function App() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/buildings" element={<BuildingsPage />} />
          <Route path="/buildings/:buildingId" element={<DashboardPage />} />
          <Route path="/buildings/:buildingId/transactions" element={<TransactionsPage />} />
          <Route path="/buildings/:buildingId/transactions/new" element={<TransactionFormPage />} />
          <Route path="/buildings/:buildingId/transactions/:txId/edit" element={<TransactionFormPage />} />
          <Route path="/buildings/:buildingId/my-payments" element={<MyPaymentsPage />} />
          <Route path="/buildings/:buildingId/expenses" element={<ExpensesPage />} />
          <Route path="/buildings/:buildingId/payments" element={<PaymentGridPage />} />
          <Route path="/buildings/:buildingId/debtors" element={<DebtorsPage />} />
          <Route path="/buildings/:buildingId/residents" element={<ResidentsPage />} />
          <Route path="/buildings/:buildingId/transactions/:txId/receipt" element={<ReceiptPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to={user ? homePath(user) : "/login"} replace />} />

      <Route
        path="*"
        element={
          <div className="grid min-h-screen place-items-center bg-paper p-6 text-center">
            <div>
              <div className="mb-2 text-6xl" aria-hidden="true">🏚️</div>
              <h1 className="mb-4 text-4xl">העמוד לא נמצא</h1>
              <Link to="/" className={btn("primary")}>
                חזרה לדף הבית
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
