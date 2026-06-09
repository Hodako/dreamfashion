import * as React from "react";
import { Card } from "./card";

export interface StatCardProps {
  icon: React.ComponentType;
  label: string;
  value: string;
  tone?: "brand" | "warn" | "success" | "muted";
  big?: boolean;
}

export const StatCard = React.forwardRef<HTMLDivElement, StatcardProps>(
  ({ icon: Icon, label, value, tone = "brand", big }, ref) => {
    const toneCls = {
      brand: "from-primary/10 to-primary/5 text-primary",
      warn: "from-warning/15 to-warning/5 text-foreground",
      success: "from-success/15 to-success/5 text-success",
      muted: "from-muted to-secondary text-foreground",
    }[tone];

    return (
      <Card ref={ref} className={`p-3.5 bg-gradient-to-br ${toneCls} border-border/60`}>
        <div className="flex items-center gap-2 text-xs font-medium opacity-80">
          <Icon className="size-4" />
          <span>{label}</span>
        </div>
        <div className={`mt-1 font-bold ${big ? "text-2xl" : "text-lg"}`}>
          {value}
        </div>
      </Card>
    );
  }
);
StatCard.displayName = "StatCard";