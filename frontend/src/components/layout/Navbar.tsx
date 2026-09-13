import { Link } from "react-router-dom";
import { Activity, Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <Link to="/" className="font-bold text-xl tracking-tight hidden sm:inline-block">
            MediVision AI
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link to="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
          <Link to="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
          <Link to="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQs</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">
            Log in
          </Link>
          <Link to="/dashboard" className={buttonVariants({ variant: "default" })}>Start Free Analysis</Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
