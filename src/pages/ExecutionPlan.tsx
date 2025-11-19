import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ClipboardList, Map, Rocket, RotateCcw, Download } from "lucide-react";

const planSections = [
  {
    phase: "1. Planning",
    summary: "Prep work with schools, forest teams, logistics partners, and parents before the visit.",
    icon: ClipboardList,
    subsections: [
      {
        title: "1.1 Preparation",
        bullets: [
          "Consolidate latest list of priority schools shared by Forest Department.",
          "Conduct recon of eco centres for safety, washrooms, and hospital proximity.",
          "Map schools ↔ eco centres, eco centres ↔ guest lecturers, coordinators ↔ routes.",
        ],
      },
      {
        title: "1.2 Event Date Finalization",
        bullets: [
          "Sync calendars with school, eco centre focal point, guest lecturer, and forest division.",
          "Lock travel window factoring bus availability and weather alerts.",
        ],
      },
      {
        title: "1.3 Permissions & Compliance",
        bullets: [
          "Collect written permissions from Forest Department and inform local RFO/Beat office.",
          "Gather parent consent forms and ID proofs; circulate Do's & Don'ts kit.",
        ],
      },
      {
        title: "1.4 SOP Definition",
        bullets: [
          "Pre-event checks: bus inspection, attendance, safety briefing.",
          "During-event protocols: trail pacing, waste management, hydration checkpoints.",
          "Post-event wrap: attendance, teacher feedback, social media guidelines.",
        ],
      },
      {
        title: "1.5 Logistics & Materials",
        bullets: [
          "Plan gifts, activities, stationery, waste bags, first aid, ID stickers, and water.",
          "Maintain backups: alternate lecturers, spare eco centres, indoor activity plan.",
        ],
      },
      {
        title: "1.6 Communication Planning",
        bullets: [
          "Spin up WhatsApp triads (NGO+Teachers, NGO+Forest, NGO+Driver).",
          "Assign NGO micro-roles: Transport, School Lead, Forest Liaison, Safety, Documentation.",
        ],
      },
    ],
  },
  {
    phase: "2. Sales / Outreach",
    summary: "Pipeline building with schools, government stakeholders, and CSR allies.",
    icon: Map,
    subsections: [
      {
        title: "2.1 School Engagement",
        bullets: [
          "Active outreach and relationship nurturing with shortlisted schools.",
          "Share eco centre menu, activity list, costing, and FAQ packs.",
        ],
      },
      {
        title: "2.2 Partnerships",
        bullets: [
          "Coordinate with DEO, BEO, and cluster heads for nominations.",
          "Request official circulars for wider reach.",
        ],
      },
      {
        title: "2.3 Marketing",
        bullets: [
          "Run social promos, short films, and brochures.",
          "Align with CSR partners for sponsorship pools.",
        ],
      },
    ],
  },
  {
    phase: "3. Execution (Event Day)",
    summary: "Minute-by-minute orchestration from bus roll-out to safe return.",
    icon: Rocket,
    subsections: [
      {
        title: "3.1 Pre-departure",
        bullets: [
          "Bus reporting & inspection with final attendance.",
          "Issue student ID stickers and group allocations.",
        ],
      },
      {
        title: "3.2 At the Eco Centre",
        bullets: [
          "Host welcome and safety briefing with forest staff.",
          "Lead trail walk, guest lecturer sessions, and storytelling/recordings.",
        ],
      },
      {
        title: "3.3 Hygiene & Safety",
        bullets: [
          "Ensure zero waste, first-aid readiness, and hydration monitoring.",
        ],
      },
      {
        title: "3.4 Contingencies",
        bullets: [
          "Keep replacement lecturer/NGO team on standby.",
          "Arrange backup bus support and indoor activity for bad weather.",
        ],
      },
      {
        title: "3.5 Return",
        bullets: [
          "Final attendance, documentation, and safe handover to school authorities.",
        ],
      },
    ],
  },
  {
    phase: "4. Post-Event",
    summary: "Feedback, reporting, finance closures, and storytelling within permitted channels.",
    icon: RotateCcw,
    subsections: [
      {
        title: "4.1 Feedback",
        bullets: [
          "Collect inputs from schools, teachers, and students.",
          "Secure testimonies on letterheads where possible.",
        ],
      },
      {
        title: "4.2 Documentation",
        bullets: [
          "Compile bi-weekly and monthly reports plus curated media bank.",
          "Share final summary with Forest Department.",
        ],
      },
      {
        title: "4.3 Administration",
        bullets: [
          "Raise invoices, update master tracker, send thank-you letters.",
        ],
      },
      {
        title: "4.4 Social Media",
        bullets: [
          "Publish only permitted content after approvals; respect embargo windows.",
        ],
      },
    ],
  },
];

const ExecutionPlan = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-forest text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                End-to-End Event Execution Plan
              </h1>
              <p className="text-xl opacity-95">
                A proven operating model that keeps every eco centre visit safe, engaging, and
                well-documented. Each phase below mirrors the actual workflow used by our teams and
                the Forest Department partners.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="secondary" className="gap-2">
                  <a href="/Event_Execution_Plan.docx" download>
                    <Download className="h-4 w-4" />
                    Download official plan (DOCX)
                  </a>
                </Button>
                <Button asChild variant="secondary" className="gap-2">
                  <a href="/downloads/Master_Tracker.xlsx" download>
                    <Download className="h-4 w-4" />
                    Master Tracker.xlsx
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Phase overview */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Execution Phases</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our comprehensive four-phase approach ensures every event is well-planned, safely executed, and properly documented.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {planSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Card key={section.phase} className="h-full shadow-soft border border-border/60">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-wide text-muted-foreground">{section.phase}</p>
                          <p className="text-lg font-semibold text-foreground">What happens</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{section.summary}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Deep dive accordion */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Detailed Playbook</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {planSections.map((section) => (
                  <AccordionItem key={section.phase} value={section.phase} className="bg-card rounded-2xl border px-6">
                    <AccordionTrigger className="text-lg font-semibold">{section.phase}</AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-6 text-muted-foreground">
                      {section.subsections.map((subsection) => (
                        <div key={subsection.title}>
                          <p className="font-semibold text-foreground">{subsection.title}</p>
                          <ul className="list-disc list-inside space-y-1 mt-2">
                            {subsection.bullets.map((bullet) => (
                              <li key={bullet}>{bullet}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Downloads */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center space-y-4">
              <h2 className="text-3xl font-bold mb-6">Download Planning Templates</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Use the same trackers and templates as the Forest Department partners for quick implementation.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline">
                  <a href="/downloads/Master_Tracker.xlsx" download>
                    Master Tracker.xlsx
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/downloads/sample_event_summary.pdf" download>
                    Sample Event Summary.pdf
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/downloads/sample_parent_contacts.csv" download>
                    Parent Contacts.csv
                  </a>
                </Button>
                <Button asChild variant="secondary">
                  <a href="/Event_Execution_Plan.docx" download>
                    Event Execution Plan.docx
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ExecutionPlan;

