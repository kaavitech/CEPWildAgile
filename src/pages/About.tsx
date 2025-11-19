import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { TreePine, Users, Target, Heart, Eye, Lightbulb, CheckCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const programObjectives = [
  "Connect children with nature through hands-on forest experiences",
  "Build environmental consciousness from a young age",
  "Promote biodiversity awareness and conservation",
  "Develop sustainable practices in the next generation",
  "Create memorable learning experiences outside classrooms",
];

const workflowPhases = [
  {
    value: "planning",
    title: "Phase 1: Planning & Preparation",
    summary: "Key Activities:",
    items: [
      "Eco centre reconnaissance and safety assessment",
      "School and guest lecturer mapping",
      "Permission acquisition from Forest Department",
      "SOP definition for pre-event, during event, and return",
      "Logistics planning (buses, materials, first aid)",
      "Communication setup (WhatsApp groups, coordinator assignment)",
    ],
  },
  {
    value: "outreach",
    title: "Phase 2: Sales & Outreach",
    summary: "Engagement Strategy:",
    items: [
      "Direct school engagement and presentations",
      "DEO/BEO partnership development",
      "CSR collaboration for funding and support",
      "Promotional material distribution",
      "Registration and consent collection",
    ],
  },
  {
    value: "execution",
    title: "Phase 3: Event Execution",
    summary: "Event Day Flow:",
    items: [
      "Pre-departure: attendance, safety briefing, bus boarding",
      "At eco centre: welcome briefing and trail walk with guides",
      "Activities: guest lecture and interactive sessions",
      "Safety: first aid readiness, hygiene protocols, contingency plans",
      "Return: attendance check and safe drop-off at school",
    ],
  },
  {
    value: "post-event",
    title: "Phase 4: Post-Event & Documentation",
    summary: "Follow-up Actions:",
    items: [
      "Feedback collection from students and teachers",
      "Photo and video documentation",
      "Report preparation for stakeholders",
      "Social media content creation (with permissions)",
      "Administrative record keeping",
    ],
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Our Program</h1>
              <p className="text-xl opacity-95">
                Empowering the next generation through experiential environmental education
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Why the Child Education Program Exists</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Child Education Program is a collaborative initiative between the Maharashtra Forest Department
                and WildAgile Foundation, connecting children with nature through immersive, hands-on experiences
                in protected forest areas and wildlife sanctuaries. Early exposure to nature fosters lifelong environmental
                stewardship, so each visit blends guided trails, wildlife observation, and sessions with conservation experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-primary/20 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="text-primary" size={32} />
                    <h3 className="text-2xl font-semibold">Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To create a generation of environmentally conscious citizens who understand the importance of forest
                    conservation and biodiversity, fostering a deep connection with nature from childhood.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20 h-full">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="text-secondary" size={32} />
                    <h3 className="text-2xl font-semibold">Mission</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    To facilitate structured, safe, and engaging forest visits for school children, providing hands-on learning
                    about ecology, wildlife, and sustainable practices through expert-guided programs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stakeholders */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Stakeholders</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <TreePine className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Maharashtra Forest Department</h3>
                  <p className="text-muted-foreground">
                    Provides access to eco centres, forest officers for guidance, safety infrastructure, 
                    and ensures compliance with conservation regulations.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                    <Heart className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">WildAgile Foundation</h3>
                  <p className="text-muted-foreground">
                    Manages program coordination, school registrations, logistics, guest lecturer arrangements, 
                    and educational content development.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Participating Schools</h3>
                  <p className="text-muted-foreground">
                    Partner with us to provide students with transformative outdoor learning experiences, 
                    integrating curriculum with real-world conservation efforts.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full bg-earth/10 flex items-center justify-center mb-4">
                    <Target className="h-7 w-7 text-earth" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Guest Lecturers</h3>
                  <p className="text-muted-foreground">
                    Wildlife biologists, ecologists, and conservation experts share their knowledge and 
                    inspire students through engaging presentations and field demonstrations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Program Objectives */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex p-3 bg-accent/10 rounded-2xl mb-4">
                  <Lightbulb className="text-accent" size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-3">Program Objectives</h2>
                <p className="text-muted-foreground text-lg">Our key goals for environmental education</p>
              </div>

              <div className="space-y-4">
                {programObjectives.map((objective, index) => (
                  <div
                    key={objective}
                    className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow"
                  >
                    <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                    <p className="text-foreground">{objective}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Program Workflow 
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Program Workflow</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {workflowPhases.map((phase) => (
                  <AccordionItem key={phase.value} value={phase.value} className="bg-card rounded-xl border px-6">
                    <AccordionTrigger className="text-lg font-semibold hover:text-primary">
                      {phase.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-2 pt-4">
                      <p className="font-medium text-foreground">{phase.summary}</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        {phase.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>*/}
      </main>

      <Footer />
    </div>
  );
};

export default About;
