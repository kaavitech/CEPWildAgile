import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Download, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ThankYou = () => {
  const location = useLocation();
  const eventCode = location.state?.eventCode || 'CED-2025-XXX';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Registration Successful!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for registering your school with the CEP
            </p>

            <Card className="shadow-medium mb-8">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Your Event Code</p>
                    <div className="text-3xl font-bold text-primary">{eventCode}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Please save this code for future reference. Our team will review your request 
                    and contact you within 2-3 business days.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">What Happens Next?</h2>
              
              <Card className="text-left shadow-soft">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Review & Approval</h3>
                        <p className="text-sm text-muted-foreground">
                          Our admin team will review your registration and verify all details
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Confirmation Email</h3>
                        <p className="text-sm text-muted-foreground">
                          You'll receive an email with visit details, assigned eco centre, and coordinator contacts
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Pre-Visit Briefing</h3>
                        <p className="text-sm text-muted-foreground">
                          Our coordinator will contact you to discuss logistics, safety protocols, and schedule
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" variant="forest">
                  Return to Home
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions or need to make changes to your registration, 
                please contact us at:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> info@childedprogram.org
                </p>
                <p>
                  <strong>Phone:</strong> +91-9876543210
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
