import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { ArrowLeftIcon, ArrowRightIcon } from "../ui/icons/ArrowIcons";

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
