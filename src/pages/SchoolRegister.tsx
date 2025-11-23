import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Clock, IndianRupee, Package, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockEcoCentres } from '@/lib/mockData';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const SchoolRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: '',
    contactPerson: '',
    contactPhone: '',
    email: '',
    studentCount: '',
    ecoCentre: '',
    notes: ''
  });
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [fileName, setFileName] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [packageType, setPackageType] = useState<'individual' | 'wholeDay'>('individual');
  const [selectedOvernightRoom, setSelectedOvernightRoom] = useState<string>('');
  const [overnightNights, setOvernightNights] = useState<number>(0);

  const selectedCentre = mockEcoCentres.find(c => c.id === formData.ecoCentre);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock validation
    if (!formData.schoolName || !formData.contactPerson || !formData.email || 
        !formData.contactPhone || !formData.studentCount || !formData.ecoCentre || 
        selectedDates.length === 0 || !fileName) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate activity/package selection
    if (packageType === 'individual' && selectedActivities.length === 0) {
      toast.error('Please select at least one activity or choose the whole day package');
      return;
    }

    // Mock submission
    const eventCode = `CED-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    toast.success('Registration submitted successfully!');
    
    // Navigate to thank you page with event code
    navigate('/school/thank-you', { state: { eventCode } });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success('Parent consent form uploaded');
    }
  };

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const calculateTotalCost = () => {
    if (!selectedCentre || !formData.studentCount) return 0;
    const studentCount = parseInt(formData.studentCount) || 0;
    let total = 0;

    if (packageType === 'wholeDay' && selectedCentre.wholeDayPackage) {
      total = selectedCentre.wholeDayPackage.cost * studentCount;
    } else {
      selectedActivities.forEach(activityId => {
        const activity = selectedCentre.activities?.find(a => a.id === activityId);
        if (activity) {
          total += activity.cost * studentCount;
        }
      });
    }

    // Add overnight stay cost if selected
    if (selectedOvernightRoom && overnightNights > 0) {
      const room = selectedCentre.overnightStay?.rooms?.find(r => r.id === selectedOvernightRoom);
      if (room) {
        const roomsNeeded = Math.ceil(studentCount / room.capacity);
        total += room.rent * roomsNeeded * overnightNights;
      }
    }

    return total;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Send Enquiry</h1>
              <p className="text-xl opacity-95">
                Send an enquiry to participate in our eco-centre program
              </p>
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Enquiry Form</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Complete the form below to send an enquiry to participate in our eco-centre program. Our team will review your application and get back to you soon.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">

            <Card className="shadow-soft">
              <CardHeader>
                <h3 className="text-2xl font-semibold">Enquiry Details</h3>
                <p className="text-sm text-muted-foreground">All fields marked with * are required</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* School Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Enquiry Information</h3>
                    
                    <div>
                      <Label htmlFor="schoolName">Enquiry Name *</Label>
                      <Input
                        id="schoolName"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        placeholder="Enter enquiry name"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          placeholder="Enter contact person name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">Contact Phone Number *</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="+91-xxxxxxxxxx"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="studentCount">Number of Participants *</Label>
                      <Input
                        id="studentCount"
                        type="number"
                        value={formData.studentCount}
                        onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                        placeholder="Enter number of participants"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Visit Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Visit Preferences</h3>
                    
                    <div>
                      <Label htmlFor="ecoCentre">Preferred Eco Centre *</Label>
                      <Select value={formData.ecoCentre} onValueChange={(value) => setFormData({ ...formData, ecoCentre: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an eco centre" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockEcoCentres.map((centre) => (
                            <SelectItem key={centre.id} value={centre.id}>
                              {centre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Preferred Dates * (Select multiple dates)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDates.length > 0 
                              ? `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected`
                              : 'Select dates'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="multiple"
                            selected={selectedDates}
                            onSelect={(dates) => setSelectedDates(dates || [])}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      {selectedDates.length > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Selected: {selectedDates.map(d => format(d, 'PPP')).join(', ')}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any special requirements or notes..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Activity Selection */}
                  {selectedCentre && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Activity & Package Selection</h3>
                      
                      {selectedCentre.wholeDayPackage && (
                        <Card className="border-primary/20">
                          <CardContent className="pt-6">
                            <RadioGroup value={packageType} onValueChange={(value) => {
                              setPackageType(value as 'individual' | 'wholeDay');
                              if (value === 'wholeDay') {
                                setSelectedActivities([]);
                              }
                            }}>
                              <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                                <RadioGroupItem value="wholeDay" id="wholeDay" className="mt-1" />
                                <div className="flex-1">
                                  <Label htmlFor="wholeDay" className="font-semibold cursor-pointer flex items-center gap-2">
                                    <Package className="h-4 w-4 text-primary" />
                                    {selectedCentre.wholeDayPackage.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {selectedCentre.wholeDayPackage.description}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="font-semibold text-primary">
                                      <IndianRupee className="h-4 w-4 inline" />
                                      {selectedCentre.wholeDayPackage.cost.toLocaleString('en-IN')} per student
                                    </span>
                                  </div>
                                  <div className="mt-2">
                                    <p className="text-xs font-medium mb-1">Includes:</p>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      {selectedCentre.wholeDayPackage.includedActivities.map(activityId => {
                                        const activity = selectedCentre.activities?.find(a => a.id === activityId);
                                        return activity ? (
                                          <li key={activityId} className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-primary" />
                                            {activity.name} ({activity.estimatedTime})
                                          </li>
                                        ) : null;
                                      })}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 mt-2">
                                <RadioGroupItem value="individual" id="individual" className="mt-1" />
                                <div className="flex-1">
                                  <Label htmlFor="individual" className="font-semibold cursor-pointer">
                                    Select Individual Activities
                                  </Label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Choose specific activities you want to include
                                  </p>
                                </div>
                              </div>
                            </RadioGroup>
                          </CardContent>
                        </Card>
                      )}

                      {packageType === 'individual' && selectedCentre.activities && selectedCentre.activities.length > 0 && (
                        <Card>
                          <CardHeader>
                            <h4 className="font-semibold">Select Activities</h4>
                            <p className="text-sm text-muted-foreground">Choose the activities you want to include in your visit</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedCentre.activities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 rounded-md border p-3">
                                  <Checkbox
                                    id={activity.id}
                                    checked={selectedActivities.includes(activity.id)}
                                    onCheckedChange={() => handleActivityToggle(activity.id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={activity.id} className="font-medium cursor-pointer">
                                      {activity.name}
                                    </Label>
                                    {activity.description && (
                                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                    )}
                                    <div className="flex items-center gap-4 mt-2 text-sm">
                                      <div className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{activity.estimatedTime}</span>
                                      </div>
                                      <div className="flex items-center gap-1 font-semibold text-primary">
                                        <IndianRupee className="h-3 w-3" />
                                        <span>{activity.cost.toLocaleString('en-IN')} per student</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Overnight Stay Selection */}
                      {selectedCentre.overnightStay?.available && (
                        <Card>
                          <CardHeader>
                            <h4 className="font-semibold">Overnight Stay (Optional)</h4>
                            <p className="text-sm text-muted-foreground">Select accommodation if you need overnight stay</p>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {selectedCentre.overnightStay.rooms && selectedCentre.overnightStay.rooms.length > 0 && (
                              <>
                                <div>
                                  <Label>Room Type</Label>
                                  <Select value={selectedOvernightRoom} onValueChange={setSelectedOvernightRoom}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select room type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {selectedCentre.overnightStay.rooms.map((room) => (
                                        <SelectItem key={room.id} value={room.id}>
                                          {room.type} - Capacity: {room.capacity} | 
                                          <IndianRupee className="h-3 w-3 inline ml-1" />
                                          {room.rent.toLocaleString('en-IN')}/night
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                {selectedOvernightRoom && (
                                  <>
                                    <div>
                                      <Label htmlFor="nights">Number of Nights</Label>
                                      <Input
                                        id="nights"
                                        type="number"
                                        min="1"
                                        value={overnightNights}
                                        onChange={(e) => setOvernightNights(parseInt(e.target.value) || 0)}
                                        placeholder="Enter number of nights"
                                      />
                                    </div>
                                    {overnightNights > 0 && formData.studentCount && (
                                      <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                          Rooms needed: {Math.ceil(parseInt(formData.studentCount) / (selectedCentre.overnightStay.rooms?.find(r => r.id === selectedOvernightRoom)?.capacity || 1))}
                                        </p>
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Cost Summary */}
                      {formData.studentCount && (
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">Estimated Total Cost:</span>
                              <span className="text-2xl font-bold text-primary">
                                <IndianRupee className="h-5 w-5 inline" />
                                {calculateTotalCost().toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              For {formData.studentCount} student{parseInt(formData.studentCount) !== 1 ? 's' : ''}
                              {overnightNights > 0 && ` × ${overnightNights} night${overnightNights !== 1 ? 's' : ''}`}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {/* Documents */}
                  {/*<div className="space-y-4">
                    <h3 className="text-lg font-semibold">Required Documents</h3>
                    
                    <div>
                      <Label htmlFor="parentConsent">Parent Consent Form (PDF) *</Label>
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                            <div className="flex flex-col items-center gap-2">
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <div className="text-center">
                                <p className="text-sm font-medium">
                                  {fileName || 'Click to upload parent consent form'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  PDF format, max 10MB
                                </p>
                              </div>
                            </div>
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleFileUpload}
                            required
                          />
                        </label>
                      </div>
                    </div>
                  </div>*/}

                  {/* Submit */}
                  <div className="flex gap-4">
                    <Button type="submit" variant="forest" className="flex-1">
                      Submit Enquiry
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate('/eco-centres')}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SchoolRegister;
