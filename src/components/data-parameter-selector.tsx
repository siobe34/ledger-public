import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DataParameterSelector = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 text-sm sm:flex-row sm:items-end sm:px-0">
      {/* TODO: i like my outline buttons to have a bg-primary on hover */}
      <Button variant="outline">Refresh Table</Button>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex flex-col items-center justify-center gap-1"
            asChild
          >
            <div>
              <DropdownMenuLabel>Year</DropdownMenuLabel>
              {/* <Label htmlFor="year">Year</Label> */}
              <Button name="year">2025</Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent loop align="center">
            <DropdownMenuItem className="justify-center">2023</DropdownMenuItem>
            <DropdownMenuItem className="justify-center">2024</DropdownMenuItem>
            <DropdownMenuItem className="justify-center">2025</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <div className="flex flex-col items-center justify-center">
          <Label className="pb-1" htmlFor="year">
            Year
          </Label>
          <Button name="year">2025</Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Label className="pb-1" htmlFor="month">
            Month
          </Label>
          <Button name="month">March</Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Label className="pb-1" htmlFor="user">
            User
          </Label>
          <Button name="user">All</Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Label className="pb-1" htmlFor="account">
            Account
          </Label>
          <Button name="account">All</Button>
        </div> */}
      </div>
    </div>
  );
};
