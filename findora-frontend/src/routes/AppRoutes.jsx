import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ChooseRole from "../pages/auth/ChooseRole";

import UserDashboard from "../pages/dashboard/UserDashboard";
import Notifications from "../pages/dashboard/Notifications";
import Settings from "../pages/dashboard/Settings";
import Donation from "../pages/dashboard/Donation";
import EditReport from "../pages/dashboard/EditReport";

import ReportLostItem from "../pages/reports/ReportLostItem";
import ReportFoundItem from "../pages/reports/ReportFoundItem";
import ReportSuspiciousItem from "../pages/reports/ReportSuspiciousItem";
import ReportMissingPerson from "../pages/reports/ReportMissingPerson";
import ReportMissingPet from "../pages/reports/ReportMissingPet";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageLostReports from "../pages/admin/ManageLostReports";
import ManageFoundReports from "../pages/admin/ManageFoundReports";
import ManageMissingPeople from "../pages/admin/ManageMissingPeople";
import ManageMissingPets from "../pages/admin/ManageMissingPets";
import ManageDonations from "../pages/admin/ManageDonations";
import ManageRewards from "../pages/admin/ManageRewards";
import MatchVerification from "../pages/admin/MatchVerification";
import ManageComplaints from "../pages/admin/ManageComplaints";
import AdminStatistics from "../pages/admin/AdminStatistics";
import ManageSettings from "../pages/admin/ManageSettings";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/choose-role" element={<ChooseRole />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/edit-report" element={<EditReport />} />

        {/* Reports */}
        <Route path="/report-lost" element={<ReportLostItem />} />
        <Route path="/report-found" element={<ReportFoundItem />} />
        <Route path="/report-suspicious" element={<ReportSuspiciousItem />} />
        <Route path="/report-person" element={<ReportMissingPerson />} />
        <Route path="/report-pet" element={<ReportMissingPet />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/lost-reports" element={<ManageLostReports />} />
        <Route path="/admin/found-reports" element={<ManageFoundReports />} />
        <Route path="/admin/missing-people" element={<ManageMissingPeople />} />
        <Route path="/admin/missing-pets" element={<ManageMissingPets />} />
        <Route path="/admin/donations" element={<ManageDonations />} />
        <Route path="/admin/rewards" element={<ManageRewards />} />
        <Route path="/admin/matches" element={<MatchVerification />} />
        <Route path="/admin/complaints" element={<ManageComplaints />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
        <Route path="/admin/settings" element={<ManageSettings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;