import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f2537] to-[#0a1929]">
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">API Key Manager</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/projects')}>
                Projects
              </Button>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card/95 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Usage Dashboard</CardTitle>
            <CardDescription>Monitor your API key usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Usage dashboard coming soon. This will show API call statistics and charts.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

