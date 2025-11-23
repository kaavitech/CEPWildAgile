import React, { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CheckCircle, XCircle, Download, Plus, Edit, Trash2, IndianRupee, Search,
  Ticket, BarChart3, Building, Activity, TrendingUp, FileCheck, Settings, Calendar, Clock, Users, Car
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  mockEcoCentres, mockBookingActivities, getTotalRevenue, getPendingPaymentsTotal,
  addEcoCentre, updateEcoCentre, deleteEcoCentre, getEcoCentreById,
  addBookingActivity, updateBookingActivity, deleteBookingActivity
} from "@/lib/mockData";
import type { Booking, BookingActivity, ActivitySlot, EcoCentre } from "@/lib/mockData";
import { AddActivityDialog, EditActivityDialog, ActivitySlotManagementDialog } from "./ActivityDialogs";
import { format, parseISO } from "date-fns";
import { QRCodeSVG } from 'qrcode.react';

interface EcoCentreBookingsAdminProps {
  bookings: Booking[];
  ecoCentres: typeof mockEcoCentres;
  activities: typeof mockBookingActivities;
  onBookingUpdate: (id: string, status: 'confirmed' | 'cancelled') => boolean;
  onPaymentUpdate: (id: string, status: 'pending' | 'completed') => boolean;
  onBookingDelete: (id: string) => boolean;
}

const EcoCentreBookingsAdmin = ({
  bookings,
  ecoCentres,
  activities,
  onBookingUpdate,
  onPaymentUpdate,
  onBookingDelete
}: EcoCentreBookingsAdminProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEcoCentre, setSelectedEcoCentre] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingDetailOpen, setIsBookingDetailOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'bookings' | 'centres' | 'activities' | 'reports'>('dashboard');

  // Calculate statistics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending' && b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' && b.paymentStatus === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const pendingRevenue = bookings
    .filter(b => b.paymentStatus === 'pending' && b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.mobile.includes(searchTerm);
      
      if (!matchesSearch) return false;
      if (selectedEcoCentre !== 'all' && booking.ecoCentreId !== selectedEcoCentre) return false;
      if (selectedActivity !== 'all' && booking.activityId !== selectedActivity) return false;
      if (selectedStatus !== 'all' && booking.status !== selectedStatus) return false;
      if (selectedPaymentStatus !== 'all' && booking.paymentStatus !== selectedPaymentStatus) return false;
      if (dateRange.start && booking.date < dateRange.start) return false;
      if (dateRange.end && booking.date > dateRange.end) return false;
      
      return true;
    });
  }, [bookings, searchTerm, selectedEcoCentre, selectedActivity, selectedStatus, selectedPaymentStatus, dateRange]);

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDetailOpen(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    if (onBookingUpdate(bookingId, 'cancelled')) {
      toast({
        title: "Booking Cancelled",
        description: "The booking has been cancelled successfully.",
        variant: "destructive"
      });
      setIsBookingDetailOpen(false);
    }
  };

  const handleConfirmPayment = (bookingId: string) => {
    if (onPaymentUpdate(bookingId, 'completed')) {
      toast({
        title: "Payment Confirmed",
        description: "Payment status has been updated to completed.",
      });
      if (selectedBooking) {
        setSelectedBooking({ ...selectedBooking, paymentStatus: 'completed' });
      }
    }
  };

  const handleDeleteBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      if (onBookingDelete(bookingId)) {
        toast({
          title: "Booking Deleted",
          description: "The booking has been deleted successfully.",
          variant: "destructive"
        });
        setIsBookingDetailOpen(false);
      }
    }
  };

  const getEcoCentre = (id: string) => ecoCentres.find(c => c.id === id);
  const getActivity = (id: string) => activities.find(a => a.id === id);
  const getSlot = (activityId: string, slotId: string) => {
    const activity = getActivity(activityId);
    return activity?.slots?.find(s => s.id === slotId);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs for different sections */}
      <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as any)}>
        <TabsList className="bg-muted">
          <TabsTrigger value="dashboard"><BarChart3 className="w-4 h-4 mr-2" />Dashboard</TabsTrigger>
          <TabsTrigger value="bookings"><Ticket className="w-4 h-4 mr-2" />All Bookings</TabsTrigger>
          <TabsTrigger value="centres"><Building className="w-4 h-4 mr-2" />Eco Centres</TabsTrigger>
          <TabsTrigger value="activities"><Activity className="w-4 h-4 mr-2" />Activities</TabsTrigger>
          <TabsTrigger value="reports"><TrendingUp className="w-4 h-4 mr-2" />Reports</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{confirmedBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">Active bookings</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary flex items-center">
                  <IndianRupee className="h-6 w-6 mr-1" />
                  {totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Completed payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 flex items-center">
                  <IndianRupee className="h-6 w-6 mr-1" />
                  {pendingRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{pendingPayments} bookings</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Latest 10 bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Eco Centre</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.slice(0, 10).map((booking) => {
                    const centre = getEcoCentre(booking.ecoCentreId);
                    const activity = getActivity(booking.activityId);
                    return (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.bookingId}</TableCell>
                        <TableCell>{booking.name}</TableCell>
                        <TableCell>{centre?.name || 'N/A'}</TableCell>
                        <TableCell>{activity?.name || 'N/A'}</TableCell>
                        <TableCell>{format(parseISO(booking.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {booking.totalAmount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                            <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'outline'}>
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBooking(booking)}
                          >
                            <FileCheck className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Bookings */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Manage and view all eco centre bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by booking ID, name, mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedEcoCentre} onValueChange={setSelectedEcoCentre}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Eco Centres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Eco Centres</SelectItem>
                    {ecoCentres.map(centre => (
                      <SelectItem key={centre.id} value={centre.id}>{centre.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Activities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    {activities.map(activity => (
                      <SelectItem key={activity.id} value={activity.id}>{activity.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payment Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>

              {/* Bookings Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Eco Centre</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Time Slot</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                        No bookings found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => {
                      const centre = getEcoCentre(booking.ecoCentreId);
                      const activity = getActivity(booking.activityId);
                      const slot = booking.slotId ? getSlot(booking.activityId, booking.slotId) : null;
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.bookingId}</TableCell>
                          <TableCell>{format(parseISO(booking.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{booking.name}</TableCell>
                          <TableCell>{booking.mobile}</TableCell>
                          <TableCell>{centre?.name || 'N/A'}</TableCell>
                          <TableCell>{activity?.name || 'N/A'}</TableCell>
                          <TableCell>
                            {slot ? `${slot.startTime} - ${slot.endTime}` : 'All Day'}
                          </TableCell>
                          <TableCell>
                            {booking.participants}
                            {booking.vehicles && ` (${booking.vehicles} vehicle${booking.vehicles > 1 ? 's' : ''})`}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <IndianRupee className="h-3 w-3 mr-1" />
                              {booking.totalAmount}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'outline'}>
                              {booking.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewBooking(booking)}
                              >
                                <FileCheck className="w-4 h-4" />
                              </Button>
                              {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConfirmPayment(booking.id)}
                                >
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </Button>
                              )}
                              {booking.status === 'confirmed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Eco Centres Management */}
        <TabsContent value="centres">
          <EcoCentresManagement 
            centres={ecoCentres} 
            activities={activities}
            onAddCentre={addEcoCentre}
            onUpdateCentre={updateEcoCentre}
            onDeleteCentre={deleteEcoCentre}
          />
        </TabsContent>

        {/* Activities Management */}
        <TabsContent value="activities">
          <ActivitiesManagement 
            activities={activities}
            ecoCentres={ecoCentres}
            onAddActivity={addBookingActivity}
            onUpdateActivity={updateBookingActivity}
            onDeleteActivity={deleteBookingActivity}
          />
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          <BookingsReports 
            bookings={bookings}
            ecoCentres={ecoCentres}
            activities={activities}
          />
        </TabsContent>
      </Tabs>

      {/* Booking Detail Dialog */}
      {selectedBooking && (
        <BookingDetailDialog
          booking={selectedBooking}
          isOpen={isBookingDetailOpen}
          onClose={() => setIsBookingDetailOpen(false)}
          ecoCentre={getEcoCentre(selectedBooking.ecoCentreId)}
          activity={getActivity(selectedBooking.activityId)}
          slot={selectedBooking.slotId ? getSlot(selectedBooking.activityId, selectedBooking.slotId) : null}
          onCancel={handleCancelBooking}
          onConfirmPayment={handleConfirmPayment}
          onDelete={handleDeleteBooking}
        />
      )}
    </div>
  );
};

// Booking Detail Dialog Component
interface BookingDetailDialogProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  ecoCentre?: typeof mockEcoCentres[0];
  activity?: BookingActivity;
  slot?: ActivitySlot;
  onCancel: (id: string) => void;
  onConfirmPayment: (id: string) => void;
  onDelete: (id: string) => void;
}

const BookingDetailDialog = ({
  booking,
  isOpen,
  onClose,
  ecoCentre,
  activity,
  slot,
  onCancel,
  onConfirmPayment,
  onDelete
}: BookingDetailDialogProps) => {
  const qrData = JSON.stringify({
    bookingId: booking.bookingId,
    ecoCentre: ecoCentre?.name,
    activity: activity?.name,
    date: booking.date,
    participants: booking.participants
  });

  const handleDownload = () => {
    const ticket = `
BOOKING CONFIRMATION
====================

Booking ID: ${booking.bookingId}
Date: ${format(parseISO(booking.date), 'MMMM d, yyyy')}
Eco Centre: ${ecoCentre?.name || 'N/A'}
Activity: ${activity?.name || 'N/A'}
${slot ? `Time Slot: ${slot.startTime} - ${slot.endTime}` : ''}

Participants: ${booking.participants}
${booking.vehicles ? `Vehicles: ${booking.vehicles}` : ''}
Total Amount: ₹${booking.totalAmount}

Contact: ${booking.name}
Mobile: ${booking.mobile}

Status: ${booking.status.toUpperCase()}
Payment: ${booking.paymentStatus.toUpperCase()}
    `.trim();

    const blob = new Blob([ticket], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${booking.bookingId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Booking Details</DialogTitle>
          <DialogDescription>Complete information for booking {booking.bookingId}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Booking Status */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-lg px-3 py-1">
                {booking.status.toUpperCase()}
              </Badge>
              <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'outline'} className="text-lg px-3 py-1">
                Payment: {booking.paymentStatus.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                <Button onClick={() => onConfirmPayment(booking.id)} variant="default">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Payment
                </Button>
              )}
              {booking.status === 'confirmed' && (
                <Button onClick={() => onCancel(booking.id)} variant="destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Booking
                </Button>
              )}
              <Button onClick={() => onDelete(booking.id)} variant="outline">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <Button onClick={handleDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Booking Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Booking ID</Label>
                  <p className="font-semibold">{booking.bookingId}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Booking Date</Label>
                  <p className="font-semibold">{format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}</p>
                </div>
                {slot && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Time Slot</Label>
                    <p className="font-semibold">{slot.startTime} - {slot.endTime}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-muted-foreground">Created On</Label>
                  <p className="font-semibold">{format(parseISO(booking.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  <p className="font-semibold">{booking.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mobile</Label>
                  <p className="font-semibold">{booking.mobile}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Eco Centre & Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Eco Centre</Label>
                  <p className="font-semibold">{ecoCentre?.name || 'N/A'}</p>
                  {ecoCentre?.location && (
                    <p className="text-sm text-muted-foreground mt-1">{ecoCentre.location.address}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Activity</Label>
                  <p className="font-semibold">{activity?.name || 'N/A'}</p>
                  {activity?.description && (
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  )}
                </div>
                {activity && (
                  <div>
                    <Badge variant={activity.type === 'FREE' ? 'secondary' : 'default'}>
                      {activity.type}
                    </Badge>
                    {activity.price && (
                      <span className="ml-2 text-sm">
                        <IndianRupee className="h-3 w-3 inline mr-1" />
                        {activity.price} per {activity.requiresVehicles ? 'vehicle' : 'person'}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Participants</Label>
                  <p className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {booking.participants} {booking.participants === 1 ? 'person' : 'people'}
                  </p>
                </div>
                {booking.vehicles && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Vehicles</Label>
                    <p className="font-semibold flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      {booking.vehicles} {booking.vehicles === 1 ? 'vehicle' : 'vehicles'}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-muted-foreground">Total Amount</Label>
                  <p className="font-semibold text-2xl flex items-center">
                    <IndianRupee className="h-6 w-6 mr-1" />
                    {booking.totalAmount}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Ticket</CardTitle>
              <CardDescription>Show this QR code at the eco centre entrance</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCodeSVG value={qrData} size={200} />
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Scan this QR code at the eco centre to verify your booking and gain entry.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Eco Centres Management Component
interface EcoCentresManagementProps {
  centres: typeof mockEcoCentres;
  activities: typeof mockBookingActivities;
  onAddCentre: (centre: Omit<EcoCentre, 'id'>) => EcoCentre;
  onUpdateCentre: (id: string, updates: Partial<EcoCentre>) => boolean;
  onDeleteCentre: (id: string) => boolean;
}

const EcoCentresManagement = ({ 
  centres, 
  activities,
  onAddCentre,
  onUpdateCentre,
  onDeleteCentre
}: EcoCentresManagementProps) => {
  const { toast } = useToast();
  const [selectedCentre, setSelectedCentre] = useState<EcoCentre | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleEdit = (centre: EcoCentre) => {
    setSelectedCentre(centre);
    setIsEditOpen(true);
  };

  const handleSettings = (centre: EcoCentre) => {
    setSelectedCentre(centre);
    setIsSettingsOpen(true);
  };

  const handleDelete = (centreId: string) => {
    if (confirm('Are you sure you want to delete this eco centre? This action cannot be undone.')) {
      if (onDeleteCentre(centreId)) {
        toast({
          title: "Eco Centre Deleted",
          description: "The eco centre has been deleted successfully.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Eco Centres Management</CardTitle>
              <CardDescription>Manage eco centres, activities, and settings</CardDescription>
            </div>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Eco Centre
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Activities</TableHead>
                <TableHead>Opening Hours</TableHead>
                <TableHead>Weekly Off</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centres.map(centre => {
                const centreActivities = activities.filter(a => a.ecoCentreId === centre.id);
                return (
                  <TableRow key={centre.id}>
                    <TableCell className="font-medium">{centre.name}</TableCell>
                    <TableCell>
                      {centre.location.district || 'N/A'}, {centre.location.state || 'N/A'}
                    </TableCell>
                    <TableCell>{centre.capacity}</TableCell>
                    <TableCell>{centreActivities.length}</TableCell>
                    <TableCell>
                      {centre.openingTime && centre.closingTime 
                        ? `${centre.openingTime} - ${centre.closingTime}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {centre.weeklyOffDays && centre.weeklyOffDays.length > 0
                        ? centre.weeklyOffDays.join(', ')
                        : 'None'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(centre)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSettings(centre)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(centre.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Eco Centre Dialog */}
      <AddEcoCentreDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(centreData) => {
          onAddCentre(centreData);
          setIsAddOpen(false);
          toast({
            title: "Eco Centre Added",
            description: "The eco centre has been added successfully.",
          });
        }}
      />

      {/* Edit Eco Centre Dialog */}
      {selectedCentre && (
        <EditEcoCentreDialog
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedCentre(null);
          }}
          centre={selectedCentre}
          onSave={(updates) => {
            onUpdateCentre(selectedCentre.id, updates);
            setIsEditOpen(false);
            setSelectedCentre(null);
            toast({
              title: "Eco Centre Updated",
              description: "The eco centre has been updated successfully.",
            });
          }}
        />
      )}

      {/* Settings Dialog */}
      {selectedCentre && (
        <EcoCentreSettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            setSelectedCentre(null);
          }}
          centre={selectedCentre}
          onSave={(settings) => {
            onUpdateCentre(selectedCentre.id, settings);
            setIsSettingsOpen(false);
            setSelectedCentre(null);
            toast({
              title: "Settings Updated",
              description: "The eco centre settings have been updated successfully.",
            });
          }}
        />
      )}
    </div>
  );
};

// Activities Management Component
interface ActivitiesManagementProps {
  activities: typeof mockBookingActivities;
  ecoCentres: typeof mockEcoCentres;
  onAddActivity: (activity: BookingActivity) => boolean;
  onUpdateActivity: (id: string, updates: Partial<BookingActivity>) => boolean;
  onDeleteActivity: (id: string) => boolean;
}

const ActivitiesManagement = ({ 
  activities, 
  ecoCentres,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity
}: ActivitiesManagementProps) => {
  const { toast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<BookingActivity | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEcoCentre, setFilterEcoCentre] = useState<string>('all');

  const handleEdit = (activity: BookingActivity) => {
    setSelectedActivity(activity);
    setIsEditOpen(true);
  };

  const handleSettings = (activity: BookingActivity) => {
    setSelectedActivity(activity);
    setIsSettingsOpen(true);
  };

  const handleDelete = (activityId: string) => {
    if (confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      if (onDeleteActivity(activityId)) {
        toast({
          title: "Activity Deleted",
          description: "The activity has been deleted successfully.",
          variant: "destructive"
        });
      }
    }
  };

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = 
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      if (filterEcoCentre !== 'all' && activity.ecoCentreId !== filterEcoCentre) return false;
      
      return true;
    });
  }, [activities, searchTerm, filterEcoCentre]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Activities Management</CardTitle>
              <CardDescription>Manage activities, slots, and pricing</CardDescription>
            </div>
            <Button onClick={() => setIsAddOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterEcoCentre} onValueChange={setFilterEcoCentre}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Eco Centre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Eco Centres</SelectItem>
                {ecoCentres.map(centre => (
                  <SelectItem key={centre.id} value={centre.id}>{centre.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activities Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Eco Centre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Slot-Based</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Slots</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No activities found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredActivities.map(activity => {
                  const centre = ecoCentres.find(c => c.id === activity.ecoCentreId);
                  return (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.name}</TableCell>
                      <TableCell>{centre?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={activity.type === 'FREE' ? 'secondary' : 'default'}>
                          {activity.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {activity.price ? (
                          <div className="flex items-center">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {activity.price} {activity.requiresVehicles ? '/vehicle' : '/person'}
                          </div>
                        ) : (
                          'FREE'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={activity.isSlotBased ? 'default' : 'outline'}>
                          {activity.isSlotBased ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell>{activity.capacity}</TableCell>
                      <TableCell>
                        {activity.isSlotBased ? (activity.slots?.length || 0) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(activity)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {activity.isSlotBased && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSettings(activity)}
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(activity.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Activity Dialog */}
      <AddActivityDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        ecoCentres={ecoCentres}
        onSave={(activityData) => {
          onAddActivity(activityData);
          setIsAddOpen(false);
          toast({
            title: "Activity Added",
            description: "The activity has been added successfully.",
          });
        }}
      />

      {/* Edit Activity Dialog */}
      {selectedActivity && (
        <EditActivityDialog
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedActivity(null);
          }}
          activity={selectedActivity}
          ecoCentres={ecoCentres}
          onSave={(updates) => {
            onUpdateActivity(selectedActivity.id, updates);
            setIsEditOpen(false);
            setSelectedActivity(null);
            toast({
              title: "Activity Updated",
              description: "The activity has been updated successfully.",
            });
          }}
        />
      )}

      {/* Slot Management Dialog */}
      {selectedActivity && selectedActivity.isSlotBased && (
        <ActivitySlotManagementDialog
          isOpen={isSettingsOpen}
          onClose={() => {
            setIsSettingsOpen(false);
            setSelectedActivity(null);
          }}
          activity={selectedActivity}
          onUpdateSlots={(slots) => {
            onUpdateActivity(selectedActivity.id, { slots });
            setIsSettingsOpen(false);
            setSelectedActivity(null);
            toast({
              title: "Slots Updated",
              description: "Activity slots have been updated successfully.",
            });
          }}
        />
      )}
    </div>
  );
};

// Reports Component
const BookingsReports = ({
  bookings,
  ecoCentres,
  activities
}: {
  bookings: Booking[];
  ecoCentres: typeof mockEcoCentres;
  activities: typeof mockBookingActivities;
}) => {
  const totalRevenue = getTotalRevenue();
  const pendingRevenue = getPendingPaymentsTotal();
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  
  const revenueByCentre = ecoCentres.map(centre => ({
    centre,
    revenue: confirmedBookings
      .filter(b => b.ecoCentreId === centre.id && b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0),
    bookings: confirmedBookings.filter(b => b.ecoCentreId === centre.id).length
  }));

  const revenueByActivity = activities.map(activity => ({
    activity,
    revenue: confirmedBookings
      .filter(b => b.activityId === activity.id && b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0),
    bookings: confirmedBookings.filter(b => b.activityId === activity.id).length
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Revenue and payment statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label className="text-sm text-muted-foreground">Total Revenue</Label>
              <p className="text-3xl font-bold flex items-center mt-2">
                <IndianRupee className="h-8 w-8 mr-1" />
                {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Completed Payments</Label>
              <p className="text-3xl font-bold mt-2">
                {bookings.filter(b => b.paymentStatus === 'completed' && b.status === 'confirmed').length}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Pending Payments</Label>
              <p className="text-3xl font-bold text-orange-600 flex items-center mt-2">
                <IndianRupee className="h-8 w-8 mr-1" />
                {pendingRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Eco Centre</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Eco Centre</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueByCentre.map(({ centre, revenue, bookings }) => (
                  <TableRow key={centre.id}>
                    <TableCell className="font-medium">{centre.name}</TableCell>
                    <TableCell>{bookings}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {revenue.toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {revenueByActivity
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 10)
                  .map(({ activity, revenue, bookings }) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.name}</TableCell>
                      <TableCell>{bookings}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee className="h-3 w-3 mr-1" />
                          {revenue.toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Add Eco Centre Dialog Component
interface AddEcoCentreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (centre: Omit<EcoCentre, 'id'>) => void;
}

const AddEcoCentreDialog = ({ isOpen, onClose, onSave }: AddEcoCentreDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    district: '',
    state: 'Maharashtra',
    lat: '',
    lng: '',
    capacity: '100',
    trailDifficulty: 'Easy' as 'Easy' | 'Moderate' | 'Difficult',
    hospitalName: '',
    hospitalPhone: '',
    hospitalLat: '',
    hospitalLng: '',
    hospitalDistance: '',
    features: '',
    openingTime: '08:00',
    closingTime: '18:00',
    weeklyOffDays: [] as string[],
    contactPhone: '',
    contactEmail: '',
    officialWebsiteUrl: ''
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const centreData: Omit<EcoCentre, 'id'> = {
      name: formData.name,
      description: formData.description,
      location: {
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
        address: formData.address,
        district: formData.district,
        state: formData.state
      },
      capacity: parseInt(formData.capacity) || 100,
      trailDifficulty: formData.trailDifficulty,
      nearestHospital: {
        name: formData.hospitalName,
        phone: formData.hospitalPhone,
        coords: {
          lat: parseFloat(formData.hospitalLat) || 0,
          lng: parseFloat(formData.hospitalLng) || 0
        },
        distance_km: parseFloat(formData.hospitalDistance) || 0
      },
      images: [],
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      weeklyOffDays: formData.weeklyOffDays,
      contactInfo: {
        phone: formData.contactPhone,
        email: formData.contactEmail
      },
      officialWebsiteUrl: formData.officialWebsiteUrl || undefined
    };

    onSave(centreData);
    // Reset form
    setFormData({
      name: '',
      description: '',
      address: '',
      district: '',
      state: 'Maharashtra',
      lat: '',
      lng: '',
      capacity: '100',
      trailDifficulty: 'Easy',
      hospitalName: '',
      hospitalPhone: '',
      hospitalLat: '',
      hospitalLng: '',
      hospitalDistance: '',
      features: '',
      openingTime: '08:00',
      closingTime: '18:00',
      weeklyOffDays: [],
      contactPhone: '',
      contactEmail: '',
      officialWebsiteUrl: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Eco Centre</DialogTitle>
          <DialogDescription>Enter details for the new eco centre</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
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
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    className="mt-2"
                    min="1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="trailDifficulty">Trail Difficulty *</Label>
                  <Select
                    value={formData.trailDifficulty}
                    onValueChange={(value: 'Easy' | 'Moderate' | 'Difficult') => 
                      setFormData({ ...formData, trailDifficulty: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Difficult">Difficult</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="mt-2"
                  placeholder="Nature Trail, Bird Watching, Safari"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="mt-2"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="lat">Latitude *</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="lng">Longitude *</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nearest Hospital */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nearest Hospital</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hospitalName">Hospital Name *</Label>
                  <Input
                    id="hospitalName"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hospitalPhone">Hospital Phone *</Label>
                  <Input
                    id="hospitalPhone"
                    value={formData.hospitalPhone}
                    onChange={(e) => setFormData({ ...formData, hospitalPhone: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="hospitalLat">Hospital Latitude *</Label>
                  <Input
                    id="hospitalLat"
                    type="number"
                    step="any"
                    value={formData.hospitalLat}
                    onChange={(e) => setFormData({ ...formData, hospitalLat: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hospitalLng">Hospital Longitude *</Label>
                  <Input
                    id="hospitalLng"
                    type="number"
                    step="any"
                    value={formData.hospitalLng}
                    onChange={(e) => setFormData({ ...formData, hospitalLng: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hospitalDistance">Distance (km) *</Label>
                  <Input
                    id="hospitalDistance"
                    type="number"
                    step="any"
                    value={formData.hospitalDistance}
                    onChange={(e) => setFormData({ ...formData, hospitalDistance: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPhone">Phone *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="officialWebsiteUrl">Official Website URL</Label>
                <Input
                  id="officialWebsiteUrl"
                  type="url"
                  value={formData.officialWebsiteUrl}
                  onChange={(e) => setFormData({ ...formData, officialWebsiteUrl: e.target.value })}
                  className="mt-2"
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Operating Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="openingTime">Opening Time *</Label>
                  <Input
                    id="openingTime"
                    type="time"
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="closingTime">Closing Time *</Label>
                  <Input
                    id="closingTime"
                    type="time"
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Weekly Off Days</Label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={formData.weeklyOffDays.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              weeklyOffDays: [...formData.weeklyOffDays, day]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              weeklyOffDays: formData.weeklyOffDays.filter(d => d !== day)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`day-${day}`} className="cursor-pointer text-sm">
                        {day.substring(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Eco Centre
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Edit Eco Centre Dialog Component
interface EditEcoCentreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  centre: EcoCentre;
  onSave: (updates: Partial<EcoCentre>) => void;
}

const EditEcoCentreDialog = ({ isOpen, onClose, centre, onSave }: EditEcoCentreDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: centre.name,
    description: centre.description,
    address: centre.location.address,
    district: centre.location.district || '',
    state: centre.location.state || 'Maharashtra',
    lat: centre.location.lat.toString(),
    lng: centre.location.lng.toString(),
    capacity: centre.capacity.toString(),
    trailDifficulty: centre.trailDifficulty,
    hospitalName: centre.nearestHospital.name,
    hospitalPhone: centre.nearestHospital.phone,
    hospitalLat: centre.nearestHospital.coords.lat.toString(),
    hospitalLng: centre.nearestHospital.coords.lng.toString(),
    hospitalDistance: centre.nearestHospital.distance_km.toString(),
    features: centre.features.join(', '),
    openingTime: centre.openingTime || '08:00',
    closingTime: centre.closingTime || '18:00',
    weeklyOffDays: centre.weeklyOffDays || [],
    contactPhone: centre.contactInfo?.phone || '',
    contactEmail: centre.contactInfo?.email || '',
    officialWebsiteUrl: centre.officialWebsiteUrl || ''
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const updates: Partial<EcoCentre> = {
      name: formData.name,
      description: formData.description,
      location: {
        lat: parseFloat(formData.lat) || 0,
        lng: parseFloat(formData.lng) || 0,
        address: formData.address,
        district: formData.district,
        state: formData.state
      },
      capacity: parseInt(formData.capacity) || 100,
      trailDifficulty: formData.trailDifficulty,
      nearestHospital: {
        name: formData.hospitalName,
        phone: formData.hospitalPhone,
        coords: {
          lat: parseFloat(formData.hospitalLat) || 0,
          lng: parseFloat(formData.hospitalLng) || 0
        },
        distance_km: parseFloat(formData.hospitalDistance) || 0
      },
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      weeklyOffDays: formData.weeklyOffDays,
      contactInfo: {
        phone: formData.contactPhone,
        email: formData.contactEmail
      },
      officialWebsiteUrl: formData.officialWebsiteUrl || undefined
    };

    onSave(updates);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Eco Centre</DialogTitle>
          <DialogDescription>Update details for {centre.name}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Same form structure as Add - using edit- prefixed IDs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-capacity">Capacity *</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                    className="mt-2"
                    min="1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-trailDifficulty">Trail Difficulty *</Label>
                  <Select
                    value={formData.trailDifficulty}
                    onValueChange={(value: 'Easy' | 'Moderate' | 'Difficult') => 
                      setFormData({ ...formData, trailDifficulty: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Difficult">Difficult</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-features">Features (comma-separated)</Label>
                <Input
                  id="edit-features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="mt-2"
                  placeholder="Nature Trail, Bird Watching, Safari"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location, Hospital, Contact, Operating Hours - similar structure with edit- prefix */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="edit-address">Address *</Label>
                <Textarea
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="mt-2"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input id="edit-district" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} placeholder="District" required className="mt-2" />
                <Input id="edit-state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="State" required className="mt-2" />
                <Input id="edit-lat" type="number" step="any" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} placeholder="Latitude" required className="mt-2" />
                <Input id="edit-lng" type="number" step="any" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} placeholder="Longitude" required className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nearest Hospital</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input id="edit-hospitalName" value={formData.hospitalName} onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })} placeholder="Hospital Name" required className="mt-2" />
                <Input id="edit-hospitalPhone" value={formData.hospitalPhone} onChange={(e) => setFormData({ ...formData, hospitalPhone: e.target.value })} placeholder="Phone" required className="mt-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input id="edit-hospitalLat" type="number" step="any" value={formData.hospitalLat} onChange={(e) => setFormData({ ...formData, hospitalLat: e.target.value })} placeholder="Latitude" required className="mt-2" />
                <Input id="edit-hospitalLng" type="number" step="any" value={formData.hospitalLng} onChange={(e) => setFormData({ ...formData, hospitalLng: e.target.value })} placeholder="Longitude" required className="mt-2" />
                <Input id="edit-hospitalDistance" type="number" step="any" value={formData.hospitalDistance} onChange={(e) => setFormData({ ...formData, hospitalDistance: e.target.value })} placeholder="Distance (km)" required className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input id="edit-contactPhone" value={formData.contactPhone} onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })} placeholder="Phone" required className="mt-2" />
                <Input id="edit-contactEmail" type="email" value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} placeholder="Email" required className="mt-2" />
              </div>
              <Input id="edit-officialWebsiteUrl" type="url" value={formData.officialWebsiteUrl} onChange={(e) => setFormData({ ...formData, officialWebsiteUrl: e.target.value })} placeholder="Official Website URL" className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operating Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input id="edit-openingTime" type="time" value={formData.openingTime} onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })} required className="mt-2" />
                <Input id="edit-closingTime" type="time" value={formData.closingTime} onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })} required className="mt-2" />
              </div>
              <div>
                <Label>Weekly Off Days</Label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-day-${day}`}
                        checked={formData.weeklyOffDays.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, weeklyOffDays: [...formData.weeklyOffDays, day] });
                          } else {
                            setFormData({ ...formData, weeklyOffDays: formData.weeklyOffDays.filter(d => d !== day) });
                          }
                        }}
                      />
                      <Label htmlFor={`edit-day-${day}`} className="cursor-pointer text-sm">{day.substring(0, 3)}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit"><CheckCircle className="w-4 h-4 mr-2" />Update Eco Centre</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Eco Centre Settings Dialog Component
interface EcoCentreSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  centre: EcoCentre;
  onSave: (settings: Partial<EcoCentre>) => void;
}

const EcoCentreSettingsDialog = ({ isOpen, onClose, centre, onSave }: EcoCentreSettingsDialogProps) => {
  const [formData, setFormData] = useState({
    openingTime: centre.openingTime || '08:00',
    closingTime: centre.closingTime || '18:00',
    weeklyOffDays: centre.weeklyOffDays || [],
    contactPhone: centre.contactInfo?.phone || '',
    contactEmail: centre.contactInfo?.email || ''
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings: Partial<EcoCentre> = {
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      weeklyOffDays: formData.weeklyOffDays,
      contactInfo: {
        phone: formData.contactPhone,
        email: formData.contactEmail
      }
    };

    onSave(settings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Eco Centre Settings</DialogTitle>
          <DialogDescription>Configure booking settings for {centre.name}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operating Hours</CardTitle>
              <CardDescription>Set the opening and closing times for the eco centre</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="settings-openingTime">Opening Time *</Label>
                  <Input
                    id="settings-openingTime"
                    type="time"
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="settings-closingTime">Closing Time *</Label>
                  <Input
                    id="settings-closingTime"
                    type="time"
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label>Weekly Off Days</Label>
                <CardDescription className="mt-1 mb-2">Select days when the eco centre is closed</CardDescription>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`settings-day-${day}`}
                        checked={formData.weeklyOffDays.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, weeklyOffDays: [...formData.weeklyOffDays, day] });
                          } else {
                            setFormData({ ...formData, weeklyOffDays: formData.weeklyOffDays.filter(d => d !== day) });
                          }
                        }}
                      />
                      <Label htmlFor={`settings-day-${day}`} className="cursor-pointer text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
              <CardDescription>Update contact details for booking inquiries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="settings-contactPhone">Phone *</Label>
                <Input
                  id="settings-contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="+91-XXX-XXXXXXX"
                />
              </div>
              
              <div>
                <Label htmlFor="settings-contactEmail">Email *</Label>
                <Input
                  id="settings-contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  required
                  className="mt-2"
                  placeholder="contact@ecocentre.com"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit"><Settings className="w-4 h-4 mr-2" />Save Settings</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EcoCentreBookingsAdmin;

