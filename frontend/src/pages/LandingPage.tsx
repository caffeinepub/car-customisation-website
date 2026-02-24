import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowRight, Palette, RotateCcw, Save, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Image */}
        <div className="relative w-full h-[420px] sm:h-[520px]">
          <img
            src="/assets/generated/car-showroom-hero.dim_1920x600.png"
            alt="Car Showroom"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          {/* Hero content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber/30 bg-amber/10 text-amber text-xs font-medium tracking-widest mb-4">
                  <Zap className="w-3 h-3" />
                  PREMIUM CONFIGURATOR
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-none mb-4">
                  BUILD YOUR
                  <br />
                  <span className="text-gradient-amber">DREAM CAR</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed max-w-md">
                  Customize every detail of your vehicle in real-time 3D. Choose your model, color, wheels, and interior to create the perfect ride.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/customize">
                    <Button
                      size="lg"
                      className="bg-amber text-matte-black hover:bg-amber/90 font-display font-bold tracking-wider gap-2 glow-amber"
                    >
                      START CONFIGURING
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            CONFIGURE WITH <span className="text-amber">PRECISION</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every detail matters. Our configurator gives you full control over your vehicle's appearance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: RotateCcw,
              title: 'LIVE 3D PREVIEW',
              desc: 'Rotate and inspect your configuration from every angle in real-time 3D.',
            },
            {
              icon: Palette,
              title: 'FULL CUSTOMIZATION',
              desc: 'Choose from multiple models, body colors, wheel styles, and interior options.',
            },
            {
              icon: Save,
              title: 'SAVE & LOAD',
              desc: 'Save your configuration to the blockchain and load it anytime, anywhere.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="panel-glass rounded-lg p-6 hover:border-amber/40 transition-all group"
            >
              <div className="w-10 h-10 rounded-sm bg-amber/10 border border-amber/20 flex items-center justify-center mb-4 group-hover:bg-amber/20 transition-colors">
                <Icon className="w-5 h-5 text-amber" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2 tracking-wide">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-charcoal border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            READY TO BUILD YOUR <span className="text-amber">MASTERPIECE?</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Jump into the configurator and start designing your perfect vehicle today.
          </p>
          <Link to="/customize">
            <Button
              size="lg"
              className="bg-amber text-matte-black hover:bg-amber/90 font-display font-bold tracking-wider gap-2"
            >
              OPEN CONFIGURATOR
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
