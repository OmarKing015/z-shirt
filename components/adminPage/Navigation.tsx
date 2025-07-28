import { Link, useLocation } from '';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Home } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg"></div>
            <h1 className="text-xl font-bold text-foreground">Admin Portal</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              asChild
              size="sm"
              className="flex items-center gap-2"
            >
              <Link to="/">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </Button>
            
            <Button
              variant={isActive('/documents') ? 'default' : 'ghost'}
              asChild
              size="sm"
              className="flex items-center gap-2"
            >
              <Link to="/documents">
                <FileText className="w-4 h-4" />
                Documents
              </Link>
            </Button>
            
            <Button
              variant={isActive('/admin') ? 'default' : 'ghost'}
              asChild
              size="sm"
              className="flex items-center gap-2"
            >
              <Link to="/admin">
                <Upload className="w-4 h-4" />
                Upload
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;