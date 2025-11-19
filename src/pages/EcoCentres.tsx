import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EcoCentreCard from '@/components/EcoCentreCard';
import { mockEcoCentres } from '@/lib/mockData';

const EcoCentres = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCentres = mockEcoCentres.filter(centre =>
    centre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centre.location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Eco Centres Directory</h1>
              <p className="text-xl opacity-95">
                Discover our network of pristine forest reserves and wildlife sanctuaries across Maharashtra
              </p>
            </div>
          </div>
        </section>

        {/* Centres Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Explore Our Eco Centres</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Each eco centre offers unique experiences in protected forest areas, providing safe and engaging
                educational opportunities for students to connect with nature and learn about conservation.
              </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Centres Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCentres.map((centre) => (
                <EcoCentreCard key={centre.id} centre={centre} />
              ))}
            </div>

            {filteredCentres.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No eco centres found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EcoCentres;
