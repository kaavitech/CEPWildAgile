import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import EcoCentres from "./pages/EcoCentres";
import EcoCentreDetail from "./pages/EcoCentreDetail";
import SchoolRegister from "./pages/SchoolRegister";
import ThankYou from "./pages/ThankYou";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import GuestLecturers from "./pages/GuestLecturers";
import ExecutionPlan from "./pages/ExecutionPlan";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/eco-centres" element={<EcoCentres />} />
          <Route path="/eco-centres/:id" element={<EcoCentreDetail />} />
          <Route path="/school/register" element={<SchoolRegister />} />
          <Route path="/school/thank-you" element={<ThankYou />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/lecturers" element={<GuestLecturers />} />
          <Route path="/execution-plan" element={<ExecutionPlan />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
