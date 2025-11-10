import { Link, useLocation } from "react-router-dom";
import { Package, QrCode, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
        >
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            B-Express
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Button
            variant={isActive("/") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link
              to="/"
              className={cn(
                "flex items-center gap-2",
                isActive("/") && "font-semibold"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
          <Button
            variant={isActive("/bombanas") ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link
              to="/bombanas"
              className={cn(
                "flex items-center gap-2",
                isActive("/bombanas") && "font-semibold"
              )}
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Bombanas</span>
            </Link>
          </Button>
          {/* <Button
            variant={isActive("/scanner") ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link to="/scanner" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">Scanner</span>
            </Link>
          </Button> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
