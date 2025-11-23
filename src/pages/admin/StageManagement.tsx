import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Info, 
  AlertCircle,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStage } from '@/hooks/useStage';
import { resetStageConfig } from '@/lib/stageConfig';
import type { Stage } from '@/lib/stageConfig';

export default function StageManagement() {
  const { stages, enabledStages, disabledStages, isLoading, toggleStage, refreshConfig } = useStage();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleStage = async (stageId: string, currentEnabled: boolean) => {
    setIsSaving(true);
    try {
      // Stage 1 cannot be disabled
      if (stageId === 'stage1' && !currentEnabled) {
        toast({
          title: 'Cannot Disable Stage 1',
          description: 'Stage 1 (Foundation) must always remain enabled as it contains core functionality.',
          variant: 'destructive',
        });
        setIsSaving(false);
        return;
      }

      // Check dependencies
      if (stageId === 'stage3' && currentEnabled) {
        // If disabling stage 3, check if stage 2 is enabled
        const stage2 = stages.find(s => s.id === 'stage2');
        if (stage2?.enabled) {
          // Stage 3 can be disabled independently
        }
      }

      if (stageId === 'stage2' && currentEnabled) {
        // If disabling stage 2, check if stage 3 is enabled
        const stage3 = stages.find(s => s.id === 'stage3');
        if (stage3?.enabled) {
          toast({
            title: 'Warning',
            description: 'Stage 3 requires Stage 2. Disabling Stage 2 will also disable Stage 3.',
            variant: 'destructive',
          });
          // Disable stage 3 as well
          toggleStage('stage3', false);
        }
      }

      toggleStage(stageId as any, !currentEnabled);
      
      // Force a config refresh to update the UI
      setTimeout(() => {
        refreshConfig();
      }, 100);
      
      toast({
        title: currentEnabled ? 'Stage Disabled' : 'Stage Enabled',
        description: `Stage has been ${currentEnabled ? 'disabled' : 'enabled'} successfully. Changes will be reflected immediately.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stage configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    refreshConfig();
    toast({
      title: 'Refreshed',
      description: 'Stage configuration has been refreshed.',
    });
  };

  const handleResetToDefault = () => {
    try {
      resetStageConfig();
      refreshConfig();
      toast({
        title: 'Reset to Default',
        description: 'Stage configuration has been reset to default values from code.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset stage configuration.',
        variant: 'destructive',
      });
    }
  };

  const getStageIcon = (stage: Stage) => {
    if (stage.id === 'stage1') return <Lock className="w-5 h-5 text-muted-foreground" />;
    return stage.enabled ? (
      <CheckCircle2 className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-gray-400" />
    );
  };

  const getStageBadge = (stage: Stage) => {
    if (stage.id === 'stage1') {
      return <Badge variant="default" className="bg-green-600">Always Enabled</Badge>;
    }
    return stage.enabled ? (
      <Badge variant="default" className="bg-green-600">Enabled</Badge>
    ) : (
      <Badge variant="secondary">Disabled</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Stage Management</h2>
          <p className="text-muted-foreground mt-2">
            Control which features and screens are available on the portal
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading || isSaving}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleResetToDefault}
            disabled={isLoading || isSaving}
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">3 stages defined</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Enabled Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{enabledStages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active on portal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Disabled Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-400">{disabledStages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Hidden from portal</p>
          </CardContent>
        </Card>
      </div>

      {/* Stage Cards */}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <Card key={stage.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">{getStageIcon(stage)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{stage.name}</CardTitle>
                      {getStageBadge(stage)}
                    </div>
                    <CardDescription className="text-base mt-2">
                      {stage.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`stage-${stage.id}`} className="cursor-pointer">
                      {stage.enabled ? 'Enabled' : 'Disabled'}
                    </Label>
                    <Switch
                      id={`stage-${stage.id}`}
                      checked={stage.enabled}
                      onCheckedChange={(checked) => handleToggleStage(stage.id, !checked)}
                      disabled={isSaving || isLoading || stage.id === 'stage1'}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Screens */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Screens ({stage.screens.length})
                  </h4>
                  <div className="space-y-2">
                    {stage.screens.map((screen, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-muted-foreground bg-muted/50 p-2 rounded"
                      >
                        {screen}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Features ({stage.features.length})
                  </h4>
                  <div className="space-y-2">
                    {stage.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-muted-foreground bg-muted/50 p-2 rounded"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Routes 
              <div className="mt-6">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Routes ({stage.routes.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {stage.routes.map((route, idx) => (
                    <Badge key={idx} variant="outline" className="font-mono text-xs">
                      {route}
                    </Badge>
                  ))}
                </div>
              </div>*/}

              {/* Warning for Stage 1 */}
              {stage.id === 'stage1' && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Stage 1 contains core functionality and cannot be disabled. It includes all
                      essential public pages and basic booking features.
                    </p>
                  </div>
                </div>
              )}

              {/* Dependency Warning */}
              {stage.id === 'stage3' && !stages.find(s => s.id === 'stage2')?.enabled && (
                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      Stage 3 requires Stage 2 to be enabled. Enable Stage 2 first to unlock
                      advanced admin features.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Info className="w-5 h-5" />
            How Stage Management Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <p>
            • <strong>Stage 1 (Foundation)</strong> is always enabled and contains core functionality.
          </p>
          <p>
            • <strong>Stage 2 (Advanced Booking)</strong> adds multi-activity and full-day package
            booking features.
          </p>
          <p>
            • <strong>Stage 3 (Advanced Admin)</strong> requires Stage 2 and adds comprehensive
            admin features and analytics.
          </p>
          <p>
            • When a stage is disabled, all its screens, features, and routes are hidden from the
            portal.
          </p>
          <p>
            • Navigation links and admin tabs automatically show/hide based on enabled stages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

