import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { useState } from "react";

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
