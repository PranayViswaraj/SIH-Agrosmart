import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

export default function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="h-9 w-9 p-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <img src="/logo.png" alt="AgroSmart" className="h-8 w-8" />
          <h1 className="text-xl font-bold text-agro-green">
            AgroSmart — Farm Dashboard
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium">Farm Manager</p>
            <p className="text-xs text-muted-foreground">Jorethang, South Sikkim</p>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-agro-green text-white">FM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}