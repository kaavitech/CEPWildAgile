import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import bandipurImg from '@/assets/bandipur.jpg';
import nagarholeImg from '@/assets/nagarhole.jpg';
import dandeliImg from '@/assets/dandeli.jpg';
import heroImg from '@/assets/hero-children-forest.jpg';

const Gallery = () => {
  const galleryItems = [
    {
      id: 1,
      image: heroImg,
      title: 'Nature Trail Experience',
      category: 'Activities',
      description: 'World exploring forest trails with experienced guides'
    },
    {
      id: 2,
      image: bandipurImg,
      title: 'Bandipur Forest Reserve',
      category: 'Eco Centres',
      description: 'Scenic view of dense forest and wildlife habitat'
    },
    {
      id: 3,
      image: nagarholeImg,
      title: 'Wildlife Observation',
      category: 'Activities',
      description: 'Elephants spotted during eco-centre visit'
    },
    {
      id: 4,
      image: dandeliImg,
      title: 'Dandeli River Adventures',
      category: 'Eco Centres',
      description: 'Beautiful river flowing through forest landscape'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Gallery</h1>
              <p className="text-xl opacity-95">
                Moments captured from our eco-centre visits and activities
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Photo Gallery</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore images from our educational visits and see the impact of our program on world.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {galleryItems.map((item) => (
                <Card key={item.id} className="shadow-soft hover:shadow-medium transition-all overflow-hidden group">
                  <div 
                    className="h-64 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${item.image})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <CardContent className="pt-6">
                    <Badge className="mb-3">{item.category}</Badge>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center max-w-4xl mx-auto">
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Want to see your world's photos featured here?
              </p>
              <a href="/school/register">
                <button className="bg-gradient-forest text-primary-foreground px-6 py-3 rounded-md hover:opacity-90 transition-opacity">
                  Send Enquiry
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;
