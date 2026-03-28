import { LayoutDashboard, Users, MapPin, Sprout, BarChart3, CloudSun, FlaskConical, MessageSquare, TrendingUp, Bug, ShieldAlert, Lightbulb, Store, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Farmers", url: "/farmers", icon: Users },
  { title: "Farms", url: "/farms", icon: MapPin },
  { title: "Crops", url: "/crops", icon: Sprout },
];

const dataNav = [
  { title: "Weather", url: "/weather", icon: CloudSun },
  { title: "Soil Data", url: "/soil-data", icon: FlaskConical },
];

const predictionsNav = [
  { title: "Yield", url: "/predictions/yield", icon: BarChart3 },
  { title: "Pest & Disease", url: "/predictions/pest-disease", icon: Bug },
  { title: "Risk", url: "/predictions/risk", icon: ShieldAlert },
  { title: "Market", url: "/predictions/market", icon: Store },
  { title: "Recommendations", url: "/predictions/recommendations", icon: Lightbulb },
  { title: "Crop Suitability", url: "/predictions/crop-suitability", icon: TrendingUp },
];

const bottomNav = [
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const renderGroup = (label: string, items: typeof mainNav) => (
    <SidebarGroup key={label}>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest font-body">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span className="font-body text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center">
              <Sprout className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-base font-semibold text-sidebar-foreground">HarvesterAI</h1>
              <p className="text-[10px] text-sidebar-foreground/40 font-body">Smart Farming Platform</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg gradient-green flex items-center justify-center mx-auto">
            <Sprout className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="px-2">
        {renderGroup("Overview", mainNav)}
        {renderGroup("Data", dataNav)}
        {renderGroup("Predictions", predictionsNav)}
        {renderGroup("General", bottomNav)}
      </SidebarContent>
      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-[10px] text-sidebar-foreground/30 font-body text-center">© 2026 HarvesterAI</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
