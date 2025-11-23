import { useState, useEffect, useCallback } from 'react';
import * as React from 'react';
import {
  getStageConfig,
  saveStageConfig,
  updateStageEnabled,
  isStageEnabled,
  isRouteEnabled,
  isRouteEnabledWithConfig,
  isFeatureEnabled,
  getEnabledStages,
  getDisabledStages,
  type Stage,
  type StageId,
  type StageConfig
} from '@/lib/stageConfig';

/**
 * Hook to manage and check stage configuration
 */
export const useStage = () => {
  // Initialize config safely
  const [config, setConfig] = useState<StageConfig>(() => {
    try {
      return getStageConfig();
    } catch (error) {
      console.error('Error initializing stage config:', error);
      // Return default config if there's an error
      return {
        stages: [
          {
            id: 'stage1',
            name: 'Stage 1: Foundation',
            description: 'Basic public-facing website and core booking functionality',
            enabled: true,
            screens: [],
            features: [],
            routes: ['/']
          }
        ]
      };
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Listen for storage changes and custom events to update config
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cep_stage_config') {
        refreshConfig();
      }
    };

    // Listen for custom event when stages are updated in same tab
    const handleStageConfigUpdate = () => {
      refreshConfig();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('stage-config-updated', handleStageConfigUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('stage-config-updated', handleStageConfigUpdate);
    };
  }, []);

  // Refresh config from storage
  const refreshConfig = useCallback(() => {
    try {
      setConfig(getStageConfig());
    } catch (error) {
      console.error('Error refreshing stage config:', error);
    }
  }, []);

  // Update stage enabled status
  const toggleStage = (stageId: StageId, enabled: boolean) => {
    setIsLoading(true);
    try {
      updateStageEnabled(stageId, enabled);
      refreshConfig();
    } catch (error) {
      console.error('Error updating stage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if stage is enabled (with error handling)
  const checkStage = (stageId: StageId): boolean => {
    try {
      return isStageEnabled(stageId);
    } catch (error) {
      console.error('Error checking stage:', error);
      // Default to true for stage1, false for others
      return stageId === 'stage1';
    }
  };

  // Check if route is enabled (with error handling and using current config state)
  const checkRoute = (route: string): boolean => {
    try {
      // Use the current config state instead of reading from localStorage
      const isEnabled = isRouteEnabledWithConfig(route, config);
      // Debug log (can be removed in production)
      if (route === '/bookings') {
        console.debug('[Stage Check] /bookings enabled:', isEnabled, 'Stages:', config.stages.map(s => ({ id: s.id, enabled: s.enabled })));
      }
      return isEnabled;
    } catch (error) {
      console.error('Error checking route:', error);
      // Default to allowing routes if there's an error
      return true;
    }
  };

  // Check if feature is enabled (with error handling)
  const checkFeature = (featureName: string): boolean => {
    try {
      return isFeatureEnabled(featureName);
    } catch (error) {
      console.error('Error checking feature:', error);
      return false;
    }
  };

  // Get enabled stages (with error handling)
  const enabledStages = (() => {
    try {
      return getEnabledStages();
    } catch (error) {
      console.error('Error getting enabled stages:', error);
      return config.stages.filter(s => s.enabled);
    }
  })();

  // Get disabled stages (with error handling)
  const disabledStages = (() => {
    try {
      return getDisabledStages();
    } catch (error) {
      console.error('Error getting disabled stages:', error);
      return config.stages.filter(s => !s.enabled);
    }
  })();

  return {
    config,
    stages: config.stages,
    enabledStages,
    disabledStages,
    isLoading,
    toggleStage,
    checkStage,
    checkRoute,
    checkFeature,
    refreshConfig
  };
};

