
import { useState } from 'react';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Logo from './logo';

interface RegisterPageProps {
  onBack: () => void;
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const RegisterPage = ({ onBack, onRegisterSuccess, onSwitchToLogin }: RegisterPageProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&email=${encodeURIComponent(email)}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      console.log('Register Response:', result);
      
      if (result.status === 'success') {
        toast.success('Registration successful! Please login.');
        onRegisterSuccess();
      } else {
        throw new Error(result.message || 'Registration failed');
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
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
          <UserPlus />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {/* Logo */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Register Title */}
        <h2 className="text-2xl font-bold text-orange-600 mb-8 tracking-wider">
          SIGN UP
        </h2>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-0 border-b-2 border-gray-400 bg-transparent px-0 py-3 rounded-none focus:border-orange-500 focus:ring-0 placeholder:text-gray-500"
              disabled={isLoading}
            />
          </div>

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
              {isLoading ? 'Creating account...' : 'sign up'}
            </Button>
          </div>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">already have an account?</p>
          <button
            onClick={onSwitchToLogin}
            className="text-orange-500 font-medium hover:text-orange-600"
          >
            login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
