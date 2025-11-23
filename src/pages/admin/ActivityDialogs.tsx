import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Plus, Trash2, Settings, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { mockEcoCentres } from "@/lib/mockData";
import type { BookingActivity, ActivitySlot, EcoCentre } from "@/lib/mockData";

// Add Activity Dialog Component
interface AddActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ecoCentres: typeof mockEcoCentres;
  onSave: (activity: BookingActivity) => void;
}

export const AddActivityDialog = ({ isOpen, onClose, ecoCentres, onSave }: AddActivityDialogProps) => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<Array<{ startTime: string; endTime: string; maxCapacity: string }>>([]);
  const [formData, setFormData] = useState({
    ecoCentreId: '',
    name: '',
    description: '',
    type: 'FREE' as 'FREE' | 'PAID',
    isSlotBased: false,
    price: '',
    capacity: '50',
    ageRestrictions: '',
    requiresVehicles: false,
    vehicleCapacity: '6'
  });

  const addSlot = () => {
    setSlots([...slots, { startTime: '09:00', endTime: '11:00', maxCapacity: '30' }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: string, value: string) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ecoCentreId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === 'PAID' && !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please enter a price for paid activities.",
        variant: "destructive"
      });
      return;
    }

    if (formData.isSlotBased && slots.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one time slot for slot-based activities.",
        variant: "destructive"
      });
      return;
    }
    
    const activitySlots: ActivitySlot[] = formData.isSlotBased ? slots.map((slot, idx) => ({
      id: `slot-${Date.now()}-${idx}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCapacity: parseInt(slot.maxCapacity) || 30,
      availableCapacity: parseInt(slot.maxCapacity) || 30
    })) : undefined;
    
    const activityData: BookingActivity = {
      id: `bact-${Date.now()}`,
      ecoCentreId: formData.ecoCentreId,
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type,
      isSlotBased: formData.isSlotBased,
      price: formData.type === 'PAID' ? parseFloat(formData.price) : undefined,
      capacity: parseInt(formData.capacity) || 50,
      ageRestrictions: formData.ageRestrictions || undefined,
      slots: activitySlots,
      requiresVehicles: formData.requiresVehicles || undefined,
      vehicleCapacity: formData.requiresVehicles ? parseInt(formData.vehicleCapacity) : undefined
    };

    onSave(activityData);
    // Reset form
    setFormData({
      ecoCentreId: '',
      name: '',
      description: '',
      type: 'FREE',
      isSlotBased: false,
      price: '',
      capacity: '50',
      ageRestrictions: '',
      requiresVehicles: false,
      vehicleCapacity: '6'
    });
    setSlots([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Activity</DialogTitle>
          <DialogDescription>Enter details for the new activity</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="activity-ecoCentre">Eco Centre *</Label>
                <Select
                  value={formData.ecoCentreId}
                  onValueChange={(value) => setFormData({ ...formData, ecoCentreId: value })}
                  required
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Eco Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {ecoCentres.map(centre => (
                      <SelectItem key={centre.id} value={centre.id}>{centre.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="activity-name">Activity Name *</Label>
                <Input
                  id="activity-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="e.g., Nature Trail, Safari, Bird Watching"
                />
              </div>
              
              <div>
                <Label htmlFor="activity-description">Description</Label>
                <Textarea
                  id="activity-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={3}
                  placeholder="Brief description of the activity"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="activity-type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'FREE' | 'PAID') => setFormData({ ...formData, type: value, price: value === 'FREE' ? '' : formData.price })}
                    required
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="PAID">PAID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="activity-capacity">Capacity *</Label>
                  <Input
                    id="activity-capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    className="mt-2"
                    min="1"
                    placeholder="Daily or slot-wise capacity"
                  />
                </div>
              </div>

              {formData.type === 'PAID' && (
                <div>
                  <Label htmlFor="activity-price">Price *</Label>
                  <Input
                    id="activity-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="mt-2"
                    min="0"
                    placeholder="Price per person or vehicle"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="activity-ageRestrictions">Age Restrictions</Label>
                <Input
                  id="activity-ageRestrictions"
                  value={formData.ageRestrictions}
                  onChange={(e) => setFormData({ ...formData, ageRestrictions: e.target.value })}
                  className="mt-2"
                  placeholder="e.g., 12+ years"
                />
              </div>
            </CardContent>
          </Card>

          {/* Activity Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activity-slotBased"
                  checked={formData.isSlotBased}
                  onCheckedChange={(checked) => setFormData({ ...formData, isSlotBased: checked as boolean })}
                />
                <Label htmlFor="activity-slotBased" className="cursor-pointer">
                  Slot-Based Activity (Has specific time slots)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activity-requiresVehicles"
                  checked={formData.requiresVehicles}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresVehicles: checked as boolean })}
                />
                <Label htmlFor="activity-requiresVehicles" className="cursor-pointer">
                  Requires Vehicles (e.g., Safari)
                </Label>
              </div>

              {formData.requiresVehicles && (
                <div>
                  <Label htmlFor="activity-vehicleCapacity">Vehicle Capacity (people per vehicle)</Label>
                  <Input
                    id="activity-vehicleCapacity"
                    type="number"
                    value={formData.vehicleCapacity}
                    onChange={(e) => setFormData({ ...formData, vehicleCapacity: e.target.value })}
                    className="mt-2"
                    min="1"
                    placeholder="Default: 6"
                  />
                </div>
              )}

              {/* Slot Configuration */}
              {formData.isSlotBased && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Time Slots *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSlot}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Slot
                    </Button>
                  </div>
                  
                  {slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No slots added. Click "Add Slot" to add time slots.</p>
                  ) : (
                    <div className="space-y-3">
                      {slots.map((slot, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-4 gap-3 items-end">
                              <div>
                                <Label>Start Time *</Label>
                                <Input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                                  required
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label>End Time *</Label>
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                                  required
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label>Max Capacity *</Label>
                                <Input
                                  type="number"
                                  value={slot.maxCapacity}
                                  onChange={(e) => updateSlot(index, 'maxCapacity', e.target.value)}
                                  required
                                  className="mt-2"
                                  min="1"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSlot(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Activity Dialog Component
interface EditActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activity: BookingActivity;
  ecoCentres: typeof mockEcoCentres;
  onSave: (updates: Partial<BookingActivity>) => void;
}

export const EditActivityDialog = ({ isOpen, onClose, activity, ecoCentres, onSave }: EditActivityDialogProps) => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<Array<{ id?: string; startTime: string; endTime: string; maxCapacity: string; availableCapacity?: string }>>(
    activity.slots?.map(s => ({
      id: s.id,
      startTime: s.startTime,
      endTime: s.endTime,
      maxCapacity: s.maxCapacity.toString(),
      availableCapacity: s.availableCapacity.toString()
    })) || []
  );
  
  const [formData, setFormData] = useState({
    ecoCentreId: activity.ecoCentreId,
    name: activity.name,
    description: activity.description || '',
    type: activity.type,
    isSlotBased: activity.isSlotBased,
    price: activity.price?.toString() || '',
    capacity: activity.capacity.toString(),
    ageRestrictions: activity.ageRestrictions || '',
    requiresVehicles: activity.requiresVehicles || false,
    vehicleCapacity: activity.vehicleCapacity?.toString() || '6'
  });

  const addSlot = () => {
    setSlots([...slots, { startTime: '09:00', endTime: '11:00', maxCapacity: '30', availableCapacity: '30' }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: string, value: string) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ecoCentreId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.type === 'PAID' && !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please enter a price for paid activities.",
        variant: "destructive"
      });
      return;
    }

    if (formData.isSlotBased && slots.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one time slot for slot-based activities.",
        variant: "destructive"
      });
      return;
    }
    
    const updates: Partial<BookingActivity> = {
      ecoCentreId: formData.ecoCentreId,
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type,
      isSlotBased: formData.isSlotBased,
      price: formData.type === 'PAID' ? parseFloat(formData.price) : undefined,
      capacity: parseInt(formData.capacity) || 50,
      ageRestrictions: formData.ageRestrictions || undefined,
      requiresVehicles: formData.requiresVehicles || undefined,
      vehicleCapacity: formData.requiresVehicles ? parseInt(formData.vehicleCapacity) : undefined,
      slots: formData.isSlotBased ? slots.map((slot, idx) => ({
        id: slot.id || `slot-${Date.now()}-${idx}`,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxCapacity: parseInt(slot.maxCapacity) || 30,
        availableCapacity: parseInt(slot.availableCapacity || slot.maxCapacity) || 30
      })) : undefined
    };

    onSave(updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Activity</DialogTitle>
          <DialogDescription>Update details for {activity.name}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-activity-ecoCentre">Eco Centre *</Label>
                <Select
                  value={formData.ecoCentreId}
                  onValueChange={(value) => setFormData({ ...formData, ecoCentreId: value })}
                  required
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select Eco Centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {ecoCentres.map(centre => (
                      <SelectItem key={centre.id} value={centre.id}>{centre.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-activity-name">Activity Name *</Label>
                <Input
                  id="edit-activity-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-activity-description">Description</Label>
                <Textarea
                  id="edit-activity-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-activity-type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'FREE' | 'PAID') => setFormData({ ...formData, type: value, price: value === 'FREE' ? '' : formData.price })}
                    required
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FREE">FREE</SelectItem>
                      <SelectItem value="PAID">PAID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-activity-capacity">Capacity *</Label>
                  <Input
                    id="edit-activity-capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    className="mt-2"
                    min="1"
                  />
                </div>
              </div>

              {formData.type === 'PAID' && (
                <div>
                  <Label htmlFor="edit-activity-price">Price *</Label>
                  <Input
                    id="edit-activity-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="mt-2"
                    min="0"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="edit-activity-ageRestrictions">Age Restrictions</Label>
                <Input
                  id="edit-activity-ageRestrictions"
                  value={formData.ageRestrictions}
                  onChange={(e) => setFormData({ ...formData, ageRestrictions: e.target.value })}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-activity-slotBased"
                  checked={formData.isSlotBased}
                  onCheckedChange={(checked) => setFormData({ ...formData, isSlotBased: checked as boolean })}
                />
                <Label htmlFor="edit-activity-slotBased" className="cursor-pointer">
                  Slot-Based Activity
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-activity-requiresVehicles"
                  checked={formData.requiresVehicles}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresVehicles: checked as boolean })}
                />
                <Label htmlFor="edit-activity-requiresVehicles" className="cursor-pointer">
                  Requires Vehicles
                </Label>
              </div>

              {formData.requiresVehicles && (
                <div>
                  <Label htmlFor="edit-activity-vehicleCapacity">Vehicle Capacity</Label>
                  <Input
                    id="edit-activity-vehicleCapacity"
                    type="number"
                    value={formData.vehicleCapacity}
                    onChange={(e) => setFormData({ ...formData, vehicleCapacity: e.target.value })}
                    className="mt-2"
                    min="1"
                  />
                </div>
              )}

              {formData.isSlotBased && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Time Slots *</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSlot}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Slot
                    </Button>
                  </div>
                  
                  {slots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No slots. Click "Add Slot" to add time slots.</p>
                  ) : (
                    <div className="space-y-3">
                      {slots.map((slot, index) => (
                        <Card key={index}>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-4 gap-3 items-end">
                              <div>
                                <Label>Start Time *</Label>
                                <Input
                                  type="time"
                                  value={slot.startTime}
                                  onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                                  required
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label>End Time *</Label>
                                <Input
                                  type="time"
                                  value={slot.endTime}
                                  onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                                  required
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label>Max Capacity *</Label>
                                <Input
                                  type="number"
                                  value={slot.maxCapacity}
                                  onChange={(e) => updateSlot(index, 'maxCapacity', e.target.value)}
                                  required
                                  className="mt-2"
                                  min="1"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSlot(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit"><CheckCircle className="w-4 h-4 mr-2" />Update Activity</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Activity Slot Management Dialog Component
interface ActivitySlotManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  activity: BookingActivity;
  onUpdateSlots: (slots: ActivitySlot[]) => void;
}

export const ActivitySlotManagementDialog = ({ isOpen, onClose, activity, onUpdateSlots }: ActivitySlotManagementDialogProps) => {
  const [slots, setSlots] = useState<Array<{ id?: string; startTime: string; endTime: string; maxCapacity: string; availableCapacity?: string }>>(
    activity.slots?.map(s => ({
      id: s.id,
      startTime: s.startTime,
      endTime: s.endTime,
      maxCapacity: s.maxCapacity.toString(),
      availableCapacity: s.availableCapacity.toString()
    })) || []
  );

  const addSlot = () => {
    setSlots([...slots, { startTime: '09:00', endTime: '11:00', maxCapacity: '30', availableCapacity: '30' }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index: number, field: string, value: string) => {
    const updated = [...slots];
    updated[index] = { ...updated[index], [field]: value };
    setSlots(updated);
  };

  const handleSave = () => {
    const activitySlots: ActivitySlot[] = slots.map((slot, idx) => ({
      id: slot.id || `slot-${Date.now()}-${idx}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCapacity: parseInt(slot.maxCapacity) || 30,
      availableCapacity: parseInt(slot.availableCapacity || slot.maxCapacity) || 30
    }));
    onUpdateSlots(activitySlots);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Manage Time Slots</DialogTitle>
          <DialogDescription>Configure time slots for {activity.name}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Time Slots</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addSlot}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {slots.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No slots configured. Click "Add Slot" to add time slots.
                </p>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-5 gap-3 items-end">
                          <div>
                            <Label>Start Time *</Label>
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                              required
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>End Time *</Label>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                              required
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label>Max Capacity *</Label>
                            <Input
                              type="number"
                              value={slot.maxCapacity}
                              onChange={(e) => {
                                updateSlot(index, 'maxCapacity', e.target.value);
                                updateSlot(index, 'availableCapacity', e.target.value);
                              }}
                              required
                              className="mt-2"
                              min="1"
                            />
                          </div>
                          <div>
                            <Label>Available Capacity</Label>
                            <Input
                              type="number"
                              value={slot.availableCapacity || slot.maxCapacity}
                              onChange={(e) => updateSlot(index, 'availableCapacity', e.target.value)}
                              className="mt-2"
                              min="0"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSlot(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Settings className="w-4 h-4 mr-2" />
              Save Slots
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

