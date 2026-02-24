import { Button } from '@/components/ui/button';
import { Save, Download, LogIn, Loader2 } from 'lucide-react';

interface ConfigurationActionsProps {
  onSave: () => void;
  onLoad: () => void;
  isSaving: boolean;
  isLoadingConfig: boolean;
  isAuthenticated: boolean;
  onLogin: () => void;
  isLoggingIn: boolean;
}

export default function ConfigurationActions({
  onSave,
  onLoad,
  isSaving,
  isLoadingConfig,
  isAuthenticated,
  onLogin,
  isLoggingIn,
}: ConfigurationActionsProps) {
  if (!isAuthenticated) {
    return (
      <Button
        onClick={onLogin}
        disabled={isLoggingIn}
        size="sm"
        className="bg-amber text-matte-black hover:bg-amber/90 font-display font-bold tracking-wider gap-2"
      >
        {isLoggingIn ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <LogIn className="w-3.5 h-3.5" />
        )}
        LOGIN TO SAVE
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onLoad}
        disabled={isLoadingConfig}
        variant="outline"
        size="sm"
        className="border-border hover:border-amber hover:text-amber transition-all gap-2 font-display tracking-wide"
      >
        {isLoadingConfig ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">LOAD</span>
      </Button>
      <Button
        onClick={onSave}
        disabled={isSaving}
        size="sm"
        className="bg-amber text-matte-black hover:bg-amber/90 font-display font-bold tracking-wider gap-2"
      >
        {isSaving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Save className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">SAVE</span>
      </Button>
    </div>
  );
}
