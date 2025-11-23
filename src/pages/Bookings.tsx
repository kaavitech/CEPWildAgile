import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockEcoCentres, mockBookingActivities, mockBookings, mockEvents, getAvailableSlotsForDate } from '@/lib/mockData';
import type { Event } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths, parseISO, differenceInDays, startOfWeek, endOfWeek, isBefore, isAfter, startOfDay } from 'date-fns';
import seminaryHillsImg from '@/assets/seminary-hills-1.jpg';
import welcomeAboutImg from '@/assets/welcome-about.jpg';
import gorewada1Img from '@/assets/gorewada1.jpg';

const imageMap: Record<string, string> = {
  'seminary-hills-1.jpg': seminaryHillsImg,
  'welcome-about.jpg': welcomeAboutImg,
  'gorewada1.jpg': gorewada1Img,
};

const Bookings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [centreMonthMap, setCentreMonthMap] = useState<Record<string, Date>>({});

  // Get all unique activities for filter
  const allActivities = useMemo(() => {
    const activityMap = new Map<string, string>();
    mockBookingActivities.forEach(activity => {
      activityMap.set(activity.id, activity.name);
    });
    return Array.from(activityMap.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // Filter centres based on search term and activity
  const filteredCentres = useMemo(() => {
    return mockEcoCentres.filter(centre => {
      const matchesSearch = 
        centre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        centre.location.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (selectedActivity === 'all') return true;
      
      const centreActivities = mockBookingActivities.filter(a => a.ecoCentreId === centre.id);
      return centreActivities.some(a => a.id === selectedActivity);
    });
  }, [searchTerm, selectedActivity]);
  
  // Get or initialize month for a specific centre
  const getCentreMonth = (centreId: string): Date => {
    if (!centreMonthMap[centreId]) {
      setCentreMonthMap(prev => ({ ...prev, [centreId]: new Date() }));
      return new Date();
    }
    return centreMonthMap[centreId];
  };
  
  const setCentreMonth = (centreId: string, month: Date) => {
    setCentreMonthMap(prev => ({ ...prev, [centreId]: month }));
  };

  // Helper functions for date checking
  const today = new Date();
  const isPastDate = (date: Date) => {
    return differenceInDays(today, date) > 0;
  };
  
  const isFutureDate = (date: Date) => {
    return differenceInDays(date, today) > 0;
  };

  // Get bookings count for each eco centre
  const getBookingCountForCentre = (centreId: string, date: string) => {
    const activities = mockBookingActivities.filter(a => a.ecoCentreId === centreId);
    const bookings = mockBookings.filter(
      b => b.ecoCentreId === centreId && b.date === date && b.status === 'confirmed'
    );
    return bookings.length;
  };

  // Get available activities count for a date
  const getAvailableActivitiesCount = (centreId: string, date: string) => {
    const activities = mockBookingActivities.filter(a => a.ecoCentreId === centreId);
    const today = new Date();
    const checkDate = parseISO(date);
    
    // Check if date is in past
    if (differenceInDays(today, checkDate) > 0) {
      return 0;
    }
    
    // Check weekly off days
    const centre = mockEcoCentres.find(c => c.id === centreId);
    if (centre?.weeklyOffDays) {
      const dayName = format(checkDate, 'EEEE');
      if (centre.weeklyOffDays.includes(dayName)) {
        return 0;
      }
    }
    
    return activities.length;
  };

  // Helper function to check if date has bookings
  const hasBookingForDate = (centreId: string, date: string): boolean => {
    return mockBookings.some(
      b => b.ecoCentreId === centreId && b.date === date && b.status === 'confirmed'
    );
  };

  // Get event for a specific date (sync with eco details page)
  const getEventForDate = (centreId: string, date: Date) => {
    const iso = format(date, 'yyyy-MM-dd');
    return mockEvents.find(evt => evt.ecoCentreId === centreId && evt.date === iso);
  };

  // Get event status for display (sync with eco details page)
  const getEventStatus = (event: typeof mockEvents[0]) => {
    if (event.eventType === 'guest_lecture') {
      return 'guest_lecture';
    }
    if (event.isFullyBooked) {
      return 'fully_booked';
    }
    if (event.isPartiallyBooked) {
      return 'partial_capacity';
    }
    if (event.bookedActivities && event.bookedActivities.length > 0) {
      return 'partial_activities';
    }
    return 'booked';
  };

  // Helper to get slot availability for date
  const getSlotAvailabilityForDate = (centreId: string, date: string) => {
    const activities = mockBookingActivities.filter(a => a.ecoCentreId === centreId);
    let hasAvailableSlots = false;
    let totalBookings = 0;
    
    activities.forEach(activity => {
      if (activity.isSlotBased) {
        const slots = getAvailableSlotsForDate(activity.id, date);
        const availableSlots = slots.filter(s => s.availableCapacity > 0);
        if (availableSlots.length > 0) {
          hasAvailableSlots = true;
        }
      }
      const bookings = mockBookings.filter(
        b => b.activityId === activity.id && b.date === date && b.status === 'confirmed'
      );
      totalBookings += bookings.length;
    });
    
    return { hasAvailableSlots, totalBookings, totalActivities: activities.length };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Book Your Activity</h1>
              <p className="text-xl opacity-95">
                Explore activities and book your visit to our eco centres
              </p>
            </div>
          </div>
        </section>

        {/* Centres Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Choose Your Eco Centre</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Select an eco centre to view available activities and book your preferred date and time.
              </p>
            </div>

            {/* Filters */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    {allActivities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id}>
                        {activity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Centres Grid with Calendar */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCentres.map((centre) => {
                const activities = mockBookingActivities.filter(a => a.ecoCentreId === centre.id);
                const centreImage = centre.images[0] ? imageMap[centre.images[0]] : undefined;
                
                return (
                  <Card key={centre.id} className="shadow-soft flex flex-col h-full">
                    <div 
                      className="h-48 bg-cover bg-center rounded-t-lg"
                      style={centreImage ? { backgroundImage: `url(${centreImage})` } : undefined}
                    >
                      {!centreImage && <div className="w-full h-full bg-gradient-forest" />}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold">{centre.name}</h3>
                        <Badge variant="outline">{activities.length} Activities</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {centre.location.district || 'Nagpur'}, {centre.location.state || 'Maharashtra'}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {/* Full Calendar Replica */}
                      <div className="mb-4">
                        {(() => {
                          const centreMonth = getCentreMonth(centre.id);
                          const today = new Date();
                          const todayStart = startOfDay(today);
                          
                          // Start calendar from today, not month start
                          const monthStart = startOfMonth(centreMonth);
                          const monthEnd = endOfMonth(centreMonth);
                          
                          // If current month, start from today, otherwise start from month start
                          const calendarStartDate = isSameMonth(centreMonth, today) 
                            ? todayStart 
                            : (monthStart < todayStart ? todayStart : monthStart);
                          
                          const calendarStart = startOfWeek(calendarStartDate);
                          const calendarEnd = endOfWeek(monthEnd);
                          const allCalendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
                          
                          // Filter out past dates
                          const calendarDays = allCalendarDays.filter(date => {
                            const dateStart = startOfDay(date);
                            return dateStart >= todayStart;
                          });
                          
                          return (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                  <CalendarIcon className="h-4 w-4" />
                                  Availability Calendar
                                </h4>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const newMonth = subMonths(centreMonth, 1);
                                      const currentMonth = startOfMonth(new Date());
                                      const newMonthStart = startOfMonth(newMonth);
                                      // Only allow going back if the new month is current month or future
                                      if (isSameMonth(newMonthStart, currentMonth) || newMonthStart >= currentMonth) {
                                        setCentreMonth(centre.id, newMonth);
                                      }
                                    }}
                                    disabled={isSameMonth(startOfMonth(centreMonth), startOfMonth(new Date()))}
                                  >
                                    <ChevronLeft className="h-3 w-3" />
                                  </Button>
                                  <span className="text-xs font-medium min-w-[90px] text-center">
                                    {format(centreMonth, 'MMM yyyy')}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => {
                                      const newMonth = addMonths(centreMonth, 1);
                                      const oneMonthAhead = addMonths(new Date(), 1);
                                      if (isSameMonth(newMonth, oneMonthAhead) || newMonth < oneMonthAhead) {
                                        setCentreMonth(centre.id, newMonth);
                                      }
                                    }}
                                    disabled={isSameMonth(centreMonth, addMonths(new Date(), 1))}
                                  >
                                    <ChevronRight className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-7 gap-1 mb-1">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                  <div key={day} className="text-center text-[10px] font-semibold text-muted-foreground p-1">
                                    {day.substring(0, 1)}
                                  </div>
                                ))}
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {allCalendarDays.map((date) => {
                                  const iso = format(date, 'yyyy-MM-dd');
                                  const isCurrentMonth = isSameMonth(date, centreMonth);
                                  const dateStart = startOfDay(date);
                                  const todayStart = startOfDay(new Date());
                                  const isBeforeToday = isBefore(dateStart, todayStart);
                                  
                                  // Skip rendering past dates completely
                                  if (isBeforeToday) {
                                    return (
                                      <div key={iso} className="opacity-0 pointer-events-none" />
                                    );
                                  }
                                  
                                  const isPast = isPastDate(date);
                                  const event = getEventForDate(centre.id, date);
                                  const availableCount = getAvailableActivitiesCount(centre.id, iso);
                                  
                                  // Check weekly off days
                                  const isNotAvailable = centre.weeklyOffDays?.includes(format(date, 'EEEE')) || false;
                                  
                                  let tileClass = '';
                                  let statusContent = null;
                                  
                                  if (!isCurrentMonth) {
                                    tileClass = 'opacity-30';
                                  } else if (event) {
                                    const eventStatus = getEventStatus(event);
                                    if (eventStatus === 'guest_lecture') {
                                      tileClass = 'border-purple-500/40 bg-purple-500/10 cursor-pointer';
                                      statusContent = (
                                        <div className="space-y-0.5 text-[9px]">
                                          <div className="flex items-center gap-0.5 justify-center text-purple-700 dark:text-purple-400">
                                            <Users className="h-2 w-2" />
                                            <span>Lecture</span>
                                          </div>
                                        </div>
                                      );
                                    } else if (eventStatus === 'fully_booked') {
                                      tileClass = 'border-destructive/40 bg-destructive/5 cursor-pointer';
                                      statusContent = (
                                        <div className="flex items-center gap-0.5 justify-center text-destructive">
                                          <XCircle className="h-2 w-2" />
                                          <span className="text-[9px]">Full</span>
                                        </div>
                                      );
                                    } else if (eventStatus === 'partial_capacity') {
                                      tileClass = 'border-orange-500/40 bg-orange-500/10 cursor-pointer';
                                      statusContent = (
                                        <div className="flex items-center gap-0.5 justify-center text-orange-700 dark:text-orange-400">
                                          <Users className="h-2 w-2" />
                                          <span className="text-[9px]">Partial</span>
                                        </div>
                                      );
                                    } else if (eventStatus === 'partial_activities') {
                                      tileClass = 'border-blue-500/40 bg-blue-500/10 cursor-pointer';
                                      statusContent = (
                                        <div className="flex items-center gap-0.5 justify-center text-blue-700 dark:text-blue-400">
                                          <span className="text-[9px]">Activities</span>
                                        </div>
                                      );
                                    } else {
                                      tileClass = 'border-destructive/40 bg-destructive/5 cursor-pointer';
                                      statusContent = (
                                        <div className="flex items-center gap-0.5 justify-center text-destructive">
                                          <XCircle className="h-2 w-2" />
                                          <span className="text-[9px]">Booked</span>
                                        </div>
                                      );
                                    }
                                  } else if (isNotAvailable || isPast || availableCount === 0) {
                                    tileClass = 'border-muted bg-muted/50 opacity-60';
                                    statusContent = (
                                      <div className="flex items-center gap-1 justify-center text-muted-foreground">
                                        <XCircle className="h-2 w-2" />
                                      </div>
                                    );
                                  } else {
                                    tileClass = 'border-primary/30 bg-primary/5 cursor-pointer hover:border-primary/50 hover:bg-primary/10';
                                    statusContent = (
                                      <div className="flex items-center gap-0.5 justify-center text-primary">
                                        <CheckCircle2 className="h-2 w-2" />
                                        <span className="text-[9px]">Free</span>
                                      </div>
                                    );
                                  }
                                  
                                  const handleDateClick = () => {
                                    if (!isCurrentMonth || isNotAvailable || isBeforeToday || availableCount === 0) {
                                      return;
                                    }
                                    // Navigate to activities page with date selected
                                    navigate(`/bookings/${centre.id}?date=${iso}`);
                                  };
                                  
                                  return (
                                    <div
                                      key={iso}
                                      onClick={handleDateClick}
                                      className={`rounded border p-1 text-xs ${tileClass} transition-colors ${isBeforeToday ? 'opacity-0 pointer-events-none' : ''}`}
                                    >
                                      <div className="text-center font-bold mb-0.5">{date.getDate()}</div>
                                      {statusContent}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      
                      {centre.openingTime && centre.closingTime && (
                        <p className="text-xs text-muted-foreground">
                          Open: {centre.openingTime} - {centre.closingTime}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <Link to={`/bookings/${centre.id}`} className="w-full">
                        <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                          View Activities & Book
                        </button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {filteredCentres.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No eco centres found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Bookings;

