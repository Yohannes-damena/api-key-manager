import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useToast } from '../components/ui/toast';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { format } from 'date-fns';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState(null);
  const [newKey, setNewKey] = useState(null);
  const [prefix, setPrefix] = useState('live');
  const { logout } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProject();
    fetchKeys();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      showToast('Failed to load project', 'error');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchKeys = async () => {
    try {
      const response = await api.get(`/keys?projectId=${id}`);
      setKeys(response.data);
    } catch (error) {
      showToast('Failed to load API keys', 'error');
    }
  };

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/keys/generate', {
        projectId: id,
        prefix,
      });
      setNewKey(response.data.key);
      setGenerateDialogOpen(true);
      fetchKeys();
      showToast('API key generated successfully', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to generate key', 'error');
    }
  };

  const handleRevokeKeyClick = (keyId) => {
    setKeyToRevoke(keyId);
    setConfirmDialogOpen(true);
  };

  const handleRevokeKey = async () => {
    if (!keyToRevoke) return;

    try {
      await api.delete(`/keys/${keyToRevoke}`);
      showToast('API key revoked successfully', 'success');
      fetchKeys();
      setKeyToRevoke(null);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to revoke key', 'error');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/projects')}>
                ← Back
              </Button>
              <h1 className="text-xl font-semibold">{project?.name}</h1>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">API Keys</h2>
            <p className="text-muted-foreground">Manage API keys for this project</p>
          </div>
          <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New API Key Generated</DialogTitle>
                <DialogDescription>
                  Copy this key now. You won't be able to see it again!
                </DialogDescription>
              </DialogHeader>
              {newKey && (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md font-mono text-sm break-all">
                    {newKey}
                  </div>
                  <Button
                    onClick={() => copyToClipboard(newKey)}
                    className="w-full"
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setGenerateDialogOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <form onSubmit={handleGenerateKey} className="flex gap-2">
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background/50 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-colors"
            >
              <option value="live">Live</option>
              <option value="test">Test</option>
            </select>
            <Button type="submit">Generate Key</Button>
          </form>
        </div>

        {keys.length === 0 ? (
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No API keys yet</p>
              <form onSubmit={handleGenerateKey} className="inline-flex gap-2">
                <select
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="h-10 px-3 rounded-md border border-input bg-background/50 backdrop-blur-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary/50 transition-colors"
                >
                  <option value="live">Live</option>
                  <option value="test">Test</option>
                </select>
                <Button type="submit">Generate your first key</Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prefix</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.map((key) => (
                    <TableRow key={key._id}>
                      <TableCell>
                        <span className="font-mono text-sm">{key.prefix}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            key.status === 'active'
                              ? 'bg-primary/20 text-primary border border-primary/30'
                              : 'bg-destructive/20 text-destructive border border-destructive/30'
                          }`}
                        >
                          {key.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(key.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {key.lastUsedAt
                          ? format(new Date(key.lastUsedAt), 'MMM d, yyyy HH:mm')
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        {key.status === 'active' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevokeKeyClick(key._id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <ConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          onConfirm={handleRevokeKey}
          title="Revoke API Key"
          description="Are you sure you want to revoke this API key? This action cannot be undone."
        />
      </main>
    </div>
  );
};

export default ProjectDetail;

