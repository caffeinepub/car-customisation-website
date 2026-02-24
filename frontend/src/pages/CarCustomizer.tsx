import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { useSaveConfiguration, useGetMyConfiguration } from '../hooks/useQueries';
import CarPreview3D from '../components/CarPreview3D';
import CustomizationControls from '../components/CustomizationControls';
import ProfileSetupModal from '../components/ProfileSetupModal';
import ConfigurationActions from '../components/ConfigurationActions';
import { toast } from 'sonner';
import type { CarConfiguration } from '../backend';

export type CarConfig = {
  model: string;
  bodyColor: string;
  wheelStyle: string;
  interiorColor: string;
  accessories: string[];
};

const DEFAULT_CONFIG: CarConfig = {
  model: 'Apex GT',
  bodyColor: '#c0392b',
  wheelStyle: 'Sport',
  interiorColor: '#1a1a1a',
  accessories: [],
};

export default function CarCustomizer() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [config, setConfig] = useState<CarConfig>(DEFAULT_CONFIG);

  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { mutateAsync: saveProfile } = useSaveCallerUserProfile();
  const { mutateAsync: saveConfig, isPending: isSaving } = useSaveConfiguration();
  const { data: savedConfig, isLoading: isLoadingConfig } = useGetMyConfiguration();

  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save your configuration.');
      return;
    }
    try {
      await saveConfig({
        model: config.model,
        bodyColor: config.bodyColor,
        wheelStyle: config.wheelStyle,
        interiorColor: config.interiorColor,
        accessories: config.accessories,
      } as CarConfiguration);
      toast.success('Configuration saved successfully!', {
        description: 'Your build has been stored on-chain.',
      });
    } catch {
      toast.error('Failed to save configuration.', {
        description: 'Please try again.',
      });
    }
  };

  const handleLoad = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to load your configuration.');
      return;
    }
    if (!savedConfig) {
      toast.info('No saved configuration found.', {
        description: 'Save a configuration first.',
      });
      return;
    }
    setConfig({
      model: savedConfig.model,
      bodyColor: savedConfig.bodyColor,
      wheelStyle: savedConfig.wheelStyle,
      interiorColor: savedConfig.interiorColor,
      accessories: savedConfig.accessories,
    });
    toast.success('Configuration loaded!', {
      description: 'Your saved build has been applied.',
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <ProfileSetupModal
          onSave={async (name) => {
            await saveProfile({ name });
          }}
        />
      )}

      {/* Page Header */}
      <div className="border-b border-border bg-charcoal px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-display text-xl font-bold tracking-wider">
            VEHICLE <span className="text-amber">CONFIGURATOR</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {config.model} · {config.wheelStyle} Wheels
          </p>
        </div>
        <ConfigurationActions
          onSave={handleSave}
          onLoad={handleLoad}
          isSaving={isSaving}
          isLoadingConfig={isLoadingConfig}
          isAuthenticated={isAuthenticated}
          onLogin={login}
          isLoggingIn={isLoggingIn}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Preview */}
        <div className="flex-1 relative bg-matte-black">
          <CarPreview3D
            model={config.model}
            bodyColor={config.bodyColor}
            wheelStyle={config.wheelStyle}
            interiorColor={config.interiorColor}
          />
        </div>

        {/* Controls Sidebar */}
        <div className="w-72 xl:w-80 border-l border-border bg-charcoal overflow-y-auto scrollbar-thin flex-shrink-0">
          <CustomizationControls
            config={config}
            onChange={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
          />
        </div>
      </div>
    </div>
  );
}
