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
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { mockEcoCentres } from '@/lib/mockData';
import { toast } from 'sonner';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock validation
    if (!formData.schoolName || !formData.contactPerson || !formData.email || 
        !formData.contactPhone || !formData.studentCount || !formData.ecoCentre || 
        selectedDates.length === 0 || !fileName) {
      toast.error('Please fill all required fields');
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">School Registration</h1>
              <p className="text-xl opacity-95">
                Register your school to participate in our eco-centre education program
              </p>
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Registration Form</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Complete the form below to register your school for the Child Education Program. Our team will review your application and get back to you soon.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">

            <Card className="shadow-soft">
              <CardHeader>
                <h3 className="text-2xl font-semibold">Registration Details</h3>
                <p className="text-sm text-muted-foreground">All fields marked with * are required</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* School Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">School Information</h3>
                    
                    <div>
                      <Label htmlFor="schoolName">School Name *</Label>
                      <Input
                        id="schoolName"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        placeholder="Enter school name"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contactPerson">Principal/Contact Person *</Label>
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">Contact Number *</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="+91-XXXXXXXXXX"
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
                        placeholder="school@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="studentCount">Number of Students *</Label>
                      <Input
                        id="studentCount"
                        type="number"
                        value={formData.studentCount}
                        onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                        placeholder="Enter number of students"
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

                  {/* Documents */}
                  <div className="space-y-4">
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
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4">
                    <Button type="submit" variant="forest" className="flex-1">
                      Submit Registration
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
