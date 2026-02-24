import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Car, Palette, Circle, Armchair, Zap } from 'lucide-react';
import type { CarConfig } from '../pages/CarCustomizer';

interface CustomizationControlsProps {
  config: CarConfig;
  onChange: (updates: Partial<CarConfig>) => void;
}

const CAR_MODELS = [
  { id: 'Apex GT', label: 'Apex GT', desc: 'Sports Coupe' },
  { id: 'Titan SUV', label: 'Titan SUV', desc: 'Performance SUV' },
  { id: 'Phantom Coupe', label: 'Phantom Coupe', desc: 'Luxury Coupe' },
  { id: 'Vortex Roadster', label: 'Vortex Roadster', desc: 'Open Roadster' },
  { id: 'Nexus Sedan', label: 'Nexus Sedan', desc: 'Executive Sedan' },
];

const WHEEL_STYLES = [
  { id: 'Sport', label: 'Sport', desc: '5-Spoke Alloy' },
  { id: 'Racing', label: 'Racing', desc: 'Multi-Spoke' },
  { id: 'Classic', label: 'Classic', desc: 'Solid Rim' },
  { id: 'Turbine', label: 'Turbine', desc: 'Turbine Flow' },
];

const BODY_COLORS = [
  { hex: '#c0392b', name: 'Crimson Red' },
  { hex: '#1a1a2e', name: 'Midnight Blue' },
  { hex: '#2c2c2c', name: 'Matte Black' },
  { hex: '#e8e8e8', name: 'Pearl White' },
  { hex: '#c0a060', name: 'Champagne Gold' },
  { hex: '#1e5f74', name: 'Ocean Teal' },
  { hex: '#4a4a8a', name: 'Cosmic Purple' },
  { hex: '#2d5a27', name: 'Racing Green' },
  { hex: '#8b4513', name: 'Burnt Sienna' },
  { hex: '#708090', name: 'Slate Silver' },
];

const INTERIOR_COLORS = [
  { hex: '#1a1a1a', name: 'Onyx Black' },
  { hex: '#8b7355', name: 'Tan Leather' },
  { hex: '#4a3728', name: 'Dark Walnut' },
  { hex: '#c8b8a2', name: 'Cream Beige' },
  { hex: '#2c3e50', name: 'Navy Blue' },
  { hex: '#8b0000', name: 'Burgundy Red' },
];

const ACCESSORIES = [
  { id: 'sunroof', label: 'Panoramic Sunroof' },
  { id: 'spoiler', label: 'Rear Spoiler' },
  { id: 'tinted', label: 'Tinted Windows' },
  { id: 'carbon', label: 'Carbon Trim' },
];

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-amber">{icon}</div>
      <span className="font-display text-sm font-bold tracking-widest text-foreground/80 uppercase">
        {title}
      </span>
    </div>
  );
}

export default function CustomizationControls({ config, onChange }: CustomizationControlsProps) {
  const toggleAccessory = (id: string) => {
    const current = config.accessories;
    const updated = current.includes(id)
      ? current.filter((a) => a !== id)
      : [...current, id];
    onChange({ accessories: updated });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Model Selection */}
      <div>
        <SectionHeader icon={<Car className="w-4 h-4" />} title="Model" />
        <div className="space-y-1.5">
          {CAR_MODELS.map((m) => (
            <button
              key={m.id}
              onClick={() => onChange({ model: m.id })}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm border transition-all text-left ${
                config.model === m.id
                  ? 'border-amber bg-amber/10 text-foreground'
                  : 'border-border bg-secondary/30 text-muted-foreground hover:border-border/80 hover:text-foreground'
              }`}
            >
              <div>
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.desc}</div>
              </div>
              {config.model === m.id && (
                <div className="w-2 h-2 rounded-full bg-amber glow-amber-sm flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Body Color */}
      <div>
        <SectionHeader icon={<Palette className="w-4 h-4" />} title="Body Color" />
        <div className="grid grid-cols-5 gap-2 mb-3">
          {BODY_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => onChange({ bodyColor: c.hex })}
              title={c.name}
              className={`w-full aspect-square rounded-sm border-2 transition-all hover:scale-110 ${
                config.bodyColor === c.hex
                  ? 'border-amber shadow-amber-glow-sm scale-110'
                  : 'border-transparent hover:border-white/30'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Custom:</Label>
          <input
            type="color"
            value={config.bodyColor}
            onChange={(e) => onChange({ bodyColor: e.target.value })}
            className="w-8 h-8 rounded-sm border border-border cursor-pointer bg-transparent"
          />
          <span className="text-xs font-mono text-muted-foreground">{config.bodyColor.toUpperCase()}</span>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Wheel Style */}
      <div>
        <SectionHeader icon={<Circle className="w-4 h-4" />} title="Wheel Style" />
        <div className="grid grid-cols-2 gap-2">
          {WHEEL_STYLES.map((w) => (
            <button
              key={w.id}
              onClick={() => onChange({ wheelStyle: w.id })}
              className={`flex flex-col items-center justify-center px-2 py-3 rounded-sm border transition-all ${
                config.wheelStyle === w.id
                  ? 'border-amber bg-amber/10 text-foreground'
                  : 'border-border bg-secondary/30 text-muted-foreground hover:border-border/80 hover:text-foreground'
              }`}
            >
              <span className="text-sm font-medium">{w.label}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{w.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Interior Color */}
      <div>
        <SectionHeader icon={<Armchair className="w-4 h-4" />} title="Interior" />
        <div className="grid grid-cols-6 gap-2 mb-3">
          {INTERIOR_COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => onChange({ interiorColor: c.hex })}
              title={c.name}
              className={`w-full aspect-square rounded-sm border-2 transition-all hover:scale-110 ${
                config.interiorColor === c.hex
                  ? 'border-amber shadow-amber-glow-sm scale-110'
                  : 'border-transparent hover:border-white/30'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">Custom:</Label>
          <input
            type="color"
            value={config.interiorColor}
            onChange={(e) => onChange({ interiorColor: e.target.value })}
            className="w-8 h-8 rounded-sm border border-border cursor-pointer bg-transparent"
          />
          <span className="text-xs font-mono text-muted-foreground">{config.interiorColor.toUpperCase()}</span>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Accessories */}
      <div>
        <SectionHeader icon={<Zap className="w-4 h-4" />} title="Accessories" />
        <div className="space-y-2">
          {ACCESSORIES.map((acc) => {
            const isActive = config.accessories.includes(acc.id);
            return (
              <button
                key={acc.id}
                onClick={() => toggleAccessory(acc.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-sm border transition-all ${
                  isActive
                    ? 'border-amber bg-amber/10 text-foreground'
                    : 'border-border bg-secondary/30 text-muted-foreground hover:border-border/80 hover:text-foreground'
                }`}
              >
                <span className="text-sm">{acc.label}</span>
                {isActive ? (
                  <Badge className="bg-amber text-matte-black text-xs px-1.5 py-0 h-5 font-bold">ON</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 text-muted-foreground">OFF</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-4" />
    </div>
  );
}
