import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/Label";
import { Typography } from "@/components/ui/Typography";

export const LabelsSection = () => {
  return (
    <section>
      <Card>
        <Typography variant="h2" className="mb-4">
          Labels
        </Typography>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Default Label</Label>
            <Label size="sm">Small Label</Label>
            <Label size="lg">Large Label</Label>
          </div>

          <div className="space-y-2">
            <Label weight="normal">Normal Weight</Label>
            <Label weight="medium">Medium Weight</Label>
            <Label weight="semibold">Semibold Weight</Label>
          </div>

          <div className="space-y-2">
            <Label required>Required Label</Label>
            <Label optional>Optional Label</Label>
            <Label error>Error Label</Label>
            <Label disabled>Disabled Label</Label>
          </div>

          <div className="space-y-2">
            <Label
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
            >
              Label with Icon
            </Label>
            <Label tooltip="This is a helpful tooltip">Label with Tooltip</Label>
          </div>
        </div>
      </Card>
    </section>
  );
};
