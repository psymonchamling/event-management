import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Users,
  Zap,
  ShieldCheck,
  BarChart3,
  Mail,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Easy Event Creation",
    description:
      "Create events in minutes with an intuitive, drag-and-drop event builder.",
  },
  {
    icon: Users,
    title: "Attendee Management",
    description:
      "Manage registrations, ticket sales, and attendee engagement effortlessly.",
  },
  {
    icon: Mail,
    title: "Automated Marketing",
    description:
      "Reach your audience with email campaigns and social media integration.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track event performance and attendee insights with comprehensive dashboards.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security to protect your event data and attendee information.",
  },
  {
    icon: Zap,
    title: "Powerful Integrations",
    description:
      "Connect with payment processors, CRM tools, and streaming platforms.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="w-full py-20 md:py-32 bg-secondary/30 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
            Everything You Need to Host Great Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Powerful features designed to help you create memorable events,
            engage attendees, and measure success.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="border-border hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
