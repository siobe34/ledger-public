import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { type InputHTMLAttributes } from "react";

type TableSearchProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
} & InputHTMLAttributes<HTMLInputElement>;

export const TableSearch = ({
  search,
  setSearch,
  ...props
}: TableSearchProps) => {
  return (
    <div className="group flex items-center">
      <SearchIcon className="absolute translate-x-3 text-foreground/30 group-focus-within:text-foreground" />
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search Table..."
        className="my-2 pl-10 sm:w-fit"
        {...props}
      />
    </div>
  );
};
