import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons/arrow-icons";
import { Typography } from "@/components/ui/typography";

export const ButtonsSection = () => {
  return (
    <section>
      <Card>
        <Typography variant="h2" className="mb-4">
          Buttons
        </Typography>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="tertiary">Tertiary Button</Button>
          <Button variant="primary" disabled>
            Disabled Button
          </Button>
          <Button variant="primary" isLoading>
            Loading Button
          </Button>
          <Button variant="primary" leftIcon={<ArrowLeftIcon />}>
            With Left Icon
          </Button>
          <Button variant="primary" rightIcon={<ArrowRightIcon />}>
            With Right Icon
          </Button>
        </div>
      </Card>
    </section>
  );
};
