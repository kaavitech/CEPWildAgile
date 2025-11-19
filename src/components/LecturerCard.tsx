import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, BookOpenCheck, CalendarDays } from "lucide-react";
import type { Lecturer } from "@/lib/mockData";

const gradients = [
  "from-emerald-500 to-lime-500",
  "from-cyan-500 to-blue-500",
  "from-rose-500 to-orange-500",
  "from-purple-500 to-indigo-500",
];

const LecturerCard = ({ lecturer, index }: { lecturer: Lecturer; index: number }) => {
  const gradient = gradients[index % gradients.length];

  return (
    <Card className="shadow-soft hover:shadow-medium transition-all overflow-hidden flex flex-col">
      <div className={`h-40 bg-gradient-to-r ${gradient} relative`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <Badge className="bg-white/90 text-foreground">
            <BookOpenCheck className="h-3.5 w-3.5 mr-1 text-primary" />
            Guest Lecturer
          </Badge>
        </div>
      </div>

      <CardHeader>
        <h3 className="text-xl font-semibold">{lecturer.name}</h3>
        <p className="text-sm text-muted-foreground">{lecturer.expertise}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{lecturer.bio}</p>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-primary/80">Availability</p>
          <div className="flex flex-wrap gap-2">
            {lecturer.availability.map((slot) => (
              <Badge
                key={slot}
                variant="outline"
                className="border-primary/20 text-primary bg-primary/5"
              >
                <CalendarDays className="h-3.5 w-3.5 mr-1" />
                {slot}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
          <Phone className="h-4 w-4 text-primary" />
          <span>{lecturer.phone}</span>
        </div>
        <Button variant="forest" className="w-full">
          Request Session
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LecturerCard;

