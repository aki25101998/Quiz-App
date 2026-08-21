import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { QuizLayout } from './layouts/QuizLayout';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Payment from './pages/Payment';
import Result from './pages/Result';
import Login from './pages/Login';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/history" element={<MainLayout><History /></MainLayout>} />
        <Route path="/quiz/:id" element={<QuizLayout><Quiz /></QuizLayout>} />
        <Route path="/checkout/:id" element={<MainLayout><Payment /></MainLayout>} />
        <Route path="/result/:id" element={<MainLayout><Result /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
