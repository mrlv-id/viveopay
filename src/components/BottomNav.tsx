import { LayoutDashboard, Wallet, LineChart, Briefcase } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Carteira", url: "/carteira", icon: Wallet },
  { title: "Finanças", url: "/financas", icon: LineChart },
  { title: "Serviços", url: "/servicos", icon: Briefcase },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors"
            >
              <item.icon 
                className={`h-5 w-5 ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground"
                }`} 
              />
              <span 
                className={`text-xs ${
                  isActive 
                    ? "text-primary font-medium" 
                    : "text-muted-foreground"
                }`}
              >
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
