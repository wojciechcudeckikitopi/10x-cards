import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";

export function DropdownMenuSection() {
  return (
    <section>
      <Card>
        <Typography variant="h2" className="mb-4">
          Dropdown Menus
        </Typography>
        <div className="space-y-8">
          {/* Basic Dropdown */}
          <div>
            <Typography variant="h3" className="mb-2">
              Basic Dropdown
            </Typography>
            <DropdownMenu>
              <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => console.log("New Tab")}>New Tab</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => console.log("New Window")}>New Window</DropdownMenuItem>
                <DropdownMenuItem disabled>New Private Window</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Dropdown with Label and Separator */}
          <div>
            <Typography variant="h3" className="mb-2">
              With Label and Separator
            </Typography>
            <DropdownMenu>
              <DropdownMenuTrigger>Account Settings</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Aligned Dropdown */}
          <div>
            <Typography variant="h3" className="mb-2">
              Different Alignments
            </Typography>
            <div className="flex gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger>Align Start</DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Option 1</DropdownMenuItem>
                  <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger>Align Center</DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem>Option 1</DropdownMenuItem>
                  <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger>Align End</DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Option 1</DropdownMenuItem>
                  <DropdownMenuItem>Option 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
