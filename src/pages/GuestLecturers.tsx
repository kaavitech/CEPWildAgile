import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LecturerCard from "@/components/LecturerCard";
import { mockLecturers } from "@/lib/mockData";
import { Users, BookOpenCheck } from "lucide-react";

const GuestLecturers = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Affiliated Experts</h1>
              <p className="text-xl opacity-95">
                Verified educators, naturalists, and conservationists who accompany every eco centre visit to make
                learning memorable and aligned with the Forest Department curriculum.
              </p>
            </div>
          </div>
        </section>

        {/* Lecturers Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Expert Network</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Each expert brings specialized knowledge and field experience to create engaging, educational experiences for world.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {mockLecturers.map((lecturer, index) => (
                <LecturerCard key={lecturer.id} lecturer={lecturer} index={index} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GuestLecturers;

