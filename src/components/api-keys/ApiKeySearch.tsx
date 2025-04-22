
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ApiKeySearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ApiKeySearch = ({ value, onChange }: ApiKeySearchProps) => {
  return (
    <div className="relative w-full sm:w-96">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search API keys..."
        className="pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

