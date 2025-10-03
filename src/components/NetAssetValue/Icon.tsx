
import React from "react";
import { LucideProps } from "lucide-react";
import { 
  PiggyBank, 
  Home, 
  TrendingUp, 
  Banknote, 
  Package,
  Building, 
  CreditCard,
  AlertCircle,
  Menu
} from "lucide-react";

const icons = {
  "piggy-bank": PiggyBank,
  "home": Home,
  "trending-up": TrendingUp,
  "banknote": Banknote,
  "package": Package,
  "building": Building,
  "credit-card": CreditCard,
  "alert-circle": AlertCircle,
  "menu": Menu
};

export type IconName = keyof typeof icons;

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName | string;
}

export function Icon({ name, ...props }: IconProps) {
  // Default to Package icon if the requested icon doesn't exist
  const IconComponent = icons[name as IconName] || Package;
  
  return <IconComponent {...props} />;
}
