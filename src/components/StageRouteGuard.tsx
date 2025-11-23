import { useLocation } from 'react-router-dom';
import { isRouteEnabled } from '@/lib/stageConfig';
import NotFound from '@/pages/NotFound';

interface StageRouteGuardProps {
  children: React.ReactNode;
  route?: string;
}

/**
 * Component to guard routes based on stage configuration
 * Redirects to 404 if route is not enabled in any stage
 */
export const StageRouteGuard = ({ children, route }: StageRouteGuardProps) => {
  const location = useLocation();

  // Use provided route or current pathname
  const routeToCheck = route || location.pathname;
  
  // Don't block the NotFound page itself
  if (routeToCheck === '*') {
    return <>{children}</>;
  }

  // Check if the current route is enabled
  const isEnabled = isRouteEnabled(routeToCheck);

  if (!isEnabled) {
    return <NotFound />;
  }

  return <>{children}</>;
};

