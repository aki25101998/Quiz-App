import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { QuizLayout } from './layouts/QuizLayout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Payment from './pages/Payment';
import Result from './pages/Result';
import Login from './pages/Login';
import Guide from './pages/Guide';
import FinalReport from './pages/FinalReport';
import Profiles from './pages/Profiles';
import ProfileDetail from './pages/ProfileDetail';
import ProfilePayment from './pages/ProfilePayment';
import ProfileReport from './pages/ProfileReport';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;

