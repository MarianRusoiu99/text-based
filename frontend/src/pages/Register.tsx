import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { authService } from '../services/authService';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register(formData);
      if (result.success) {
        setIsSuccess(true);
        setError('');
        // Show success message briefly before redirect
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          data-testid="username-input"
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="email-input"
        />
        <Input
          label="Display Name (optional)"
          type="text"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          data-testid="display-name-input"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          data-testid="password-input"
        />
        {error && (
          <p className="text-sm text-red-600" data-testid="error-message">{error}</p>
        )}
        {isSuccess && (
          <p className="text-sm text-green-600" data-testid="success-message">Registration successful! Redirecting...</p>
        )}
        <Button type="submit" className="w-full" disabled={isLoading} data-testid="register-button">
          {isLoading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
