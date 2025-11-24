import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useToast } from '../components/ui/toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      showToast('Project name is required', 'error');
      return;
    }

    try {
      const response = await api.post('/projects', { name: projectName });
      setProjects([response.data, ...projects]);
      setProjectName('');
      setCreateDialogOpen(false);
      showToast('Project created successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create project', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1929] via-[#0f2537] to-[#0a1929]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0f2537] to-[#0a1929]">
      <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">API Key Manager</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Projects</h2>
            <p className="text-muted-foreground">Manage your API key projects</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>Create Project</Button>
        </div>

        {projects.length === 0 ? (
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Button onClick={() => setCreateDialogOpen(true)}>Create your first project</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project._id}
                className="cursor-pointer hover:bg-card hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/50"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    {project.keys?.length || 0} API key{project.keys?.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>Enter a name for your new project</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="projectName" className="text-sm font-medium">
                    Project Name
                  </label>
                  <Input
                    id="projectName"
                    placeholder="My API Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Projects;

