import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Users, Phone, Mountain, Hospital, Calendar as CalendarIcon, CheckCircle2, XCircle, ExternalLink, Globe, Clock, IndianRupee, Package, Home, Bed, ChevronLeft, ChevronRight, Image as ImageIcon, Video, BookOpen } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapPanel from '@/components/MapPanel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { mockEcoCentres, mockEvents, mockLecturers, mockSchools } from '@/lib/mockData';
import type { Lecturer, Event } from '@/lib/mockData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, differenceInDays } from 'date-fns';
import seminaryHillsImg from '@/assets/seminary-hills-1.jpg';
import nagarholeImg from '@/assets/nagarhole.jpg';
import dandeliImg from '@/assets/dandeli.jpg';
import welcomeAboutImg from '@/assets/welcome-about.jpg';
import gorewada1Img from '@/assets/gorewada1.jpg';
import gorewada2Img from '@/assets/gorewada2.jpg';
import gorewada3Img from '@/assets/gorewada3.jpg';
import gorewada4Img from '@/assets/gorewada4.jpg';

const imageMap: Record<string, string> = {
  'seminary-hills-1.jpg': seminaryHillsImg,
  'nagarhole': nagarholeImg,
  'dandeli': dandeliImg,
  'welcome-about.jpg': welcomeAboutImg,
  'gorewada1.jpg': gorewada1Img,
  'gorewada2.jpg': gorewada2Img,
  'gorewada3.jpg': gorewada3Img,
  'gorewada4.jpg': gorewada4Img,
};

const EcoCentreDetail = () => {
  const { id } = useParams();
  const centre = mockEcoCentres.find(c => c.id === id);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState(false);
  const [expandedRooms, setExpandedRooms] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [selectedPhotoTitle, setSelectedPhotoTitle] = useState<string>('');
  
  const lecturerMap = useMemo<Record<string, Lecturer>>(
    () => Object.fromEntries(mockLecturers.map(lecturer => [lecturer.id, lecturer] as const)),
    []
  );
  
  const schoolMap = useMemo<Record<string, string>>(
    () => Object.fromEntries(mockSchools.map(school => [school.id, school.name] as const)),
    []
  );

  if (!centre) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Eco Centre Not Found</h1>
            <Link to="/eco-centres">
              <Button>Back to Directory</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'Moderate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'Difficult': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-muted';
    }
  };

  const imageSrc = centre.images[0] ? imageMap[centre.images[0]] : undefined;
  const availableImages = centre.images
    .map(img => imageMap[img])
    .filter(Boolean) as string[];
  const hasMultipleImages = availableImages.length > 1;
  const centreEvents = mockEvents.filter(event => event.ecoCentreId === centre.id);
  const today = new Date();
  
  // Define some dates as not available (e.g., maintenance days, holidays, etc.)
  const notAvailableDates = new Set([
    format(addMonths(today, 1), 'yyyy-MM-dd'),
    format(addMonths(today, 1).setDate(7), 'yyyy-MM-dd'),
  ]);
  
  // Calendar month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get event for a specific date
  const getEventForDate = (date: Date) => {
    const iso = format(date, 'yyyy-MM-dd');
    return centreEvents.find(evt => evt.date === iso);
  };
  
  // Check if date is in the past
  const isPastDate = (date: Date) => {
    return differenceInDays(today, date) > 0;
  };
  
  // Check if date is in the future
  const isFutureDate = (date: Date) => {
    return differenceInDays(date, today) > 0;
  };
  
  // Calculate available seats for future events
  const getAvailableSeats = (event: Event) => {
    if (event.eventType === 'guest_lecture' && event.availableSeats !== undefined) {
      return event.availableSeats;
    }
    return Math.max(0, centre.capacity - event.students_count);
  };
  
  // Get event status for display
  const getEventStatus = (event: Event) => {
    if (event.eventType === 'guest_lecture') {
      return 'guest_lecture';
    }
    if (event.isFullyBooked) {
      return 'fully_booked';
    }
    if (event.isPartiallyBooked && event.bookedActivities && event.bookedActivities.length > 0) {
      return 'partial_activities';
    }
    if (event.isPartiallyBooked) {
      return 'partial_capacity';
    }
    return 'booked';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/eco-centres">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </Link>

          {/* Hero Image / Carousel */}
          {hasMultipleImages ? (
            <Carousel className="w-full mb-8 relative">
              <CarouselContent>
                {availableImages.map((img, index) => (
                  <CarouselItem key={index}>
                    <div 
                      className="h-96 rounded-xl overflow-hidden shadow-medium bg-cover bg-center"
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
          ) : (
            <div 
              className="h-96 rounded-xl mb-8 overflow-hidden shadow-medium bg-cover bg-center"
              style={imageSrc ? { backgroundImage: `url(${imageSrc})` } : undefined}
            >
              {!imageSrc && <div className="w-full h-full bg-gradient-forest" />}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-4xl font-bold">{centre.name}</h1>
                  <Badge className={getDifficultyColor(centre.trailDifficulty)}>
                    <Mountain className="h-3 w-3 mr-1" />
                    {centre.trailDifficulty}
                  </Badge>
                </div>
                
                <div className="flex items-start gap-2 text-muted-foreground mb-6">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span className="text-lg">{centre.location.address}</span>
                </div>
              </div>

              <Card className="shadow-soft">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">About This Centre</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {centre.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Features</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {centre.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Map Section */}
              <Card className="shadow-soft">
                <CardHeader>
                  <h2 className="text-2xl font-semibold">Location & Facilities</h2>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <MapPanel ecoCentre={centre} />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Users className="h-4 w-4 text-primary" />
                        Maximum Capacity
                      </div>
                      <p className="text-2xl font-bold">{centre.capacity} students</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Mountain className="h-4 w-4 text-primary" />
                        Trail Difficulty
                      </div>
                      <p className="text-2xl font-bold">{centre.trailDifficulty}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                      <CalendarIcon className="h-5 w-5" />
                      <h2 className="text-2xl font-semibold text-foreground">Activity Calendar</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        disabled={isSameMonth(currentMonth, subMonths(new Date(), 2))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium min-w-[120px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        disabled={isSameMonth(currentMonth, addMonths(new Date(), 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-destructive/70" />
                      Fully Booked
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500/70" />
                      Partially Booked
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500/70" />
                      Guest Lecture
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500/70" />
                      Partial Activities
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-primary/70" />
                      Available
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-muted" />
                      Not Available
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-semibold text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date) => {
                      const iso = format(date, 'yyyy-MM-dd');
                      const event = getEventForDate(date);
                      const isNotAvailable = notAvailableDates.has(iso);
                      const isPast = isPastDate(date);
                      const isFuture = isFutureDate(date);
                      const isCurrentMonth = isSameMonth(date, currentMonth);
                      
                      let tileClass = '';
                      let statusContent = null;
                      
                      if (!isCurrentMonth) {
                        tileClass = 'opacity-30';
                      } else if (event) {
                        const eventStatus = getEventStatus(event);
                        if (eventStatus === 'guest_lecture') {
                          tileClass = 'border-purple-500/40 bg-purple-500/10 cursor-pointer';
                          statusContent = (
                            <div className="space-y-1 text-[10px]">
                              <div className="flex items-center gap-1 text-purple-700 dark:text-purple-400">
                                <Users className="h-3 w-3" />
                                <span>Guest Lecture</span>
                              </div>
                              {event.availableSeats !== undefined && (
                                <div className="text-[9px] text-purple-600 dark:text-purple-300">
                                  {event.availableSeats} seats
                                </div>
                              )}
                            </div>
                          );
                        } else if (eventStatus === 'fully_booked') {
                          tileClass = 'border-destructive/40 bg-destructive/5 cursor-pointer';
                          statusContent = (
                            <div className="space-y-1 text-[10px]">
                              <div className="flex items-center gap-1 text-destructive">
                                <XCircle className="h-3 w-3" />
                                <span>Full</span>
                              </div>
                            </div>
                          );
                        } else if (eventStatus === 'partial_capacity') {
                          tileClass = 'border-orange-500/40 bg-orange-500/10 cursor-pointer';
                          statusContent = (
                            <div className="space-y-1 text-[10px]">
                              <div className="flex items-center gap-1 text-orange-700 dark:text-orange-400">
                                <Users className="h-3 w-3" />
                                <span>Partial</span>
                              </div>
                              <div className="text-[9px] text-orange-600 dark:text-orange-300">
                                {getAvailableSeats(event)} free
                              </div>
                            </div>
                          );
                        } else if (eventStatus === 'partial_activities') {
                          tileClass = 'border-blue-500/40 bg-blue-500/10 cursor-pointer';
                          statusContent = (
                            <div className="space-y-1 text-[10px]">
                              <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400">
                                <Package className="h-3 w-3" />
                                <span>Activities</span>
                              </div>
                              <div className="text-[9px] text-blue-600 dark:text-blue-300">
                                Partial
                              </div>
                            </div>
                          );
                        } else {
                          tileClass = 'border-destructive/40 bg-destructive/5 cursor-pointer';
                          statusContent = (
                            <div className="space-y-1 text-[10px]">
                              <div className="flex items-center gap-1 text-destructive">
                                <XCircle className="h-3 w-3" />
                                <span>Booked</span>
                              </div>
                            </div>
                          );
                        }
                      } else if (isNotAvailable) {
                        tileClass = 'border-muted bg-muted/50 opacity-60';
                        statusContent = (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <XCircle className="h-3 w-3" />
                            <span className="text-[10px]">N/A</span>
                          </div>
                        );
                      } else {
                        tileClass = 'border-primary/30 bg-primary/5';
                        statusContent = (
                          <div className="flex items-center gap-1 text-primary">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="text-[10px]">Free</span>
                          </div>
                        );
                      }
                      
                      const tile = (
                        <div
                          className={`rounded-lg border p-2 text-sm ${tileClass} ${event ? 'hover:bg-destructive/10' : ''}`}
                          onClick={() => {
                            if (event) {
                              setSelectedEvent(event);
                              setEventDialogOpen(true);
                            }
                          }}
                        >
                          <div className="text-center font-bold mb-1">{date.getDate()}</div>
                          {statusContent}
                        </div>
                      );
                      
                      if (event && (isPast || isFuture)) {
                        // Get thumbnail from event photos, mapping image names to actual image paths
                        let eventThumbnail: string | undefined = undefined;
                        if (event.photos && event.photos.length > 0) {
                          const photoName = event.photos[0];
                          eventThumbnail = imageMap[photoName] || (imageSrc || undefined);
                        } else {
                          eventThumbnail = imageSrc || undefined;
                        }
                        const eventStatus = getEventStatus(event);
                        const isGuestLecture = event.eventType === 'guest_lecture';
                        const availableSeats = getAvailableSeats(event);
                        
                        return (
                          <TooltipProvider key={iso}>
                            <Tooltip delayDuration={200}>
                              <TooltipTrigger asChild>
                                {tile}
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm p-4" side="top">
                                <div className="space-y-2">
                                  {eventThumbnail && (
                                    <img src={eventThumbnail} alt="Event" className="w-full h-32 object-cover rounded" />
                                  )}
                                  <div>
                                    {isGuestLecture ? (
                                      <>
                                        <p className="font-semibold text-purple-700 dark:text-purple-400">Guest Lecture</p>
                                        <p className="text-xs text-muted-foreground">{format(parseISO(event.date), 'PPP')}</p>
                                        <p className="text-xs mt-1 font-medium">Available Seats: {availableSeats}</p>
                                      </>
                                    ) : (
                                      <>
                                        <p className="font-semibold">{schoolMap[event.schoolId] || 'School Event'}</p>
                                        <p className="text-xs text-muted-foreground">{format(parseISO(event.date), 'PPP')}</p>
                                        <p className="text-xs mt-1">Students: {event.students_count}</p>
                                        {eventStatus === 'fully_booked' && (
                                          <p className="text-xs text-destructive font-medium mt-1">Fully Booked</p>
                                        )}
                                        {eventStatus === 'partial_capacity' && (
                                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                                            Partially Booked - {availableSeats} seats available
                                          </p>
                                        )}
                                        {eventStatus === 'partial_activities' && event.bookedActivities && (
                                          <div className="mt-1">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Partial Activity Booking</p>
                                            <p className="text-xs text-muted-foreground mt-1">Booked Activities:</p>
                                            <ul className="text-xs text-muted-foreground">
                                              {event.bookedActivities.map(activityId => {
                                                const activity = centre.activities?.find(a => a.id === activityId);
                                                return activity ? (
                                                  <li key={activityId}>• {activity.name}</li>
                                                ) : null;
                                              })}
                                            </ul>
                                          </div>
                                        )}
                                      </>
                                    )}
                                    {event.lecturerIds.length > 0 && (
                                      <div className="mt-1">
                                        <p className="text-xs font-medium">Lecturers:</p>
                                        <ul className="text-xs text-muted-foreground">
                                          {event.lecturerIds.map(lecturerId => (
                                            <li key={lecturerId}>• {lecturerMap[lecturerId]?.name || 'TBD'}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {isFuture && availableSeats > 0 && (
                                      <div className="mt-2 pt-2 border-t">
                                        <p className="text-xs font-medium">Available Seats: {availableSeats}</p>
                                        <Button
                                          size="sm"
                                          className="mt-2 w-full text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEventDialogOpen(false);
                                            // Navigate to bookings page for this eco centre with date
                                            window.location.href = `/bookings/${centre.id}?date=${event.date}`;
                                          }}
                                        >
                                          <BookOpen className="h-3 w-3 mr-1" />
                                          Book Activity
                                        </Button>
                                      </div>
                                    )}
                                    {isPast && event.feedbackSummary && (
                                      <p className="text-xs mt-2 italic text-muted-foreground">"{event.feedbackSummary}"</p>
                                    )}
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      }
                      
                      return <div key={iso}>{tile}</div>;
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <Card className="shadow-soft border-destructive/20">
                <CardHeader className="bg-destructive/5">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Hospital className="h-5 w-5 text-destructive" />
                    Emergency Support
                  </h3>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nearest Hospital</p>
                      <p className="font-semibold">{centre.nearestHospital.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Distance</p>
                      <p className="font-semibold">{centre.nearestHospital.distance_km} km away</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Emergency Contact</p>
                      <a 
                        href={`tel:${centre.nearestHospital.phone}`}
                        className="font-semibold text-primary hover:underline flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        {centre.nearestHospital.phone}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-soft">
                <CardContent className="pt-6 space-y-3">
              <Link to="/school/register" className="block">
                <Button variant="forest" className="w-full">
                  Send Enquiry
                </Button>
              </Link>
                  <Link to="/contact" className="block">
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Safety Note */}
              <Card className="shadow-soft bg-muted/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Safety First</h4>
                  <p className="text-sm text-muted-foreground">
                    All visits are supervised by trained forest officers and NGO coordinators. 
                    Emergency protocols and first aid facilities are in place.
                  </p>
                </CardContent>
              </Card>

              {/* Official Website */}
              {centre.officialWebsiteUrl && (
                <Card className="shadow-soft">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Official Website</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Visit the official website for more information about this eco centre.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(centre.officialWebsiteUrl, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Official Website
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Compact Activities, Package & Overnight Stay */}
              <Card className="shadow-soft">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold">Activities & Packages</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Activities Summary */}
                  {centre.activities && centre.activities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Activities ({centre.activities.length})</h4>
                      <div className="space-y-1.5 max-h-64 overflow-y-auto">
                        {(expandedActivities ? centre.activities : centre.activities.slice(0, 3)).map((activity) => {
                          const activityPhotos = activity.photos && activity.photos.length > 0 
                            ? activity.photos.map(photo => imageMap[photo]).filter(Boolean) as string[]
                            : (imageSrc ? [imageSrc] : []);
                          const activityPhoto = activityPhotos.length > 0 ? activityPhotos[0] : undefined;
                          
                          const handleActivityClick = () => {
                            if (activityPhotos.length > 0) {
                              setSelectedPhotos(activityPhotos);
                              setSelectedPhotoTitle(activity.name);
                              setPhotoDialogOpen(true);
                            }
                          };
                          
                          const activityItem = (
                            <div 
                              className="text-xs flex items-center justify-between p-1.5 bg-muted/30 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                              onClick={handleActivityClick}
                            >
                              <span className="truncate flex-1">{activity.name}</span>
                              <span className="text-primary font-medium ml-2">
                                <IndianRupee className="h-3 w-3 inline" />
                                {activity.cost}
                              </span>
                            </div>
                          );

                          if (activityPhoto) {
                            return (
                              <TooltipProvider key={activity.id}>
                                <Tooltip delayDuration={300}>
                                  <TooltipTrigger asChild>
                                    {activityItem}
                                  </TooltipTrigger>
                                  <TooltipContent className="p-2" side="right">
                                    <div className="space-y-2">
                                      <img 
                                        src={activityPhoto} 
                                        alt={activity.name}
                                        className="w-32 h-24 object-cover rounded cursor-pointer"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleActivityClick();
                                        }}
                                      />
                                      <div>
                                        <p className="text-xs font-semibold">{activity.name}</p>
                                        {activity.description && (
                                          <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                          <Clock className="h-3 w-3" />
                                          <span>{activity.estimatedTime}</span>
                                          <span className="text-primary font-medium">
                                            <IndianRupee className="h-3 w-3 inline" />
                                            {activity.cost}
                                          </span>
                                        </div>
                                        {activityPhotos.length > 1 && (
                                          <p className="text-xs text-primary mt-1 cursor-pointer hover:underline" onClick={(e) => {
                                            e.stopPropagation();
                                            handleActivityClick();
                                          }}>
                                            Click to view {activityPhotos.length} photos
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          }
                          return activityItem;
                        })}
                        {centre.activities.length > 3 && (
                          <button
                            onClick={() => setExpandedActivities(!expandedActivities)}
                            className="text-xs text-primary hover:text-primary/80 font-medium text-center w-full py-1 hover:underline transition-colors"
                          >
                            {expandedActivities 
                              ? `Show less` 
                              : `+${centre.activities.length - 3} more`}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Whole Day Package */}
                  {centre.wholeDayPackage && (
                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Whole Day Package</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{centre.wholeDayPackage.name}</p>
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <IndianRupee className="h-3 w-3" />
                        <span>{centre.wholeDayPackage.cost.toLocaleString('en-IN')}/student</span>
                      </div>
                    </div>
                  )}

                  {/* Overnight Stay */}
                  {centre.overnightStay && (
                    <div className="border-t pt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Home className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-medium">Overnight Stay</h4>
                      </div>
                      {centre.overnightStay.available ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Available</span>
                          </div>
                          {centre.overnightStay.rooms && centre.overnightStay.rooms.length > 0 && (
                            <div className="text-xs space-y-1">
                              {(expandedRooms ? centre.overnightStay.rooms : centre.overnightStay.rooms.slice(0, 2)).map((room) => {
                                const roomPhotos = room.photos && room.photos.length > 0 
                                  ? room.photos.map(photo => imageMap[photo]).filter(Boolean) as string[]
                                  : (imageSrc ? [imageSrc] : []);
                                const roomPhoto = roomPhotos.length > 0 ? roomPhotos[0] : undefined;
                                
                                const handleRoomClick = () => {
                                  if (roomPhotos.length > 0) {
                                    setSelectedPhotos(roomPhotos);
                                    setSelectedPhotoTitle(room.type);
                                    setPhotoDialogOpen(true);
                                  }
                                };
                                
                                const roomItem = (
                                  <div 
                                    className="flex items-center justify-between p-1 bg-muted/30 rounded hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={handleRoomClick}
                                  >
                                    <span className="truncate">{room.type}</span>
                                    <span className="text-primary font-medium ml-2">
                                      <IndianRupee className="h-3 w-3 inline" />
                                      {room.rent}/night
                                    </span>
                                  </div>
                                );

                                if (roomPhoto) {
                                  return (
                                    <TooltipProvider key={room.id}>
                                      <Tooltip delayDuration={300}>
                                        <TooltipTrigger asChild>
                                          {roomItem}
                                        </TooltipTrigger>
                                        <TooltipContent className="p-2" side="right">
                                          <div className="space-y-2">
                                            <img 
                                              src={roomPhoto} 
                                              alt={room.type}
                                              className="w-32 h-24 object-cover rounded cursor-pointer"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRoomClick();
                                              }}
                                            />
                                            <div>
                                              <p className="text-xs font-semibold">{room.type}</p>
                                              {room.description && (
                                                <p className="text-xs text-muted-foreground mt-1">{room.description}</p>
                                              )}
                                              <div className="flex items-center gap-2 mt-1 text-xs">
                                                <Users className="h-3 w-3" />
                                                <span>Capacity: {room.capacity} people</span>
                                                <span className="text-primary font-medium">
                                                  <IndianRupee className="h-3 w-3 inline" />
                                                  {room.rent}/night
                                                </span>
                                              </div>
                                              {roomPhotos.length > 1 && (
                                                <p className="text-xs text-primary mt-1 cursor-pointer hover:underline" onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleRoomClick();
                                                }}>
                                                  Click to view {roomPhotos.length} photos
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  );
                                }
                                return roomItem;
                              })}
                              {centre.overnightStay.rooms.length > 2 && (
                                <button
                                  onClick={() => setExpandedRooms(!expandedRooms)}
                                  className="text-xs text-primary hover:text-primary/80 font-medium text-center w-full py-1 hover:underline transition-colors"
                                >
                                  {expandedRooms 
                                    ? `Show less` 
                                    : `+${centre.overnightStay.rooms.length - 2} more`}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <XCircle className="h-3 w-3" />
                          <span>Not Available</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* YouTube Videos */}
              {centre.youtubeVideoUrl && centre.youtubeVideoUrl.filter(url => url && url.trim() !== '').length > 0 && (
                <Card className="shadow-soft">
                  <CardHeader>
                    <h3 className="text-lg font-semibold">Videos</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {centre.youtubeVideoUrl
                      .filter(url => url && url.trim() !== '')
                      .map((url, index) => {
                        // Convert YouTube URL to embed format
                        const getEmbedUrl = (youtubeUrl: string) => {
                          // Handle various YouTube URL formats
                          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                          const match = youtubeUrl.match(regExp);
                          const videoId = match && match[2].length === 11 ? match[2] : null;
                          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
                        };

                        const embedUrl = getEmbedUrl(url);
                        if (!embedUrl) return null;

                        return (
                          <div key={index} className="w-full">
                            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src={embedUrl}
                                title={`${centre.name} Video ${index + 1}`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        );
                      })}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Event Details Dialog */}
      <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedEvent.eventType === 'guest_lecture' 
                    ? 'Guest Lecture' 
                    : (schoolMap[selectedEvent.schoolId || ''] || 'Event Details')}
                </DialogTitle>
                <DialogDescription>
                  {format(parseISO(selectedEvent.date), 'PPPP')} • {selectedEvent.code}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Event Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Event Information</h4>
                    <div className="space-y-1 text-sm">
                      {selectedEvent.eventType === 'guest_lecture' ? (
                        <>
                          <p><span className="font-medium">Event Type:</span> <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">Guest Lecture</Badge></p>
                          <p><span className="font-medium">Available Seats:</span> {getAvailableSeats(selectedEvent)}</p>
                          <p><span className="font-medium">Status:</span> <Badge>{selectedEvent.status}</Badge></p>
                        </>
                      ) : (
                        <>
                          <p><span className="font-medium">Students:</span> {selectedEvent.students_count}</p>
                          <p><span className="font-medium">Consent Forms:</span> {selectedEvent.consentFormsSubmitted || 0}</p>
                          <p><span className="font-medium">Status:</span> <Badge>{selectedEvent.status}</Badge></p>
                          {selectedEvent.isFullyBooked && (
                            <p><span className="font-medium text-destructive">Status:</span> <Badge variant="destructive">Fully Booked</Badge></p>
                          )}
                          {selectedEvent.isPartiallyBooked && !selectedEvent.bookedActivities && (
                            <p><span className="font-medium text-orange-600">Status:</span> <Badge variant="outline" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">Partially Booked</Badge></p>
                          )}
                          {selectedEvent.bookedActivities && selectedEvent.bookedActivities.length > 0 && (
                            <p><span className="font-medium text-blue-600">Status:</span> <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Partial Activities</Badge></p>
                          )}
                          {isFutureDate(parseISO(selectedEvent.date)) && (
                            <p><span className="font-medium">Available Seats:</span> {getAvailableSeats(selectedEvent)}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {selectedEvent.lecturerIds.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Assigned Lecturers</h4>
                      <ul className="space-y-1 text-sm">
                        {selectedEvent.lecturerIds.map(lecturerId => (
                          <li key={lecturerId} className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            {lecturerMap[lecturerId]?.name || 'TBD'}
                            {lecturerMap[lecturerId]?.expertise && (
                              <span className="text-xs text-muted-foreground">({lecturerMap[lecturerId].expertise})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Booked Activities (for partial activity bookings) */}
                {selectedEvent.bookedActivities && selectedEvent.bookedActivities.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Booked Activities</h4>
                    <div className="space-y-2">
                      {selectedEvent.bookedActivities.map(activityId => {
                        const activity = centre.activities?.find(a => a.id === activityId);
                        return activity ? (
                          <div key={activityId} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-950 rounded">
                            <div>
                              <p className="text-sm font-medium">{activity.name}</p>
                              <p className="text-xs text-muted-foreground">{activity.estimatedTime}</p>
                            </div>
                            <span className="text-sm font-semibold text-primary">
                              <IndianRupee className="h-3 w-3 inline" />
                              {activity.cost}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Other activities are still available for booking.
                    </p>
                  </div>
                )}

                {/* Photos */}
                {selectedEvent.photos && selectedEvent.photos.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Event Photos
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedEvent.photos.map((photo, index) => {
                        // Map photo name to actual image path
                        const photoSrc = imageMap[photo] || photo;
                        return (
                          <img
                            key={index}
                            src={photoSrc}
                            alt={`Event photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Videos - Show if no photos or always show related videos */}
                {centre.youtubeVideoUrl && centre.youtubeVideoUrl.filter(url => url && url.trim() !== '').length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Related Videos
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {centre.youtubeVideoUrl
                        .filter(url => url && url.trim() !== '')
                        .map((url, index) => {
                          const getEmbedUrl = (youtubeUrl: string) => {
                            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                            const match = youtubeUrl.match(regExp);
                            const videoId = match && match[2].length === 11 ? match[2] : null;
                            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
                          };
                          const embedUrl = getEmbedUrl(url);
                          if (!embedUrl) return null;
                          return (
                            <div key={index} className="w-full">
                              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                <iframe
                                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                                  src={embedUrl}
                                  title={`${centre.name} Video ${index + 1}`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {selectedEvent.feedbackSummary && (
                  <div>
                    <h4 className="font-semibold mb-2">Feedback</h4>
                    <p className="text-sm text-muted-foreground italic">"{selectedEvent.feedbackSummary}"</p>
                  </div>
                )}

                {/* Booking Button for Future Events */}
                {isFutureDate(parseISO(selectedEvent.date)) && getAvailableSeats(selectedEvent) > 0 && (
                  <div className="pt-4 border-t">
                    <Button className="w-full" onClick={() => {
                      setEventDialogOpen(false);
                      // Navigate to bookings page for this eco centre with date
                      window.location.href = `/bookings/${centre.id}?date=${selectedEvent.date}`;
                    }}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Book Activity ({getAvailableSeats(selectedEvent)} seats available)
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Gallery Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPhotoTitle}</DialogTitle>
            <DialogDescription>
              {selectedPhotos.length} photo{selectedPhotos.length !== 1 ? 's' : ''} available
            </DialogDescription>
          </DialogHeader>
          
          {selectedPhotos.length > 0 && (
            <div className="mt-4">
              {selectedPhotos.length === 1 ? (
                <div className="flex justify-center">
                  <img 
                    src={selectedPhotos[0]} 
                    alt={selectedPhotoTitle}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              ) : (
                <Carousel className="w-full">
                  <CarouselContent>
                    {selectedPhotos.map((photo, index) => (
                      <CarouselItem key={index}>
                        <div className="flex justify-center">
                          <img 
                            src={photo} 
                            alt={`${selectedPhotoTitle} - Photo ${index + 1}`}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              )}
              {selectedPhotos.length > 1 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Use arrow buttons to navigate through photos
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EcoCentreDetail;
