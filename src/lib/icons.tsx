import React from "react";
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  GraduationCap,
  HeartPulse,
  Receipt,
  Sparkles,
  Tv,
  MoreHorizontal,
  Briefcase,
  Building,
  Laptop,
  Wallet,
  TrendingUp,
  PlusCircle,
  Coffee,
  Home,
  Plane,
  ShieldCheck,
  Smartphone,
  Bike,
  Gift,
  DollarSign,
  CreditCard,
  Target,
  LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  GraduationCap,
  HeartPulse,
  Receipt,
  Sparkles,
  Tv,
  MoreHorizontal,
  Briefcase,
  Building,
  Laptop,
  Wallet,
  TrendingUp,
  PlusCircle,
  Coffee,
  Home,
  Plane,
  ShieldCheck,
  Smartphone,
  Bike,
  Gift,
  DollarSign,
  CreditCard,
  Target,
};

export function CategoryIcon({
  name,
  className = "w-5 h-5",
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = ICON_MAP[name] || MoreHorizontal;
  return <IconComponent className={className} />;
}
