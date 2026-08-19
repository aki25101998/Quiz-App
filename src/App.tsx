import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Payment from './pages/Payment';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fcfbfa] font-sans text-slate-900 relative overflow-hidden">
        {/* Glowing background effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-100/50 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-100/60 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-green-50/40 blur-[100px] rounded-full pointer-events-none"></div>
        
        <Navbar />
        
        <div className="relative z-10">
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/checkout/:id" element={<Payment />} />
          <Route path="/result/:id" element={<Result />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
