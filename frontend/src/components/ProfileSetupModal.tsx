import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  onSave: (name: string) => Promise<void>;
}

export default function ProfileSetupModal({ onSave }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      await onSave(name.trim());
      toast.success(`Welcome, ${name.trim()}!`, {
        description: 'Your profile has been created.',
      });
    } catch {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="bg-charcoal border-border max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-sm bg-amber/10 border border-amber/30 flex items-center justify-center">
              <Car className="w-5 h-5 text-amber" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl font-bold tracking-wide">
                WELCOME TO <span className="text-amber">CARFORGE</span>
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            Set up your driver profile to save and load your custom configurations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-foreground/80">
              Driver Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="bg-secondary border-border focus:border-amber transition-colors"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || isSaving}
            className="w-full bg-amber text-matte-black hover:bg-amber/90 font-display font-bold tracking-wider"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {isSaving ? 'SAVING...' : 'START CONFIGURING'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
