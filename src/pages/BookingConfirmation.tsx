import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Home, IndianRupee, Calendar, Clock, Users, Car, Ticket } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockBookings, mockEcoCentres, mockBookingActivities } from '@/lib/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { format, parseISO } from 'date-fns';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(mockBookings.find(b => b.id === bookingId));
  
  useEffect(() => {
    if (!booking) {
      // Try to find by bookingId instead of id
      const foundBooking = mockBookings.find(b => b.bookingId === bookingId);
      if (foundBooking) {
        setBooking(foundBooking);
      }
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Button onClick={() => navigate('/bookings')}>Back to Bookings</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const centre = mockEcoCentres.find(c => c.id === booking.ecoCentreId);
  const activity = mockBookingActivities.find(a => a.id === booking.activityId);
  const slot = activity?.isSlotBased && booking.slotId
    ? activity.slots?.find(s => s.id === booking.slotId)
    : null;

  // Generate QR code data
  const qrData = JSON.stringify({
    bookingId: booking.bookingId,
    ecoCentre: centre?.name,
    activity: activity?.name,
    date: booking.date,
    participants: booking.participants
  });

  const handleDownload = () => {
    // Create a simple text ticket
    const ticket = `
BOOKING CONFIRMATION
====================

Booking ID: ${booking.bookingId}
Date: ${format(parseISO(booking.date), 'MMMM d, yyyy')}
Eco Centre: ${centre?.name || 'N/A'}
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Booking Confirmed!</h1>
              <p className="text-xl opacity-95">
                Your booking has been successfully confirmed
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Booking Details</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Review your booking information below
                </p>
              </div>

            {/* Booking Details Card */}
            <Card className="shadow-soft mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold mb-0">Booking Information</h3>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Ticket className="h-4 w-4" />
                    Booking ID
                  </div>
                  <p className="text-xl font-bold">{booking.bookingId}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Home className="h-4 w-4" />
                      Eco Centre
                    </div>
                    <p className="font-semibold">{centre?.name || 'N/A'}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                    <p className="font-semibold">
                      {format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      Activity
                    </div>
                    <p className="font-semibold">{activity?.name || 'N/A'}</p>
                  </div>

                  {slot && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Clock className="h-4 w-4" />
                        Time Slot
                      </div>
                      <p className="font-semibold">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Users className="h-4 w-4" />
                      Participants
                    </div>
                    <p className="font-semibold">{booking.participants} person(s)</p>
                  </div>

                  {booking.vehicles && (
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Car className="h-4 w-4" />
                        Vehicles
                      </div>
                      <p className="font-semibold">{booking.vehicles} vehicle(s)</p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <IndianRupee className="h-4 w-4" />
                      Total Amount
                    </div>
                    <p className="font-semibold text-lg">
                      ₹{booking.totalAmount} ({booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'})
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-1">Contact Details</div>
                  <p className="font-semibold">{booking.name}</p>
                  <p className="text-muted-foreground">{booking.mobile}</p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card className="shadow-soft mb-6">
              <CardHeader>
                <h3 className="text-2xl font-bold mb-2">Booking Ticket</h3>
                <p className="text-sm text-muted-foreground">
                  Show this QR code at the eco centre entrance
                </p>
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleDownload} variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Ticket
                </Button>
                <Link to="/bookings">
                  <Button variant="outline" size="lg">
                    <Home className="h-4 w-4 mr-2" />
                    Back to Bookings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;

