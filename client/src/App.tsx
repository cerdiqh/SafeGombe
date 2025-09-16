import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { OnlineStatusProvider } from "@/hooks/use-online-status";
import Dashboard from "@/pages/dashboard";
import SafetyDashboard from "@/components/safety/SafetyDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/safety" component={SafetyDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <OnlineStatusProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </OnlineStatusProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
