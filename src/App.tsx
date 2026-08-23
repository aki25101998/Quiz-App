import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { QuizLayout } from './layouts/QuizLayout';
import { Loader2 } from 'lucide-react';

const Home = React.lazy(() => import('./pages/Home'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Payment = React.lazy(() => import('./pages/Payment'));
const Result = React.lazy(() => import('./pages/Result'));
const Login = React.lazy(() => import('./pages/Login'));
const Guide = React.lazy(() => import('./pages/Guide'));
const FinalReport = React.lazy(() => import('./pages/FinalReport'));
const Profiles = React.lazy(() => import('./pages/Profiles'));
const ProfileDetail = React.lazy(() => import('./pages/ProfileDetail'));
const ProfilePayment = React.lazy(() => import('./pages/ProfilePayment'));
const ProfileReport = React.lazy(() => import('./pages/ProfileReport'));

const PageLoader = () => (
  <div className="min-h-[80vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<MainLayout><PageLoader /></MainLayout>}>
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/guide" element={<MainLayout><Guide /></MainLayout>} />
          <Route path="/quiz/:id" element={<QuizLayout><Quiz /></QuizLayout>} />
          <Route path="/checkout/:id" element={<MainLayout><Payment /></MainLayout>} />
          <Route path="/result/:id" element={<MainLayout><Result /></MainLayout>} />
          <Route path="/report" element={<MainLayout><FinalReport /></MainLayout>} />
          {/* Profile-Based Career Assessment Routes */}
          <Route path="/profiles" element={<MainLayout><Profiles /></MainLayout>} />
          <Route path="/profiles/:id" element={<MainLayout><ProfileDetail /></MainLayout>} />
          <Route path="/profiles/:id/payment" element={<MainLayout><ProfilePayment /></MainLayout>} />
          <Route path="/profiles/:id/report/generate" element={<MainLayout><ProfileReport /></MainLayout>} />
          <Route path="/profiles/:id/report/:reportId" element={<MainLayout><ProfileReport /></MainLayout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

