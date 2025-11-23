import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  CheckCircle, XCircle, Download, Plus, Edit, Trash2, Users, Building, GraduationCap, 
  FileText, Calendar, MapPin, Phone, Mail, User, Clock, FileCheck, AlertCircle,
  Navigation, Car, Hospital, Fuel, IndianRupee, Search, Filter, TrendingUp,
  Package, Activity, Ticket, BarChart3, Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  mockEvents, mockSchools, mockEcoCentres, mockCoordinators, mockLecturers, mockBusDrivers,
  mockBookings, mockBookingActivities,
  updateBookingStatus, updateBookingPaymentStatus, deleteBooking
} from "@/lib/mockData";
import type { Event, Coordinator, BusDriver, Teacher } from "@/lib/mockData";
import EcoCentreBookingsAdmin from "@/pages/admin/EcoCentreBookingsAdmin";
import MapPanel from "@/components/MapPanel";
import { format, differenceInDays, parseISO } from "date-fns";

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'events');
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const { toast } = useToast();

  // Sync URL parameter with tab state
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // Calculate days remaining for each event
  const eventsWithDaysRemaining = useMemo(() => {
    return events.map(event => {
      const eventDate = parseISO(event.date);
      const today = new Date();
      const daysRemaining = differenceInDays(eventDate, today);
      return { ...event, daysRemaining };
    });
  }, [events]);

  const approvedEvents = eventsWithDaysRemaining.filter(e => e.status === 'approved');
  const pendingEvents = events.filter(e => e.status === 'pending');
  const completedEvents = events.filter(e => e.status === 'completed');

  const handleApproveEvent = (eventId: string) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, status: 'approved' as const } : e));
    toast({
      title: "Event Approved",
      description: "The event has been approved and is now active.",
    });
  };

  const handleRejectEvent = (eventId: string) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, status: 'rejected' as const } : e));
    toast({
      title: "Event Rejected",
      description: "The event has been rejected.",
      variant: "destructive",
    });
  };

  const handleAssignCoordinator = (eventId: string, coordinatorId: string) => {
    setEvents(events.map(e => {
      if (e.id === eventId) {
        const coordinators = e.assignedCoordinators.includes(coordinatorId)
          ? e.assignedCoordinators.filter(id => id !== coordinatorId)
          : [...e.assignedCoordinators, coordinatorId];
        return { ...e, assignedCoordinators: coordinators };
      }
      return e;
    }));
    toast({
      title: "Coordinator Updated",
      description: "Coordinator assignment has been updated.",
    });
  };

  const handleAssignDriver = (eventId: string, driverId: string) => {
    setEvents(events.map(e => e.id === eventId ? { ...e, assignedDriverId: driverId } : e));
    toast({
      title: "Driver Assigned",
      description: "Bus driver has been assigned to the event.",
    });
  };

  const openEventDetail = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailOpen(true);
  };

  const getEventSchool = (schoolId: string) => mockSchools.find(s => s.id === schoolId);
  const getEventEcoCentre = (ecoCentreId: string) => mockEcoCentres.find(e => e.id === ecoCentreId);
  const getCoordinator = (coordId: string) => mockCoordinators.find(c => c.id === coordId);
  const getDriver = (driverId?: string) => driverId ? mockBusDrivers.find(d => d.id === driverId) : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-forest mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage the Child Education Program</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest">{events.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest">{approvedEvents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{pendingEvents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires action</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-forest">{completedEvents.length}</div>
              <p className="text-xs text-muted-foreground mt-1">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="events"><Calendar className="w-4 h-4 mr-2" />Events</TabsTrigger>
            <TabsTrigger value="bookings"><Ticket className="w-4 h-4 mr-2" />Eco Centre Bookings</TabsTrigger>
            <TabsTrigger value="schools"><Users className="w-4 h-4 mr-2" />Schools</TabsTrigger>
            <TabsTrigger value="coordinators"><User className="w-4 h-4 mr-2" />Coordinators</TabsTrigger>
            <TabsTrigger value="drivers"><Car className="w-4 h-4 mr-2" />Drivers</TabsTrigger>
            <TabsTrigger value="reports"><FileText className="w-4 h-4 mr-2" />Reports</TabsTrigger>
          </TabsList>

          {/* Events Management */}
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>Manage all school events and assignments</CardDescription>
                  </div>
                  <Button onClick={() => toast({ title: "Export Started", description: "Downloading events data..." })} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Code</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Eco Centre</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Consent Forms</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventsWithDaysRemaining.map((event) => {
                      const school = getEventSchool(event.schoolId);
                      const ecoCentre = getEventEcoCentre(event.ecoCentreId);
                      const daysRemaining = event.daysRemaining;
                      
                      return (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.code}</TableCell>
                          <TableCell>{school?.name || 'N/A'}</TableCell>
                          <TableCell>{ecoCentre?.name || 'N/A'}</TableCell>
                          <TableCell>{format(parseISO(event.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{event.students_count}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{event.consentFormsSubmitted || 0}/{event.students_count}</span>
                              {event.consentFormsSubmitted === event.students_count ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className={daysRemaining < 0 ? 'text-destructive' : daysRemaining <= 7 ? 'text-yellow-600' : 'text-foreground'}>
                                {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days ago` : `${daysRemaining} days`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              event.status === "approved" ? "default" :
                              event.status === "rejected" ? "destructive" : 
                              event.status === "completed" ? "secondary" : "outline"
                            }>
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEventDetail(event)}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                              {event.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApproveEvent(event.id)}
                                    className="bg-forest hover:bg-forest/90"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleRejectEvent(event.id)}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Eco Centre Bookings */}
          <TabsContent value="bookings">
            <EcoCentreBookingsAdmin 
              bookings={mockBookings}
              ecoCentres={mockEcoCentres}
              activities={mockBookingActivities}
              onBookingUpdate={updateBookingStatus}
              onPaymentUpdate={updateBookingPaymentStatus}
              onBookingDelete={deleteBooking}
            />
          </TabsContent>

          {/* Schools Management */}
          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>School Registrations</CardTitle>
                    <CardDescription>Review and approve school registration requests</CardDescription>
                  </div>
                  <Button onClick={() => toast({ title: "Export Started", description: "Downloading CSV file..." })} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSchools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>{school.contact_person}</TableCell>
                        <TableCell>{school.contact_phone}</TableCell>
                        <TableCell>{school.email}</TableCell>
                        <TableCell>{school.address}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coordinators Management */}
          <TabsContent value="coordinators">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Coordinators</CardTitle>
                    <CardDescription>Manage program coordinators</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-forest hover:bg-forest/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Coordinator
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Coordinator</DialogTitle>
                        <DialogDescription>Enter coordinator details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Name</Label>
                          <Input placeholder="Coordinator name" />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input placeholder="+91-XXXXXXXXXX" />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input type="email" placeholder="coordinator@wildagile.org" />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="senior">Senior Coordinator</SelectItem>
                              <SelectItem value="field">Field Coordinator</SelectItem>
                              <SelectItem value="logistics">Logistics Coordinator</SelectItem>
                              <SelectItem value="safety">Safety Coordinator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-forest hover:bg-forest/90">Add Coordinator</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCoordinators.map((coord) => (
                      <TableRow key={coord.id}>
                        <TableCell className="font-medium">{coord.name}</TableCell>
                        <TableCell>{coord.role}</TableCell>
                        <TableCell>{coord.phone}</TableCell>
                        <TableCell>{coord.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Drivers Management */}
          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Bus Drivers</CardTitle>
                    <CardDescription>Manage bus drivers and vehicles</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-forest hover:bg-forest/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Driver
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Driver</DialogTitle>
                        <DialogDescription>Enter driver and vehicle details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Driver Name</Label>
                          <Input placeholder="Driver name" />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input placeholder="+91-XXXXXXXXXX" />
                        </div>
                        <div>
                          <Label>License Number</Label>
                          <Input placeholder="License number" />
                        </div>
                        <div>
                          <Label>Vehicle Number</Label>
                          <Input placeholder="Vehicle registration" />
                        </div>
                        <div>
                          <Label>Vehicle Type</Label>
                          <Input placeholder="e.g., School Bus (45 seater)" />
                        </div>
                        <Button className="w-full bg-forest hover:bg-forest/90">Add Driver</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Vehicle Number</TableHead>
                      <TableHead>Vehicle Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockBusDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.licenseNumber}</TableCell>
                        <TableCell>{driver.vehicleNumber}</TableCell>
                        <TableCell>{driver.vehicleType}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Reports & Analytics</CardTitle>
                    <CardDescription>Generate and download program reports</CardDescription>
                  </div>
                  <Button onClick={() => toast({ title: "Report Generated", description: "Downloading report..." })} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Summary</CardTitle>
                      <CardDescription>January 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Events: {events.length} • Students: {events.reduce((sum, e) => sum + e.students_count, 0)}</p>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Impact Report</CardTitle>
                      <CardDescription>Q4 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">Events: {completedEvents.length} • Students: {completedEvents.reduce((sum, e) => sum + e.students_count, 0)}</p>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Event Detail Dialog */}
      <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedEvent?.code} - Event Details</DialogTitle>
            <DialogDescription>
              Complete event information and management
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (() => {
            const eventDate = parseISO(selectedEvent.date);
            const today = new Date();
            const daysRemaining = differenceInDays(eventDate, today);
            
            return (
              <div className="space-y-6">
                {/* Days Remaining Slider */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Time Remaining
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Event Date: {format(parseISO(selectedEvent.date), 'MMMM dd, yyyy')}</span>
                        <span className={`text-lg font-bold ${daysRemaining < 0 ? 'text-destructive' : daysRemaining <= 7 ? 'text-yellow-600' : 'text-forest'}`}>
                          {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days ago` : `${daysRemaining} days remaining`}
                        </span>
                      </div>
                      <Slider
                        value={[Math.max(0, Math.min(30, daysRemaining))]}
                        max={30}
                        min={0}
                        step={1}
                        disabled
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0 days</span>
                        <span>30 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              {/* Event Overview */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">School</Label>
                      <p className="font-medium">{getEventSchool(selectedEvent.schoolId)?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Eco Centre</Label>
                      <p className="font-medium">{getEventEcoCentre(selectedEvent.ecoCentreId)?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Event Date</Label>
                      <p className="font-medium">{format(parseISO(selectedEvent.date), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <Badge variant={selectedEvent.status === 'approved' ? 'default' : selectedEvent.status === 'rejected' ? 'destructive' : 'outline'}>
                        {selectedEvent.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-muted-foreground">Total Students</Label>
                      <p className="font-medium text-2xl">{selectedEvent.students_count}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Consent Forms Submitted</Label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-2xl">{selectedEvent.consentFormsSubmitted || 0}</p>
                        <span className="text-sm text-muted-foreground">/ {selectedEvent.students_count}</span>
                        {selectedEvent.consentFormsSubmitted === selectedEvent.students_count ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${((selectedEvent.consentFormsSubmitted || 0) / selectedEvent.students_count) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Coordinators</Label>
                    <Select
                      value={selectedEvent.assignedCoordinators[0] || ''}
                      onValueChange={(value) => handleAssignCoordinator(selectedEvent.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select coordinator" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCoordinators.map(coord => (
                          <SelectItem key={coord.id} value={coord.id}>
                            {coord.name} - {coord.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedEvent.assignedCoordinators.map(coordId => {
                        const coord = getCoordinator(coordId);
                        return coord ? (
                          <Badge key={coordId} variant="secondary" className="flex items-center gap-1">
                            {coord.name}
                            <XCircle 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => handleAssignCoordinator(selectedEvent.id, coordId)}
                            />
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Bus Driver</Label>
                    <Select
                      value={selectedEvent.assignedDriverId || ''}
                      onValueChange={(value) => handleAssignDriver(selectedEvent.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockBusDrivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} - {driver.vehicleNumber} ({driver.vehicleType})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedEvent.assignedDriverId && (
                      <div className="mt-2">
                        {(() => {
                          const driver = getDriver(selectedEvent.assignedDriverId);
                          return driver ? (
                            <div className="p-3 bg-muted rounded-lg">
                              <p className="font-medium">{driver.name}</p>
                              <p className="text-sm text-muted-foreground">{driver.phone}</p>
                              <p className="text-sm text-muted-foreground">{driver.vehicleNumber} - {driver.vehicleType}</p>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Teachers */}
              {selectedEvent.teachers && selectedEvent.teachers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedEvent.teachers.map(teacher => (
                        <div key={teacher.id} className="flex items-start gap-4 p-3 border rounded-lg">
                          <User className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">{teacher.role}</p>
                            <div className="flex gap-4 mt-1">
                              <a href={`tel:${teacher.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {teacher.phone}
                              </a>
                              <a href={`mailto:${teacher.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {teacher.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Emergency Contacts */}
              {selectedEvent.emergencyContacts && selectedEvent.emergencyContacts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedEvent.emergencyContacts.map((contact, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          <div className="flex-1">
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">Student: {contact.studentName}</p>
                            <a href={`tel:${contact.phone}`} className="text-sm text-primary hover:underline flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Route Map */}
              {selectedEvent.route && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="h-5 w-5" />
                      Route Map
                    </CardTitle>
                    <CardDescription>Route from school to eco centre with hospitals and petrol stations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 rounded-lg overflow-hidden border">
                      {(() => {
                        const ecoCentre = getEventEcoCentre(selectedEvent.ecoCentreId);
                        if (!ecoCentre) return null;
                        
                        return <MapPanel ecoCentre={ecoCentre} route={selectedEvent.route} />;
                      })()}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span><strong>Start:</strong> {selectedEvent.route.startPoint.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span><strong>End:</strong> {selectedEvent.route.endPoint.name}</span>
                      </div>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-medium">Waypoints:</p>
                        {selectedEvent.route.waypoints.map((point, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                            {point.type === 'hospital' ? (
                              <Hospital className="h-4 w-4 text-red-600" />
                            ) : point.type === 'petrol_station' ? (
                              <Fuel className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                            <span>{point.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Documents & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEvent.documents && selectedEvent.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedEvent.documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {doc.type.replace('_', ' ')} • Uploaded: {format(parseISO(doc.uploadedAt), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank')}>
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                  )}
                  <Button className="mt-4" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                </CardContent>
              </Card>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
