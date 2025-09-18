import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from './components/layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Stories from './pages/Stories';
import Editor from './pages/Editor';
import Player from './pages/Player';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/editor/:storyId?" element={<Editor />} />
                <Route path="/player/:storyId" element={<Player />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
