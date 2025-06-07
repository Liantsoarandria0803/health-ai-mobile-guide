
import { useState } from 'react';
import { ArrowLeft, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Logo from './logo';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (userData: any) => void;
  onSwitchToRegister: () => void;
}

const LoginPage = ({ onBack, onLoginSuccess, onSwitchToRegister }: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      console.log('Login Response:', result);
      
      if (result.status === 'success') {
        toast.success('Login successful!');
        localStorage.setItem('userData', JSON.stringify(result.data));
        onLoginSuccess(result.data);
      } else {
        throw new Error(result.message || 'Login failed');
      }

    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-12">
        <button 
          onClick={onBack}
          className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <div className="w-6 h-6 text-orange-500">
          <LogIn />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Login Title */}
        <h2 className="text-2xl font-bold text-orange-600 mb-8 tracking-wider">
          LOGIN
        </h2>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <Input
              type="email"
              placeholder="e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-0 border-b-2 border-gray-400 bg-transparent px-0 py-3 rounded-none focus:border-orange-500 focus:ring-0 placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1">
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-0 border-b-2 border-gray-400 bg-transparent px-0 py-3 rounded-none focus:border-orange-500 focus:ring-0 placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>

          <div className="pt-8">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-800 hover:bg-green-900 text-orange-200 py-4 rounded-full text-lg font-medium"
            >
              {isLoading ? 'Logging in...' : 'login'}
            </Button>
          </div>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">you don't have an account?</p>
          <button
            onClick={onSwitchToRegister}
            className="text-orange-500 font-medium hover:text-orange-600"
          >
            sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
