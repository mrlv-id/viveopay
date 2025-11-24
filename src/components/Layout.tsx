import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactNode, useEffect, useState } from "react";
import { User, HelpCircle, Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoViveo from "@/assets/logo-viveo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
interface LayoutProps {
  children: ReactNode;
}
export function Layout({
  children
}: LayoutProps) {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    full_name: string;
    avatar_url: string | null;
  } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const {
        data
      } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
      if (data) {
        setProfile(data);
      }
    };
    loadProfile();

    // Listener para atualizar avatar em tempo real
    const channel = supabase.channel('profile-changes').on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'profiles',
      filter: `id=eq.${user?.id}`
    }, payload => {
      setProfile(payload.new as any);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {profile ? getInitials(profile.full_name) : 'PF'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-medium text-foreground">
                      {profile?.full_name || 'Usuário'}
                    </p>
                    <p className="text-xs text-muted-foreground">PF</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover">
                <DropdownMenuItem onClick={() => navigate('/perfil')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/central-ajuda')} className="cursor-pointer">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Central de ajuda</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {isDarkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                      <span>Modo {isDarkMode ? 'noturno' : 'claro'}</span>
                    </div>
                    <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>;
}