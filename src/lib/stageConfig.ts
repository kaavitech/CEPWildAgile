/**
 * Stage Configuration System
 * 
 * This file defines the 3-stage rollout system for the CEP platform.
 * Each stage contains specific screens, features, and routes that can be enabled/disabled.
 */

export type StageId = 'stage1' | 'stage2' | 'stage3';

export interface Stage {
  id: StageId;
  name: string;
  description: string;
  enabled: boolean;
  screens: string[];
  features: string[];
  routes: string[];
}

export interface StageConfig {
  stages: Stage[];
}

// Default stage configuration
const defaultStageConfig: StageConfig = {
  stages: [
    {
      id: 'stage1',
      name: 'Stage 1: Foundation',
      description: 'Basic public-facing website and core booking functionality',
      enabled: true, // Stage 1 is always enabled by default
      screens: [
        'Home',
        'About',
        'Eco-Centres Listing',
        'Eco-Centre Detail',
        'Enquiry Form',
        'Affiliated Lecturers',
        'Contact',
        'Gallery',
        'Admin Dashboard (Events)',
        'Events Management',
        'Coordinators Management',
        'Drivers Management'
      ],
      features: [
        'Public website pages',
        'Eco-centre browsing and details',
        'Enquiry form',
        'Affiliated lecturers',
        'Events management in admin',
        'Coordinators management in admin',
        'Drivers management in admin'
      ],
      routes: [
        '/',
        '/about',
        '/eco-centres',
        '/eco-centres/:id',
        '/school/register',
        '/school/thank-you',
        '/contact',
        '/gallery',
        '/lecturers',
        '/execution-plan',
        //'/bookings',
        //'/bookings/:id',
        //'/bookings/:ecoCentreId/:activityId',
        //'/bookings/confirmation/:bookingId',
        '/admin',
        '/admin?tab=events',
        '/admin?tab=coordinators',
        '/admin?tab=drivers',
        '/admin?tab=stages'
      ]
    },
    {
      id: 'stage2',
      name: 'Stage 2: Advanced Booking',
      description: 'Multi-activity bookings, full-day packages, and enhanced booking features',
      enabled: false,
      screens: [
        'Multi-Activity Selection',
        'Full-Day Package Booking',
        'Time Slot Selection',
        'Multi-Slot Booking',
        'Enhanced Booking Form',
        'Eco Centre Bookings Admin',
        'Bookings Dashboard',
        'All Bookings List',
        'Eco Centres Management (Admin)',
        'Activities Management (Admin)',
        'Booking Reports'
      ],
      features: [
        'Multi-activity booking selection',
        'Full-day package bookings',
        'Time slot management',
        'Multi-slot booking support',
        'Eco centre bookings admin module',
        'Activity and slot management',
        'Advanced booking reports'
      ],
      routes: [
        '/bookings', // Bookings listing page
        '/bookings/:id', // Enhanced with multi-activity
        '/bookings/:ecoCentreId/:activityId', // Enhanced with full-day packages
        '/bookings/confirmation/:bookingId', // Booking confirmation
        '/admin?tab=bookings'
      ]
    },
    {
      id: 'stage3',
      name: 'Stage 3: Advanced Admin',
      description: 'Complete admin features, advanced analytics, and comprehensive management',
      enabled: false,
      screens: [
        'Advanced Reports Dashboard',
        'Revenue Analytics',
        'Booking Analytics',
        'Eco Centre Analytics',
        'Activity Performance Reports',
        'Financial Reports',
        'Advanced Filters and Search',
        'Bulk Operations',
        'Export Functionality',
        'Advanced Settings'
      ],
      features: [
        'Advanced analytics and reporting',
        'Revenue tracking and forecasting',
        'Performance metrics',
        'Bulk operations',
        'Advanced export options',
        'Comprehensive filtering',
        'System settings management'
      ],
      routes: [
        '/admin?tab=reports', // Enhanced reports
        '/admin?tab=bookings' // Enhanced with advanced features
      ]
    }
  ]
};

// Storage key for stage configuration
const STORAGE_KEY = 'cep_stage_config';

/**
 * Get current stage configuration from localStorage or return default
 */
export const getStageConfig = (): StageConfig => {
  if (typeof window === 'undefined') {
    return defaultStageConfig;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with default to ensure all stages exist and Stage 1 is always enabled
      // IMPORTANT: Always use default config's screens, features, and routes to reflect code changes
      return {
        stages: defaultStageConfig.stages.map(defaultStage => {
          const storedStage = parsed.stages?.find((s: Stage) => s.id === defaultStage.id);
          if (storedStage) {
            // Merge but use default's screens, features, and routes (from code)
            // Only preserve the enabled status from stored config
            const merged: Stage = {
              ...defaultStage, // Use default screens, features, routes from code
              enabled: storedStage.enabled // Preserve user's enabled/disabled preference
            };
            // Ensure Stage 1 is always enabled
            if (merged.id === 'stage1') {
              merged.enabled = true;
            }
            return merged;
          }
          // If stage doesn't exist in stored config, use default
          return defaultStage;
        })
      };
    }
  } catch (error) {
    console.error('Error loading stage config:', error);
    // Return default config if there's an error parsing stored config
  }

  // Initialize default config in localStorage on first load
  try {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStageConfig));
    }
  } catch (error) {
    console.error('Error initializing stage config in localStorage:', error);
  }

  return defaultStageConfig;
};

/**
 * Save stage configuration to localStorage
 */
export const saveStageConfig = (config: StageConfig): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving stage config:', error);
  }
};

/**
 * Update stage enabled status
 */
export const updateStageEnabled = (stageId: StageId, enabled: boolean): void => {
  const config = getStageConfig();
  const stage = config.stages.find(s => s.id === stageId);
  
  if (stage) {
    stage.enabled = enabled;
    saveStageConfig(config);
    
    // Dispatch custom event to notify all components using the hook
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stage-config-updated', { 
        detail: { stageId, enabled, config } 
      }));
    }
  }
};

/**
 * Check if a specific stage is enabled
 */
export const isStageEnabled = (stageId: StageId): boolean => {
  const config = getStageConfig();
  const stage = config.stages.find(s => s.id === stageId);
  return stage?.enabled ?? false;
};

/**
 * Check if a route is available based on provided stage configuration
 */
export const isRouteEnabledWithConfig = (route: string, config: StageConfig): boolean => {
  
  // Split route and query params
  const [path, queryString] = route.split('?');
  
  // Normalize path (remove trailing slashes)
  let normalizedPath = path.endsWith('/') && path !== '/' 
    ? path.slice(0, -1) 
    : path;
  normalizedPath = normalizedPath || '/';
  
  // Parse query params if they exist
  let queryParams: Record<string, string> = {};
  if (queryString) {
    queryParams = Object.fromEntries(
      new URLSearchParams(queryString).entries()
    );
  }
  
  // Special case: Admin routes with specific tabs need stage checking
  if (normalizedPath === '/admin' || normalizedPath.startsWith('/admin')) {
    // Stage Management is always accessible
    if (queryParams.tab === 'stages') {
      return true;
    }
    
    // Check if it's a specific admin tab that requires a stage
    if (queryParams.tab === 'bookings') {
      // This route requires Stage 2
      const stage2 = config.stages.find(s => s.id === 'stage2');
      return stage2?.enabled ?? false;
    }
    
    if (queryParams.tab === 'reports') {
      // Reports require Stage 3 (advanced reports) or Stage 2 (basic reports)
      const stage3 = config.stages.find(s => s.id === 'stage3');
      const stage2 = config.stages.find(s => s.id === 'stage2');
      return (stage3?.enabled ?? false) || (stage2?.enabled ?? false);
    }
    
    // Stage 1 admin tabs: events, coordinators, drivers
    if (queryParams.tab === 'events' || queryParams.tab === 'coordinators' || queryParams.tab === 'drivers') {
      const stage1 = config.stages.find(s => s.id === 'stage1');
      return stage1?.enabled ?? false; // Stage 1 is always enabled, but check anyway
    }
    
    // Base admin route (without specific tabs) - default to events (Stage 1)
    if (Object.keys(queryParams).length === 0) {
      const stage1 = config.stages.find(s => s.id === 'stage1');
      return stage1?.enabled ?? false;
    }
    
    // Unknown tabs - default to false (require explicit stage assignment)
    return false;
  }
  
  // Check if route exists in any enabled stage
  for (const stage of config.stages) {
    if (!stage.enabled) continue;
    
    // Filter out any routes that might have been accidentally left as commented strings
    const validRoutes = stage.routes.filter(route => 
      typeof route === 'string' && !route.trim().startsWith('//')
    );
    
    // Check exact match first
    for (const stageRoute of validRoutes) {
      // Split stage route to check for query params
      const [stagePath, stageQueryString] = stageRoute.split('?');
      
      let normalizedStagePath = stagePath;
      normalizedStagePath = normalizedStagePath.endsWith('/') && normalizedStagePath !== '/'
        ? normalizedStagePath.slice(0, -1)
        : normalizedStagePath;
      normalizedStagePath = normalizedStagePath || '/';
      
      // If stage route has query params, check them too
      if (stageQueryString) {
        const stageQueryParams = Object.fromEntries(
          new URLSearchParams(stageQueryString).entries()
        );
        // Check if both path and query params match
        if (normalizedStagePath === normalizedPath) {
          const matchesQuery = Object.keys(stageQueryParams).every(key => 
            queryParams[key] === stageQueryParams[key]
          );
          if (matchesQuery) {
            return true;
          }
        }
      } else {
        // No query params in stage route, just check path match
        if (normalizedStagePath === normalizedPath) {
          // Only match if no query params in the requested route (or allow if it's a general match)
          // For example, /admin matches /admin?tab=events because /admin is in Stage 1
          return true;
        }
      }
      
      // Check pattern match (for routes with params like /bookings/:id)
      // Only do pattern matching if the route contains :param and no query params
      if (stagePath.includes(':') && !stageQueryString) {
        try {
          // Convert route pattern to regex
          // e.g., /bookings/:id -> ^/bookings/[^/]+$
          // e.g., /bookings/:ecoCentreId/:activityId -> ^/bookings/[^/]+/[^/]+$
          const pattern = '^' + stagePath
            .replace(/\//g, '\\/') // Escape forward slashes first
            .replace(/:[^/\\]+/g, '[^/]+') // Replace :param with [^/]+
            + '$';
          
          const regex = new RegExp(pattern);
          if (regex.test(normalizedPath)) {
            return true;
          }
        } catch (error) {
          // If regex fails, continue to next route
          console.warn('Invalid route pattern:', stagePath, error);
        }
      }
    }
  }
  
  // If no match found, return false (route is not enabled in any stage)
  return false;
};

/**
 * Check if a route is available based on stage configuration (reads from storage)
 */
export const isRouteEnabled = (route: string): boolean => {
  const config = getStageConfig();
  return isRouteEnabledWithConfig(route, config);
};

/**
 * Check if a feature is available based on stage configuration
 */
export const isFeatureEnabled = (featureName: string): boolean => {
  const config = getStageConfig();
  
  for (const stage of config.stages) {
    if (!stage.enabled) continue;
    if (stage.features.some(f => f.toLowerCase().includes(featureName.toLowerCase()))) {
      return true;
    }
  }
  
  return false;
};

/**
 * Get all enabled stages
 */
export const getEnabledStages = (): Stage[] => {
  const config = getStageConfig();
  return config.stages.filter(s => s.enabled);
};

/**
 * Get all disabled stages
 */
export const getDisabledStages = (): Stage[] => {
  const config = getStageConfig();
  return config.stages.filter(s => !s.enabled);
};

/**
 * Reset stage configuration to default
 */
export const resetStageConfig = (): void => {
  saveStageConfig(defaultStageConfig);
};

