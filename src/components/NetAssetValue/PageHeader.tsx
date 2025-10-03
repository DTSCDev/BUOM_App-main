
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info } from "lucide-react";

export function PageHeader() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Net Asset Value</h1>
            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Customizable Feature</h4>
                  <p className="text-sm text-muted-foreground">
                    You can customize this page by adding new cards or changing card headers to reflect your specific financial situation.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-muted-foreground">Track and manage your assets and liabilities</p>
        </div>
        <Badge variant="secondary" className="bg-yellow-200 text-amber-800">
          Premium Feature - Free for 30 days
        </Badge>
      </div>
    </div>
  );
}
