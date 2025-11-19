import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Users, Phone, Mountain, Hospital, Calendar as CalendarIcon, CheckCircle2, XCircle, ExternalLink, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapPanel from '@/components/MapPanel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { mockEcoCentres, mockEvents, mockLecturers } from '@/lib/mockData';
import type { Lecturer } from '@/lib/mockData';
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
  const lecturerMap = useMemo<Record<string, Lecturer>>(
    () => Object.fromEntries(mockLecturers.map(lecturer => [lecturer.id, lecturer] as const)),
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
  // For demo purposes, marking some specific dates as not available
  const notAvailableDates = new Set([
    // Mark some dates 3, 7, 12, 18 days from today as not available
    new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    new Date(today.getTime() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  ]);
  
  // Generate additional demo booked events for dates that don't have events yet
  // These will show as booked in the calendar
  const bookedDates = new Set(centreEvents.map(evt => evt.date));
  const demoBookedDates = [2, 5, 9, 14, 19]; // Days from today to mark as booked
  
  const demoEvents = demoBookedDates
    .map(dayOffset => {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const iso = date.toISOString().split('T')[0];
      // Only create demo event if date doesn't already have an event and is not marked as unavailable
      if (!bookedDates.has(iso) && !notAvailableDates.has(iso)) {
        return {
          id: `demo-${iso}`,
          date: iso,
          lecturerIds: dayOffset % 2 === 0 ? ['lec1', 'lec2'] : ['lec3', 'lec4'],
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{ id: string; date: string; lecturerIds: string[] }>;
  
  const calendarDays = Array.from({ length: 21 }, (_, idx) => {
    const date = new Date(today);
    date.setDate(today.getDate() + idx);
    const iso = date.toISOString().split('T')[0];
    const event = centreEvents.find(evt => evt.date === iso);
    const demoEvent = demoEvents.find(evt => evt.date === iso);
    const isNotAvailable = notAvailableDates.has(iso);
    // Use real event if available, otherwise use demo event
    const finalEvent = event || (demoEvent ? {
      id: demoEvent.id,
      lecturerIds: demoEvent.lecturerIds,
    } : undefined);
    return { date, iso, event: finalEvent, isNotAvailable };
  });

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
                  <h2 className="text-2xl font-semibold">Features & Activities</h2>
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
                  <div className="flex items-center gap-2 text-primary">
                    <CalendarIcon className="h-5 w-5" />
                    <h2 className="text-2xl font-semibold text-foreground">Activity Calendar</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Next 3 weeks of availability, synced with school bookings and lecturer assignments.
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-destructive/70" />
                      Booked
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    {calendarDays.map(({ date, iso, event, isNotAvailable }) => {
                      let tileClass = '';
                      let statusContent = null;
                      
                      if (event) {
                        // Booked state
                        tileClass = 'border-destructive/40 bg-destructive/5';
                        statusContent = (
                          <div className="space-y-1 text-[11px]">
                            <div className="flex items-center gap-1 text-destructive">
                              <XCircle className="h-3.5 w-3.5" />
                              Booked
                            </div>
                            <p className="text-[10px] text-muted-foreground">Lecturers:</p>
                            <ul className="text-[10px] space-y-0.5">
                              {event.lecturerIds.map(lecturerId => (
                                <li key={lecturerId}>
                                  {lecturerMap[lecturerId]?.name ?? 'TBD'}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      } else if (isNotAvailable) {
                        // Not available state
                        tileClass = 'border-muted bg-muted/50 opacity-60';
                        statusContent = (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <XCircle className="h-3.5 w-3.5" />
                            <span className="text-[11px]">Not Available</span>
                          </div>
                        );
                      } else {
                        // Available state
                        tileClass = 'border-primary/30 bg-primary/5';
                        statusContent = (
                          <div className="flex items-center gap-1 text-primary">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span className="text-[11px]">Available</span>
                          </div>
                        );
                      }
                      
                      return (
                        <div
                          key={iso}
                          className={`rounded-2xl border p-3 space-y-1.5 text-sm ${tileClass}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">{date.getDate()}</span>
                            <span className="text-[10px] uppercase text-muted-foreground">
                              {date.toLocaleDateString('en-IN', { month: 'short' })}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                          </p>
                          {statusContent}
                        </div>
                      );
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
                  Register Your School
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

      <Footer />
    </div>
  );
};

export default EcoCentreDetail;
