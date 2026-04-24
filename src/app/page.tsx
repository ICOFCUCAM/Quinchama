"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import AppLayout from "@/components/AppLayout";

export default function Home() {
  return (
    <TooltipProvider>
      <AppProvider>
        <AppLayout />
      </AppProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
}
