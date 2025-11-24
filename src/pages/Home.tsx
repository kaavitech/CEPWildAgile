import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TreePine, Users, MapPin, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroImage from '@/assets/hero-children-forest.jpg';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative text-primary-foreground py-20 md:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Connecting World with Nature
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              An initiative by Forest Department Maharashtra to inspire the next generation of conservationists
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/school/register">
                <Button size="lg" className="bg-card text-card-foreground hover:bg-card/90 shadow-lg">
                  Send Enquiry
                </Button>
              </Link>
              <Link to="/eco-centres">
                <Button size="lg"  className="bg-card text-card-foreground hover:bg-card/90 shadow-lg">
                  Explore Eco Centres
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-2">2,500+</div>
                <div className="text-sm text-muted-foreground">People Impacted</div>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <MapPin className="h-12 w-12 text-secondary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-2">12</div>
                <div className="text-sm text-muted-foreground">Eco Centres</div>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <TreePine className="h-12 w-12 text-accent mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-2">45</div>
                <div className="text-sm text-muted-foreground">Events Scheduled</div>
              </CardContent>
            </Card>
            
            <Card className="text-center shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-earth mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Our Program</h2>
            <p className="text-lg text-muted-foreground">
              The CEP bridges classroom learning with hands-on nature experiences, 
              fostering environmental stewardship among people.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TreePine className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Immersive Learning</h3>
                <p className="text-muted-foreground">
                  World can explore eco centres with guided nature trails, wildlife spotting, and interactive sessions with conservation experts.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Guidance</h3>
                <p className="text-muted-foreground">
                  Forest officers and Affiliated Experts share their knowledge, inspiring students to become nature advocates.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft hover:shadow-medium transition-all">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Safe & Organized</h3>
                <p className="text-muted-foreground">
                  Every trip is carefully coordinated with trained staff, safety protocols, and emergency support systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-earth text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get Inspired?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
            Join hundreds of people bringing environmental education to life through our program.
          </p>
          <Link to="/school/register">
            <Button size="lg" className="bg-card text-card-foreground hover:bg-card/90 shadow-lg">
              Send Enquiry Today
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
