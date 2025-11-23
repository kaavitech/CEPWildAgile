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
import Bookings from "./pages/Bookings";
import ActivityDetails from "./pages/ActivityDetails";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
import { StageRouteGuard } from "./components/StageRouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StageRouteGuard route="/"><Home /></StageRouteGuard>} />
          <Route path="/about" element={<StageRouteGuard route="/about"><About /></StageRouteGuard>} />
          <Route path="/eco-centres" element={<StageRouteGuard route="/eco-centres"><EcoCentres /></StageRouteGuard>} />
          <Route path="/eco-centres/:id" element={<StageRouteGuard route="/eco-centres/:id"><EcoCentreDetail /></StageRouteGuard>} />
          <Route path="/school/register" element={<StageRouteGuard route="/school/register"><SchoolRegister /></StageRouteGuard>} />
          <Route path="/school/thank-you" element={<StageRouteGuard route="/school/thank-you"><ThankYou /></StageRouteGuard>} />
          <Route path="/contact" element={<StageRouteGuard route="/contact"><Contact /></StageRouteGuard>} />
          <Route path="/gallery" element={<StageRouteGuard route="/gallery"><Gallery /></StageRouteGuard>} />
          <Route path="/lecturers" element={<StageRouteGuard route="/lecturers"><GuestLecturers /></StageRouteGuard>} />
          <Route path="/execution-plan" element={<StageRouteGuard route="/execution-plan"><ExecutionPlan /></StageRouteGuard>} />
          <Route path="/admin" element={<StageRouteGuard route="/admin"><Admin /></StageRouteGuard>} />
          <Route path="/bookings" element={<StageRouteGuard route="/bookings"><Bookings /></StageRouteGuard>} />
          <Route path="/bookings/confirmation/:bookingId" element={<StageRouteGuard route="/bookings/confirmation/:bookingId"><BookingConfirmation /></StageRouteGuard>} />
          <Route path="/bookings/:ecoCentreId/:activityId" element={<StageRouteGuard route="/bookings/:ecoCentreId/:activityId"><BookingForm /></StageRouteGuard>} />
          <Route path="/bookings/:id" element={<StageRouteGuard route="/bookings/:id"><ActivityDetails /></StageRouteGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
