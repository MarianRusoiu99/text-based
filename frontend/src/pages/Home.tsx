import React from 'react';
import { Button } from '../components/ui/Button';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Text Adventure Platform
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Create and play interactive text-based adventure stories
      </p>
      <div className="space-x-4">
        <Button size="lg">
          Get Started
        </Button>
        <Button variant="outline" size="lg">
          Browse Stories
        </Button>
      </div>
    </div>
  );
};

export default Home;
