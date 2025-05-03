import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Typography } from "../ui/Typography";

export const DialogSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section>
      <Card>
        <Typography variant="h2" className="mb-4">
          Dialog
        </Typography>
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Example Dialog</DialogTitle>
            <DialogDescription>This is an example dialog component.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <Typography variant="body">Dialog content goes here</Typography>
          </DialogContent>
        </Dialog>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open Dialog
        </Button>
      </Card>
    </section>
  );
};
