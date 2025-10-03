
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CalendarClock className="w-12 h-12 text-muted-foreground" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description || "This feature is coming soon. Check back later!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>We're working hard to bring you this functionality.</p>
      </CardContent>
    </Card>
  );
}
