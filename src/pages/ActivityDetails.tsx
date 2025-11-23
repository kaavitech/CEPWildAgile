import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Calendar, Clock, Users, IndianRupee, Package, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockEcoCentres, getBookingActivitiesForCentre, getAvailableSlotsForDate } from '@/lib/mockData';
import type { BookingActivity, ActivitySlot } from '@/lib/mockData';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface SelectedSlot {
  activityId: string;
  slotId: string;
  participants: number;
}

const ActivityDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const centre = mockEcoCentres.find(c => c.id === id);
  const activities = getBookingActivitiesForCentre(id || '');
  const initialDate = searchParams.get('date') || '';
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [canDivideIntoMultipleSlots, setCanDivideIntoMultipleSlots] = useState(false);
  const [packageType, setPackageType] = useState<'individual' | 'fullDay'>('individual');
  const [selectedSlots, setSelectedSlots] = useState<Map<string, SelectedSlot>>(new Map());
  
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  // Filter activities - exclude those included in full day package
  const regularActivities = activities.filter(a => {
    if (packageType === 'fullDay' && centre?.wholeDayPackage) {
      // Check if this activity is in the package (by name match for now)
      // In real scenario, we'd match by ID
      return false;
    }
    // Filter out special events/seminars when full day package is selected
    if (packageType === 'fullDay' && (a.name.toLowerCase().includes('seminar') || a.name.toLowerCase().includes('event'))) {
      return true; // Keep special events even with full day package
    }
    return true;
  });

  // Get special event activities (seminars, events)
  const specialEventActivities = activities.filter(a => 
    a.name.toLowerCase().includes('seminar') || 
    a.name.toLowerCase().includes('event') ||
    a.name.toLowerCase().includes('lecture')
  );

  const handleSlotToggle = (activityId: string, slotId: string, slot: ActivitySlot) => {
    if (packageType === 'fullDay') {
      return; // Disable slot selection when full day package is selected
    }

    const key = `${activityId}-${slotId}`;
    const newSelectedSlots = new Map(selectedSlots);
    
    if (newSelectedSlots.has(key)) {
      // Deselect slot
      newSelectedSlots.delete(key);
    } else {
      // Check capacity
      const activity = activities.find(a => a.id === activityId);
      if (!activity) return;
      
      let requiredCapacity = numberOfPeople;
      if (activity.requiresVehicles) {
        // For safari, calculate vehicles needed
        const vehiclesNeeded = Math.ceil(numberOfPeople / (activity.vehicleCapacity || 6));
        requiredCapacity = vehiclesNeeded * (activity.vehicleCapacity || 6);
      }
      
      if (slot.availableCapacity < requiredCapacity && !canDivideIntoMultipleSlots) {
        toast({
          title: 'Not enough capacity',
          description: `Only ${slot.availableCapacity} seats available in this slot. Enable "Divide into multiple slots" if your group can be split.`,
          variant: 'destructive'
        });
        return;
      }
      
      // If can divide and not enough in one slot, check multiple slots
      if (slot.availableCapacity < requiredCapacity && canDivideIntoMultipleSlots) {
        // Allow selection but will need to handle division during booking
        newSelectedSlots.set(key, {
          activityId,
          slotId,
          participants: Math.min(numberOfPeople, slot.availableCapacity)
        });
      } else {
        newSelectedSlots.set(key, {
          activityId,
          slotId,
          participants: numberOfPeople
        });
      }
    }
    
    setSelectedSlots(newSelectedSlots);
  };

  const handleBook = () => {
    if (!selectedDate) {
      toast({
        title: 'Date required',
        description: 'Please select a date for your booking',
        variant: 'destructive'
      });
      return;
    }

    if (packageType === 'individual' && selectedSlots.size === 0) {
      toast({
        title: 'No activities selected',
        description: 'Please select at least one activity and time slot',
        variant: 'destructive'
      });
      return;
    }

    if (numberOfPeople < 1) {
      toast({
        title: 'Invalid number of people',
        description: 'Please enter a valid number of participants',
        variant: 'destructive'
      });
      return;
    }

    // Store booking data in sessionStorage for multi-slot/full-day booking
    const bookingData = {
      packageType,
      selectedDate,
      numberOfPeople,
      selectedSlots: packageType === 'individual' ? Array.from(selectedSlots.values()) : [],
      ecoCentreId: id,
      fullDayPackage: packageType === 'fullDay' ? centre.wholeDayPackage : null
    };
    
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Navigate to booking form - use first activity or a special activity ID for full-day
    if (packageType === 'fullDay') {
      // Use first activity as placeholder, BookingForm will detect full-day from sessionStorage
      const firstActivity = activities[0];
      if (firstActivity) {
        navigate(`/bookings/${id}/${firstActivity.id}?date=${selectedDate}&participants=${numberOfPeople}&packageType=fullDay`);
      }
    } else {
      // For individual activities, use first selected slot
      const firstSlot = Array.from(selectedSlots.values())[0];
      if (firstSlot) {
        navigate(`/bookings/${id}/${firstSlot.activityId}?date=${selectedDate}&participants=${numberOfPeople}&multiSlot=true`);
      }
    }
  };

  if (!centre) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Eco Centre not found</h1>
          <Link to="/bookings">
            <Button>Back to Bookings</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  // Calculate total cost
  const calculateTotalCost = () => {
    if (packageType === 'fullDay' && centre.wholeDayPackage) {
      return centre.wholeDayPackage.cost * numberOfPeople;
    }
    
    let total = 0;
    selectedSlots.forEach((slotData) => {
      const activity = activities.find(a => a.id === slotData.activityId);
      if (activity && activity.type === 'PAID' && activity.price) {
        if (activity.requiresVehicles) {
          const vehiclesNeeded = Math.ceil(slotData.participants / (activity.vehicleCapacity || 6));
          total += activity.price * vehiclesNeeded;
        } else {
          total += activity.price * slotData.participants;
        }
      }
    });
    return total;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Link to="/bookings">
                <Button variant="ghost" className="mb-6 text-primary-foreground hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Bookings
                </Button>
              </Link>
              <div className="text-center animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{centre.name}</h1>
                <p className="text-xl opacity-95">{centre.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Select Activities & Time Slots</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Choose your preferred activities and time slots for your visit to {centre.name}
                </p>
              </div>
              
              {/* Date and People Selection */}
              <Card className="mb-8 shadow-soft">
                <CardHeader>
                  <h3 className="text-2xl font-bold">Booking Details</h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5" />
                      Select Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedSlots(new Map()); // Clear selections when date changes
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Number of People */}
                  <div>
                    <Label htmlFor="people" className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5" />
                      Number of Participants
                    </Label>
                    <Input
                      id="people"
                      type="number"
                      min="1"
                      value={numberOfPeople}
                      onChange={(e) => {
                        const count = parseInt(e.target.value) || 1;
                        setNumberOfPeople(count);
                        setSelectedSlots(new Map()); // Clear selections when people count changes
                      }}
                      className="w-full"
                    />
                  </div>

                  {/* Package Type Selection */}
                  {centre.wholeDayPackage && (
                    <div>
                      <Label className="mb-3 block">Booking Type</Label>
                      <RadioGroup value={packageType} onValueChange={(value) => {
                        setPackageType(value as 'individual' | 'fullDay');
                        setSelectedSlots(new Map()); // Clear selections when package type changes
                      }}>
                        <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                          <RadioGroupItem value="individual" id="individual" className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor="individual" className="font-semibold cursor-pointer">
                              Individual Activities
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Select specific activities and time slots
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 mt-3">
                          <RadioGroupItem value="fullDay" id="fullDay" className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="fullDay" className="font-semibold cursor-pointer">
                                <Package className="h-4 w-4 inline mr-2" />
                                {centre.wholeDayPackage.name}
                              </Label>
                              <Badge>
                                <IndianRupee className="h-3 w-3 inline mr-1" />
                                {centre.wholeDayPackage.cost} per person
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {centre.wholeDayPackage.description}
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}

                  {/* Divide into multiple slots checkbox */}
                  {packageType === 'individual' && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="divideSlots"
                        checked={canDivideIntoMultipleSlots}
                        onCheckedChange={(checked) => setCanDivideIntoMultipleSlots(checked as boolean)}
                      />
                      <Label htmlFor="divideSlots" className="cursor-pointer">
                        Group can be divided into multiple time slots
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activities with Slot Selection */}
              {packageType === 'individual' && (
                <>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">Available Activities</h3>
                    <p className="text-muted-foreground">Select your preferred activities and time slots</p>
                  </div>
                  <div className="space-y-6 mb-8">
                    {regularActivities.map((activity) => (
                      <ActivitySlotCard
                        key={activity.id}
                        activity={activity}
                        selectedDate={selectedDate}
                        numberOfPeople={numberOfPeople}
                        canDivideIntoMultipleSlots={canDivideIntoMultipleSlots}
                        selectedSlots={selectedSlots}
                        onSlotToggle={handleSlotToggle}
                      />
                    ))}
                  </div>

                  {/* Special Event Activities (available even with full day package) */}
                  {specialEventActivities.length > 0 && (
                    <>
                      <h3 className="text-xl font-bold mb-4 mt-8">Special Events</h3>
                      <div className="space-y-6 mb-8">
                        {specialEventActivities.map((activity) => (
                          <ActivitySlotCard
                            key={activity.id}
                            activity={activity}
                            selectedDate={selectedDate}
                            numberOfPeople={numberOfPeople}
                            canDivideIntoMultipleSlots={canDivideIntoMultipleSlots}
                            selectedSlots={selectedSlots}
                            onSlotToggle={handleSlotToggle}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Full Day Package Info */}
              {packageType === 'fullDay' && centre.wholeDayPackage && (
                <Card className="mb-8 shadow-soft border-primary/20">
                  <CardHeader>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Package className="h-6 w-6" />
                      {centre.wholeDayPackage.name}
                    </h2>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{centre.wholeDayPackage.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Price per person:</span>
                        <span className="font-semibold">
                          <IndianRupee className="h-4 w-4 inline" />
                          {centre.wholeDayPackage.cost}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Number of people:</span>
                        <span className="font-semibold">{numberOfPeople}</span>
                      </div>
                      <div className="border-t pt-2 flex items-center justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>
                          <IndianRupee className="h-5 w-5 inline" />
                          {calculateTotalCost()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Booking Summary and Button */}
              {(packageType === 'individual' && selectedSlots.size > 0) || packageType === 'fullDay' ? (
                <Card className="shadow-soft border-primary/20 sticky bottom-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Booking Summary</h3>
                        {packageType === 'individual' && (
                          <p className="text-sm text-muted-foreground">
                            {selectedSlots.size} activit{selectedSlots.size !== 1 ? 'ies' : 'y'} selected
                          </p>
                        )}
                        {packageType === 'fullDay' && (
                          <p className="text-sm text-muted-foreground">
                            Full day package for {numberOfPeople} {numberOfPeople !== 1 ? 'people' : 'person'}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                        <p className="text-2xl font-bold">
                          <IndianRupee className="h-5 w-5 inline" />
                          {calculateTotalCost()}
                        </p>
                      </div>
                    </div>
                    <Button size="lg" className="w-full" onClick={handleBook}>
                      <Package className="h-5 w-5 mr-2" />
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                packageType === 'individual' && (
                  <Card className="shadow-soft">
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      <p>Select date, number of people, and at least one activity slot to continue</p>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

interface ActivitySlotCardProps {
  activity: BookingActivity;
  selectedDate: string;
  numberOfPeople: number;
  canDivideIntoMultipleSlots: boolean;
  selectedSlots: Map<string, SelectedSlot>;
  onSlotToggle: (activityId: string, slotId: string, slot: ActivitySlot) => void;
}

const ActivitySlotCard = ({
  activity,
  selectedDate,
  numberOfPeople,
  canDivideIntoMultipleSlots,
  selectedSlots,
  onSlotToggle
}: ActivitySlotCardProps) => {
  const isSlotBased = activity.isSlotBased;
  const isFree = activity.type === 'FREE';
  const requiresVehicles = activity.requiresVehicles || false;
  const availableSlots = selectedDate && isSlotBased
    ? getAvailableSlotsForDate(activity.id, selectedDate)
    : [];

  const isSlotSelected = (slotId: string) => {
    const key = `${activity.id}-${slotId}`;
    return selectedSlots.has(key);
  };

  const isSlotEnabled = (slot: ActivitySlot) => {
    if (!selectedDate || numberOfPeople < 1) return false;
    
    let requiredCapacity = numberOfPeople;
    if (requiresVehicles) {
      const vehiclesNeeded = Math.ceil(numberOfPeople / (activity.vehicleCapacity || 6));
      requiredCapacity = vehiclesNeeded * (activity.vehicleCapacity || 6);
    }
    
    if (canDivideIntoMultipleSlots) {
      return slot.availableCapacity > 0;
    }
    
    return slot.availableCapacity >= requiredCapacity;
  };

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">{activity.name}</h3>
            {activity.description && (
              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
            )}
          </div>
          <Badge variant={isFree ? 'secondary' : 'default'}>
            {isFree ? 'FREE' : 'PAID'}
          </Badge>
        </div>
        {!isFree && activity.price && (
          <div className="flex items-center gap-2 text-lg font-semibold mt-2">
            <IndianRupee className="h-5 w-5" />
            <span>{activity.price} per {requiresVehicles ? 'vehicle' : 'person'}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!selectedDate ? (
          <p className="text-sm text-muted-foreground">Please select a date first</p>
        ) : isSlotBased && availableSlots.length > 0 ? (
          <div>
            <Label className="mb-3 block">Select Time Slot:</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableSlots.map((slot) => {
                const enabled = isSlotEnabled(slot);
                const selected = isSlotSelected(slot.id);
                
                return (
                  <Button
                    key={slot.id}
                    variant={selected ? 'default' : 'outline'}
                    disabled={!enabled && !selected}
                    onClick={() => onSlotToggle(activity.id, slot.id, slot)}
                    className="h-auto py-3 flex flex-col items-start"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold">{slot.startTime} - {slot.endTime}</span>
                      {selected && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {slot.availableCapacity} available
                      {!enabled && !selected && slot.availableCapacity > 0 && (
                        <span className="text-destructive ml-1">
                          (Need {numberOfPeople} {requiresVehicles ? 'people' : 'seats'})
                        </span>
                      )}
                    </span>
                  </Button>
                );
              })}
            </div>
            {availableSlots.length === 0 && (
              <p className="text-sm text-muted-foreground">No slots available for this date</p>
            )}
          </div>
        ) : !isSlotBased ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>Available all day - No time slots required</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No slots available for this date</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityDetails;
