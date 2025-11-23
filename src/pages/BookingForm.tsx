import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, IndianRupee, Users, Car, Calendar, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockEcoCentres, mockBookingActivities, getBookingActivitiesForCentre, getAvailableSlotsForDate, createBooking, ActivitySlot, BookingActivity } from '@/lib/mockData';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface SelectedSlot {
  activityId: string;
  slotId: string;
  participants: number;
}

interface BookingData {
  packageType: 'individual' | 'fullDay';
  selectedDate: string;
  numberOfPeople: number;
  selectedSlots: SelectedSlot[];
  ecoCentreId: string;
  fullDayPackage: any;
}

const BookingForm = () => {
  const { ecoCentreId, activityId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const centre = mockEcoCentres.find(c => c.id === ecoCentreId);
  const activity = mockBookingActivities.find(a => a.id === activityId);
  const initialDate = searchParams.get('date') || '';
  const packageType = searchParams.get('packageType');
  const isMultiSlot = searchParams.get('multiSlot') === 'true';
  const participantsParam = searchParams.get('participants');
  
  // Read booking data from sessionStorage
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Array<{ activity: BookingActivity; slot: SelectedSlot; slotDetails?: ActivitySlot }>>([]);
  
  useEffect(() => {
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData) as BookingData;
        setBookingData(parsed);
        
        // Load selected activities with their details
        if (parsed.packageType === 'individual' && parsed.selectedSlots.length > 0) {
          const activitiesList = parsed.selectedSlots.map(slot => {
            const act = mockBookingActivities.find(a => a.id === slot.activityId);
            if (!act) return null;
            
            // Find slot details if slot-based
            let slotDetails: ActivitySlot | undefined;
            if (act.isSlotBased && act.slots) {
              slotDetails = act.slots.find(s => s.id === slot.slotId);
            }
            
            return { activity: act, slot, slotDetails };
          }).filter(Boolean) as Array<{ activity: BookingActivity; slot: SelectedSlot; slotDetails?: ActivitySlot }>;
          
          setSelectedActivities(activitiesList);
        }
      } catch (e) {
        console.error('Failed to parse booking data from sessionStorage', e);
      }
    }
  }, []);
  
  // Check if this is a full-day package or multi-slot booking
  const isFullDayPackage = bookingData?.packageType === 'fullDay' || packageType === 'fullDay';
  const selectedSlots = bookingData?.selectedSlots || [];
  const actualDate = bookingData?.selectedDate || initialDate;
  const actualParticipants = bookingData?.numberOfPeople || (participantsParam ? parseInt(participantsParam) : 1);
  
  const [formData, setFormData] = useState({
    date: actualDate || '',
    slotId: '',
    name: '',
    mobile: '',
    participants: actualParticipants,
    vehicles: 1
  });
  
  // Update formData when bookingData is loaded
  useEffect(() => {
    if (bookingData) {
      setFormData(prev => ({
        ...prev,
        date: bookingData.selectedDate || prev.date,
        participants: bookingData.numberOfPeople || prev.participants
      }));
    }
  }, [bookingData]);

  const [availableSlots, setAvailableSlots] = useState<ActivitySlot[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (formData.date && activity?.isSlotBased && !isFullDayPackage && activity?.id) {
      const slots = getAvailableSlotsForDate(activity.id, formData.date);
      setAvailableSlots(slots || []);
    } else {
      setAvailableSlots([]);
    }
  }, [formData.date, activity, isFullDayPackage]);

  // For full-day package, we don't need activity, but we still need centre
  if (!centre) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Eco Centre not found</h1>
          <Button onClick={() => navigate('/bookings')}>Back to Bookings</Button>
        </main>
        <Footer />
      </div>
    );
  }

  // For full-day package, we can proceed without activity
  // For regular bookings, we need activity
  if (!isFullDayPackage && !activity) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Activity not found</h1>
          <Button onClick={() => navigate(`/bookings/${ecoCentreId}`)}>Back to Activities</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const isSlotBased = activity?.isSlotBased || false;
  const isFree = activity?.type === 'FREE' || false;
  const requiresVehicles = activity?.requiresVehicles || false;
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate total amount based on booking type
  useEffect(() => {
    if (isFullDayPackage && centre?.wholeDayPackage) {
      setTotalAmount(centre.wholeDayPackage.cost * formData.participants);
    } else if (selectedActivities.length > 0) {
      // Calculate total for all selected activities
      let total = 0;
      selectedActivities.forEach(({ activity: act, slot }) => {
        if (act.type === 'PAID' && act.price) {
          if (act.requiresVehicles) {
            // For safari, calculate vehicles needed
            const vehiclesNeeded = Math.ceil(slot.participants / (act.vehicleCapacity || 6));
            total += act.price * vehiclesNeeded;
          } else {
            total += act.price * slot.participants;
          }
        }
      });
      setTotalAmount(total);
    } else if (activity) {
      let amount = 0;
      if (activity.type === 'PAID' && activity.price) {
        if (activity.requiresVehicles && formData.vehicles) {
          amount = activity.price * formData.vehicles;
        } else {
          amount = activity.price * formData.participants;
        }
      }
      setTotalAmount(amount);
    }
  }, [activity, formData.participants, formData.vehicles, isFullDayPackage, centre, selectedActivities]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.date) {
      toast({ title: 'Error', description: 'Please select a date', variant: 'destructive' });
      return;
    }
    
    if (isSlotBased && !formData.slotId && !isFullDayPackage) {
      toast({ title: 'Error', description: 'Please select a time slot', variant: 'destructive' });
      return;
    }
    
    if (!formData.name || !formData.mobile) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (formData.participants < 1) {
      toast({ title: 'Error', description: 'Number of participants must be at least 1', variant: 'destructive' });
      return;
    }

    if (requiresVehicles && formData.vehicles < 1) {
      toast({ title: 'Error', description: 'Number of vehicles must be at least 1', variant: 'destructive' });
      return;
    }

    // Check slot capacity (skip for full-day package)
    if (!isFullDayPackage && isSlotBased && formData.slotId && activity) {
      const slot = availableSlots?.find(s => s.id === formData.slotId);
      if (slot) {
        const requestedCapacity = requiresVehicles 
          ? formData.vehicles * (activity.vehicleCapacity || 6)
          : formData.participants;
        
        if (requestedCapacity > slot.availableCapacity) {
          toast({ 
            title: 'Error', 
            description: `Only ${slot.availableCapacity} seats available in this slot`, 
            variant: 'destructive' 
          });
          return;
        }
      }
    }

    // Create booking
    if (isFullDayPackage) {
      // For full-day package, use first activity as placeholder
      const firstActivity = getBookingActivitiesForCentre(centre.id)[0];
      if (firstActivity) {
        const booking = createBooking({
          ecoCentreId: centre.id,
          activityId: firstActivity.id,
          date: formData.date,
          slotId: undefined,
          name: formData.name,
          mobile: formData.mobile,
          participants: formData.participants,
          vehicles: undefined,
          totalAmount,
          paymentStatus: 'pending'
        });
        navigate(`/bookings/confirmation/${booking.id}`);
      }
    } else if (selectedActivities.length > 0) {
      // For multi-activity booking, create bookings for all selected activities
      // Create first booking and navigate to confirmation (for demo, we'll just show one)
      const firstActivityData = selectedActivities[0];
      if (firstActivityData) {
        const { activity: act, slot } = firstActivityData;
        const isActFree = act.type === 'FREE';
        
        const booking = createBooking({
          ecoCentreId: centre.id,
          activityId: act.id,
          date: formData.date,
          slotId: slot.slotId || undefined,
          name: formData.name,
          mobile: formData.mobile,
          participants: slot.participants,
          vehicles: act.requiresVehicles ? Math.ceil(slot.participants / (act.vehicleCapacity || 6)) : undefined,
          totalAmount: totalAmount, // Total for all activities
          paymentStatus: isActFree ? 'completed' : 'pending'
        });
        navigate(`/bookings/confirmation/${booking.id}`);
      }
    } else {
      // Single activity booking
      if (!activity) {
        toast({ title: 'Error', description: 'Activity not found', variant: 'destructive' });
        return;
      }
      
      const booking = createBooking({
        ecoCentreId: centre.id,
        activityId: activity.id,
        date: formData.date,
        slotId: formData.slotId || undefined,
        name: formData.name,
        mobile: formData.mobile,
        participants: formData.participants,
        vehicles: requiresVehicles ? formData.vehicles : undefined,
        totalAmount,
        paymentStatus: isFree ? 'completed' : 'pending'
      });

      // Navigate to confirmation page
      navigate(`/bookings/confirmation/${booking.id}`);
    }
  };

  const selectedSlot = availableSlots?.find(s => s.id === formData.slotId);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Button
                variant="ghost"
                className="mb-6 text-primary-foreground hover:bg-white/10"
                onClick={() => navigate(`/bookings/${ecoCentreId}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Activities
              </Button>
              <div className="text-center animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {isFullDayPackage && centre?.wholeDayPackage 
                    ? `Book ${centre.wholeDayPackage.name}` 
                    : selectedActivities.length > 0
                      ? `Complete Your Booking`
                      : activity?.name 
                        ? `Book ${activity.name}` 
                        : 'Complete Booking'}
                </h1>
                <p className="text-xl opacity-95">{centre.name}</p>
                {selectedActivities.length > 0 && (
                  <p className="text-lg opacity-90 mt-2">
                    {selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'} selected
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Complete Your Booking</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Please fill in your details to confirm your booking
                </p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Activity Summary - Show all selected activities if multi-slot */}
                  {(isFullDayPackage || activity || selectedActivities.length > 0) && (
                    <Card className="shadow-soft">
                      <CardHeader>
                        <h2 className="text-2xl font-bold">
                          {isFullDayPackage && centre?.wholeDayPackage 
                            ? 'Package Details' 
                            : selectedActivities.length > 0
                              ? 'Selected Activities'
                              : 'Activity Details'}
                        </h2>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {isFullDayPackage && centre?.wholeDayPackage ? (
                          <>
                            <div>
                              <h3 className="font-semibold text-lg">{centre.wholeDayPackage.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{centre.wholeDayPackage.description}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="default">PAID</Badge>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="h-4 w-4" />
                                <span className="font-semibold">
                                  {centre.wholeDayPackage.cost} per person
                                </span>
                              </div>
                            </div>
                          </>
                        ) : selectedActivities.length > 0 ? (
                          <div className="space-y-4">
                            {selectedActivities.map(({ activity: act, slot, slotDetails }, index) => {
                              const isActFree = act.type === 'FREE';
                              const requiresVehicles = act.requiresVehicles || false;
                              let itemAmount = 0;
                              if (act.type === 'PAID' && act.price) {
                                if (requiresVehicles) {
                                  const vehiclesNeeded = Math.ceil(slot.participants / (act.vehicleCapacity || 6));
                                  itemAmount = act.price * vehiclesNeeded;
                                } else {
                                  itemAmount = act.price * slot.participants;
                                }
                              }
                              
                              return (
                                <div key={`${act.id}-${slot.slotId}-${index}`} className="border-b pb-4 last:border-0 last:pb-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h3 className="font-semibold text-lg">{act.name}</h3>
                                      {act.description && (
                                        <p className="text-sm text-muted-foreground mt-1">{act.description}</p>
                                      )}
                                      <div className="flex items-center gap-4 mt-2">
                                        <Badge variant={isActFree ? 'secondary' : 'default'}>
                                          {isActFree ? 'FREE' : 'PAID'}
                                        </Badge>
                                        {slotDetails && (
                                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{slotDetails.startTime} - {slotDetails.endTime}</span>
                                          </div>
                                        )}
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                          <Users className="h-4 w-4" />
                                          <span>{slot.participants} {slot.participants === 1 ? 'person' : 'people'}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {!isActFree && itemAmount > 0 && (
                                      <div className="flex items-center gap-1">
                                        <IndianRupee className="h-4 w-4" />
                                        <span className="font-semibold">{itemAmount}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : activity ? (
                          <>
                            <div>
                              <h3 className="font-semibold text-lg">{activity.name}</h3>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant={isFree ? 'secondary' : 'default'}>
                                {isFree ? 'FREE' : 'PAID'}
                              </Badge>
                              {!isFree && activity.price && (
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="h-4 w-4" />
                                  <span className="font-semibold">
                                    {activity.price} per {requiresVehicles ? 'vehicle' : 'person'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </>
                        ) : null}
                      </CardContent>
                    </Card>
                  )}

                  {/* Date Selection */}
                  <Card className="shadow-soft">
                    <CardHeader>
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Select Date
                      </h2>
                    </CardHeader>
                    <CardContent>
                      <Label htmlFor="date">Visit Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        min={today}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value, slotId: '' })}
                        required
                        className="mt-2"
                        disabled={selectedActivities.length > 0 || isFullDayPackage}
                        readOnly={selectedActivities.length > 0 || isFullDayPackage}
                      />
                      {(selectedActivities.length > 0 || isFullDayPackage) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Date is pre-selected from your activity selection
                        </p>
                      )}
                      {formData.date && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Selected: {format(new Date(formData.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Slot Selection (if slot-based) - Skip for full-day package */}
                  {!isFullDayPackage && isSlotBased && formData.date && availableSlots && availableSlots.length > 0 && (
                    <Card className="shadow-soft">
                      <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Select Time Slot
                        </h2>
                      </CardHeader>
                      <CardContent>
                        <Label htmlFor="slot">Time Slot *</Label>
                        <Select
                          value={formData.slotId}
                          onValueChange={(value) => setFormData({ ...formData, slotId: value })}
                          required
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSlots.map((slot) => (
                              <SelectItem
                                key={slot.id}
                                value={slot.id}
                                disabled={slot.availableCapacity <= 0}
                              >
                                {slot.startTime} - {slot.endTime} ({slot.availableCapacity} available)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  )}

                  {/* Participant Details */}
                  <Card className="shadow-soft">
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Booking Details</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="mt-2"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="mobile">Mobile Number *</Label>
                        <Input
                          id="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                          required
                          className="mt-2"
                          placeholder="+91-9876543210"
                        />
                      </div>

                      {/* Hide participant/vehicle inputs if multi-activity booking (already set) */}
                      {selectedActivities.length === 0 && !isFullDayPackage && requiresVehicles ? (
                        <>
                          <div>
                            <Label htmlFor="vehicles" className="flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              Number of Vehicles * (6 people per vehicle)
                            </Label>
                            <Input
                              id="vehicles"
                              type="number"
                              min="1"
                              max="10"
                              value={formData.vehicles}
                              onChange={(e) => setFormData({ ...formData, vehicles: parseInt(e.target.value) || 1 })}
                              required
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="participants" className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Number of Participants * (Max {formData.vehicles * (activity?.vehicleCapacity || 6)})
                            </Label>
                            <Input
                              id="participants"
                              type="number"
                              min="1"
                              max={formData.vehicles * (activity?.vehicleCapacity || 6)}
                              value={formData.participants}
                              onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
                              required
                              className="mt-2"
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <Label htmlFor="participants" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Number of Participants *
                          </Label>
                          <Input
                            id="participants"
                            type="number"
                            min="1"
                            max={isFullDayPackage ? centre?.capacity || 100 : activity?.capacity || 100}
                            value={formData.participants}
                            onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value) || 1 })}
                            required
                            className="mt-2"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Payment Summary */}
                  <Card className="shadow-soft">
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Payment Summary</h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedActivities.length > 0 ? (
                          // Show all selected activities
                          <>
                            {selectedActivities.map(({ activity: act, slot }, index) => {
                              const isActFree = act.type === 'FREE';
                              const requiresVehicles = act.requiresVehicles || false;
                              let itemAmount = 0;
                              if (act.type === 'PAID' && act.price) {
                                if (requiresVehicles) {
                                  const vehiclesNeeded = Math.ceil(slot.participants / (act.vehicleCapacity || 6));
                                  itemAmount = act.price * vehiclesNeeded;
                                } else {
                                  itemAmount = act.price * slot.participants;
                                }
                              }
                              
                              return (
                                <div key={`summary-${act.id}-${index}`} className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {act.name} ({slot.participants} {requiresVehicles ? `× ${Math.ceil(slot.participants / (act.vehicleCapacity || 6))} vehicle(s)` : 'person(s)'})
                                  </span>
                                  {isActFree ? (
                                    <span className="font-semibold">FREE</span>
                                  ) : (
                                    <span className="font-semibold">
                                      <IndianRupee className="inline h-3 w-3" />
                                      {itemAmount}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </>
                        ) : (
                          // Single activity or full-day package
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {isFullDayPackage && centre?.wholeDayPackage 
                                ? `${centre.wholeDayPackage.name} (${formData.participants} person(s))`
                                : activity?.name 
                                  ? `${activity.name} (${formData.participants} ${requiresVehicles ? `× ${formData.vehicles} vehicle(s)` : 'person(s)'})`
                                  : `${formData.participants} person(s)`}
                            </span>
                            {(isFullDayPackage || !isFree) ? (
                              <span className="font-semibold">
                                <IndianRupee className="inline h-4 w-4" />
                                {totalAmount}
                              </span>
                            ) : (
                              <span className="font-semibold">FREE</span>
                            )}
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>
                            {totalAmount === 0 ? 'FREE' : (
                              <>
                                <IndianRupee className="inline h-5 w-5" />
                                {totalAmount}
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full">
                    {isFullDayPackage || !isFree ? 'Proceed to Payment' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookingForm;

