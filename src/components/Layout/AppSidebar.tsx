
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { LucideIcon } from "lucide-react";
import {
  Home,
  User,
  LogOut,
  TrendingUp,
  CreditCard,
  FileText,
  BarChart,
  Star,
  Clipboard,
  Database,
  Calculator,
  ChevronDown,
  ChevronRight,
  Shield,
  Target,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ProfileIdentityHeader from "./ProfileIdentityHeader";
import { useState } from "react";

interface NavItem {
  title: string;
  icon: LucideIcon;
  href?: string;
  isPremium?: boolean;
  isAdminOnly?: boolean;
  children?: NavItem[];
}

export function AppSidebar() {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Check if user is system administrator (creator or authorized admin)
  const isSystemAdmin = user?.email === 'sensay176@gmail.com' || user?.email?.endsWith('@lovable.dev');

  const navItems: NavItem[] = [
    {
      title: "BUOM Hub",
      icon: Target,
      href: "/buom-hub",
    },
    {
      title: "APF",
      icon: Star,
      children: [
        {
          title: "Dashboard",
          icon: Home,
          href: "/apf/dashboard",
        },
        {
          title: "Registration",
          icon: Clipboard,
          href: "/apf-registration",
        },
        {
          title: "Plan Overview",
          icon: FileText,
          href: "/apf/plan-overview",
        },
      ]
    },
    {
      title: "Calculator Hub",
      icon: Calculator,
      children: [
        {
          title: "Calculator Guide",
          icon: Home,
          href: "/calculator_hub",
        },
        {
          title: "Retirement Calculator",
          icon: Calculator,
          href: "/calculator_hub/retirement_calculator",
        },
        {
          title: "Plan C",
          icon: FileText,
          href: "/calculator_hub/plan_c",
        },
        {
          title: "Director Earnings",
          icon: TrendingUp,
          href: "/calculator_hub/director_earnings",
        },
        {
          title: "Max Pension Funding",
          icon: Star,
          href: "/calculator_hub/max_pension_funding",
        },
        {
          title: "Parameter Settings",
          icon: Settings,
          href: "/calculator_hub/parameter_settings",
        },
      ]
    },
    {
      title: "FREE Benefits",
      icon: Star,
      href: "/get-started",
    },
    {
      title: "Net Asset Value",
      icon: TrendingUp,
      href: "/net-asset-value",
      isPremium: true
    },
    {
      title: "Payments",
      icon: CreditCard,
      href: "/payments",
      isPremium: true
    },
    {
      title: "Statements",
      icon: FileText,
      href: "/statements",
      isPremium: true
    },
    {
      title: "Reports",
      icon: BarChart,
      href: "/reports",
      isPremium: true
    },
    {
      title: "System Fields",
      icon: Database,
      href: "/system-fields",
      isAdminOnly: true
    },
    {
      title: "SFM Audit",
      icon: Database,
      href: "/sfm-audit",
      isAdminOnly: true
    },
    {
      title: "My Details",
      icon: User,
      href: "/profile",
    },
    {
      title: "Security",
      icon: Shield,
      href: "/security",
    },
  ];

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => {
    if (item.isAdminOnly) {
      return isSystemAdmin;
    }
    return true;
  });

  // Debug function for path matching
  const isActive = (path: string) => {
    const exactMatch = location.pathname === path;
    return exactMatch;
  }

  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some(child => child.href && isActive(child.href));
    }
    return false;
  }

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle);
      } else {
        newSet.add(groupTitle);
      }
      return newSet;
    });
  };

  const isGroupExpanded = (item: NavItem) => {
    // Always show children if the parent route is active
    const parentActive = isParentActive(item);
    return parentActive || expandedGroups.has(item.title);
  };

  return (
    <Sidebar className="bg-white border-r border-gray-200">
      <SidebarHeader className="px-3 py-2">
        <ProfileIdentityHeader />
      </SidebarHeader>
      <SidebarContent className="text-[#030227]">
        <SidebarMenu>
          {filteredNavItems.map((item) => {
            if (item.children) {
              const parentActive = isParentActive(item);
              const expanded = isGroupExpanded(item);
              return (
                <SidebarMenuItem key={item.title} className="space-y-2">
                  <SidebarMenuButton
                    onClick={() => toggleGroup(item.title)}
                    className={`
                      flex items-center w-full px-3 py-2 text-[#030227] font-semibold hover:bg-[#030227]/10 cursor-pointer
                      ${parentActive ? "bg-[#030227]/10" : ""}
                    `}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuButton>
                  {expanded && (
                    <SidebarMenuSub className="ml-6 space-y-1">
                      {item.children.map((child) => {
                        const childActive = child.href ? isActive(child.href) : false;
                        return (
                          <SidebarMenuItem key={child.href || child.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={childActive}
                              tooltip={child.title}
                              className={`
                                flex items-center w-full transition-colors
                                ${childActive 
                                  ? "bg-[#030227]/10 text-[#030227]" 
                                  : "text-[#030227] hover:bg-[#030227]/10"
                                }
                              `}
                            >
                              <Link to={child.href || '#'} className="flex items-center w-full">
                                <child.icon className="text-[#030227] mr-2 h-4 w-4" />
                                <span className={`flex-1 text-left text-[#030227] ${childActive ? "font-bold" : "font-normal"}`}>
                                  {child.title}
                                </span>
                                {child.isPremium && (
                                  <span className="ml-auto text-xs bg-[#4FF456] text-gray-700 font-bold px-1.5 py-0.5 rounded">PRO</span>
                                )}
                                {child.isAdminOnly && (
                                  <span className="ml-auto text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded">ADMIN</span>
                                )}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              );
            } else {
              const active = item.href ? isActive(item.href) : false;
              return (
                <SidebarMenuItem key={item.href || item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    tooltip={item.title}
                    className={`
                      flex items-center w-full transition-colors
                      ${active 
                        ? "bg-[#030227]/10 text-[#030227]" 
                        : "text-[#030227] hover:bg-[#030227]/10"
                      }
                    `}
                  >
                    <Link to={item.href || '#'} className="flex items-center w-full">
                      <item.icon className="text-[#030227] mr-2" />
                      <span className={`flex-1 text-left text-[#030227] ${active ? "font-bold" : "font-normal"}`}>
                        {item.title}
                      </span>
                      {item.isPremium && (
                        <span className="ml-auto text-xs bg-[#4FF456] text-gray-700 font-bold px-1.5 py-0.5 rounded">PRO</span>
                      )}
                      {item.isAdminOnly && (
                        <span className="ml-auto text-xs bg-red-500 text-white font-bold px-1.5 py-0.5 rounded">ADMIN</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }
          })}
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Logout" 
              onClick={signOut}
              className="text-[#030227] hover:bg-[#030227]/10"
            >
              <LogOut className="text-[#030227]" />
              <span className="text-[#030227] font-normal">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-0">
        <div className="px-3 py-2 space-y-1">
          <div className="flex items-center justify-start">
            <img 
              src="/buom-logo.png" 
              alt="BUOM Logo" 
              className="h-6 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-left text-[#030227]">
            © {new Date().getFullYear()} BUOM
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
