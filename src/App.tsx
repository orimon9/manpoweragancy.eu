import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Departments = lazy(() => import("@/pages/Departments"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const JobDetail = lazy(() => import("@/pages/JobDetail"));
const Countries = lazy(() => import("@/pages/Countries"));
const CountryDetail = lazy(() => import("@/pages/CountryDetail"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Contact = lazy(() => import("@/pages/Contact"));
const Apply = lazy(() => import("@/pages/Apply"));
const Track = lazy(() => import("@/pages/Track"));
const Legal = lazy(() => import("@/pages/Legal"));
const Auth = lazy(() => import("@/pages/Auth"));
const Forbidden = lazy(() => import("@/pages/Forbidden"));
const BackendRequired = lazy(() => import("@/pages/BackendRequired"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const DashboardLayout = lazy(() => import("@/pages/dashboard/DashboardLayout"));
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardProfile = lazy(() => import("@/pages/dashboard/DashboardProfile"));
const DashboardApplications = lazy(() => import("@/pages/dashboard/DashboardApplications"));
const DashboardApplicationDetail = lazy(() => import("@/pages/dashboard/DashboardApplicationDetail"));
const DashboardDocuments = lazy(() => import("@/pages/dashboard/DashboardDocuments"));
const DashboardAppointments = lazy(() => import("@/pages/dashboard/DashboardAppointments"));
const DashboardMessages = lazy(() => import("@/pages/dashboard/DashboardMessages"));

const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const AdminHome = lazy(() => import("@/pages/admin/AdminHome"));
const AdminApplications = lazy(() => import("@/pages/admin/AdminApplications"));
const AdminCandidates = lazy(() => import("@/pages/admin/AdminCandidates"));
const AdminJobs = lazy(() => import("@/pages/admin/AdminJobs"));
const AdminDocuments = lazy(() => import("@/pages/admin/AdminDocuments"));
const AdminInquiries = lazy(() => import("@/pages/admin/AdminInquiries"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
      <span className="sr-only">Loading page…</span>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="departments" element={<Departments />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:slug" element={<JobDetail />} />
          <Route path="countries" element={<Countries />} />
          <Route path="countries/:slug" element={<CountryDetail />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="contact" element={<Contact />} />
          <Route path="apply" element={<Apply />} />
          <Route path="track" element={<Track />} />
          <Route path="privacy" element={<Legal kind="privacy" />} />
          <Route path="terms" element={<Legal kind="terms" />} />
          <Route path="cookies" element={<Legal kind="cookies" />} />
          <Route path="auth" element={<Auth />} />
          <Route path="403" element={<Forbidden />} />
          <Route path="backend-required" element={<BackendRequired />} />

          <Route element={<ProtectedRoute allowedRoles={["candidate", "admin", "staff"]} />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="applications" element={<DashboardApplications />} />
              <Route path="applications/:id" element={<DashboardApplicationDetail />} />
              <Route path="documents" element={<DashboardDocuments />} />
              <Route path="appointments" element={<DashboardAppointments />} />
              <Route path="messages" element={<DashboardMessages />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminHome />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="candidates" element={<AdminCandidates />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="documents" element={<AdminDocuments />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
