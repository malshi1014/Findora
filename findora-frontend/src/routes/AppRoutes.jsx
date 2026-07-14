import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";

import Login from "../pages/auth/Login";
import ChooseRole from "../pages/auth/ChooseRole";
import Register from "../pages/auth/Register";
import ShopRegister from "../pages/auth/ShopRegister";

import UserDashboard from "../pages/dashboard/UserDashboard";
import ShopOwnerDashboard from "../pages/dashboard/ShopOwnerDashboard";
import MyReports from "../pages/dashboard/MyReports";
import Notifications from "../pages/dashboard/Notifications";
import Settings from "../pages/dashboard/Settings";
import Donation from "../pages/dashboard/Donation";
import Reward from "../pages/dashboard/Reward";
import EditReport from "../pages/dashboard/EditReport";
import Matches from "../pages/dashboard/Matches";

import ReportLostItem from "../pages/reports/ReportLostItem";
import ReportFoundItem from "../pages/reports/ReportFoundItem";
import ReportSuspiciousItem from "../pages/reports/ReportSuspiciousItem";
import ReportMissingPerson from "../pages/reports/ReportMissingPerson";
import ReportMissingPet from "../pages/reports/ReportMissingPet";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminReports from "../pages/admin/AdminReports";
import AdminMatches from "../pages/admin/AdminMatches";
import ManageUsers from "../pages/admin/ManageUsers";
import ManageLostReports from "../pages/admin/ManageLostReports";
import ManageFoundReports from "../pages/admin/ManageFoundReports";
import ManageSuspiciousReports from "../pages/admin/ManageSuspiciousReports";
import ManageMissingPeople from "../pages/admin/ManageMissingPeople";
import ManageMissingPets from "../pages/admin/ManageMissingPets";
import ManageDonations from "../pages/admin/ManageDonations";
import ManageRewards from "../pages/admin/ManageRewards";
import ManageComplaints from "../pages/admin/ManageComplaints";
import AdminStatistics from "../pages/admin/AdminStatistics";
import ManageSettings from "../pages/admin/ManageSettings";

function AppRoutes() {
  return (
    <BrowserRouter>
        
      <ScrollToTop />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop-register" element={<ShopRegister />} />

        {/* Normal User Dashboard */}
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-dashboard/my-reports" element={<MyReports />} />
        <Route path="/user-dashboard/notifications" element={<Notifications />} />
        <Route path="/user-dashboard/settings" element={<Settings />} />
        <Route path="/user-dashboard/donation" element={<Donation />} />
        <Route path="/user-dashboard/reward" element={<Reward />} />
        <Route path="/user-dashboard/matches" element={<Matches />} />

        {/* Normal User Report Pages */}
        <Route path="/user-dashboard/report-lost" element={<ReportLostItem />} />
        <Route path="/user-dashboard/report-found" element={<ReportFoundItem />} />
        <Route path="/user-dashboard/report-person" element={<ReportMissingPerson />} />
        <Route path="/user-dashboard/report-pet" element={<ReportMissingPet />} />

        {/* Shared Pages for Shop Owners */}
        <Route path="/shop-owner/my-reports" element={<MyReports />} />
        <Route path="/shop-owner/notifications" element={<Notifications />} />
        <Route path="/shop-owner/settings" element={<Settings />} />
        <Route path="/shop-owner/donation" element={<Donation />} />
        <Route path="/shop-owner/reward" element={<Reward />} />
        <Route path="/shop-owner/matches" element={<Matches />} />
        <Route path="/shop-owner/report-lost" element={<ReportLostItem />} />
        <Route path="/shop-owner/report-found" element={<ReportFoundItem />} />
        <Route path="/shop-owner/report-person" element={<ReportMissingPerson />} />
        <Route path="/shop-owner/report-pet" element={<ReportMissingPet />} />

        <Route
          path="/user-dashboard/edit-report/:reportType/:reportId"
          element={<EditReport />}
        />

        {/* Shop Owner Dashboard */}
        <Route path="/shop-owner" element={<ShopOwnerDashboard />} />
        <Route
          path="/shop-owner/report-suspicious"
          element={<ReportSuspiciousItem />}
        />

        {/* Public Report Route Aliases */}
        <Route path="/report-lost" element={<ReportLostItem />} />
        <Route path="/report-found" element={<ReportFoundItem />} />
        <Route path="/report-suspicious" element={<ReportSuspiciousItem />} />
        <Route path="/report-person" element={<ReportMissingPerson />} />
        <Route path="/report-pet" element={<ReportMissingPet />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/matches" element={<AdminMatches />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/lost-reports" element={<ManageLostReports />} />
        <Route path="/admin/found-reports" element={<ManageFoundReports />} />
        <Route path="/admin/suspicious-reports" element={<ManageSuspiciousReports />} />
        <Route path="/admin/missing-people" element={<ManageMissingPeople />} />
        <Route path="/admin/missing-pets" element={<ManageMissingPets />} />
        <Route path="/admin/donations" element={<ManageDonations />} />
        <Route path="/admin/rewards" element={<ManageRewards />} />
        <Route path="/admin/complaints" element={<ManageComplaints />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
        <Route path="/admin/settings" element={<ManageSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
