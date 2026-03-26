import { Routes, Route, useNavigate } from 'react-router-dom';
import { HeartPulse, Stethoscope, Building2, Shield, Activity } from 'lucide-react';
import DoctorDashboard from '../pages/DoctorDashboard';
import DoctorAppointments from '../pages/DoctorAppointments';
import DoctorMessages from '../pages/DoctorMessages';
import DoctorAnalytics from '../pages/DoctorAnalytics';
import DoctorPatients from '../pages/DoctorPatients';
import DoctorPrescriptions from '../pages/DoctorPrescriptions';
import PatientHealthMetrics from '../pages/PatientHealthMetrics';
import PatientDashboard from '../pages/PatientDashboard';
import PatientAppointments from '../pages/PatientAppointments';
import PatientPrescriptions from '../pages/PatientPrescriptions';
import PatientMessages from '../pages/PatientMessages';
import PatientProfile from '../pages/PatientProfile';
import PatientLayout from '../layouts/PatientLayout';
import { ROUTES } from '../constants/routes';

import LandingPage from '../pages/LandingPage';
import ComingSoon from '../pages/ComingSoon';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />
      <Route path="/patient" element={<PatientLayout />}>
        <Route index element={<PatientDashboard />} />
        <Route path="metrics" element={<PatientHealthMetrics />} />
        <Route path="appointments" element={<PatientAppointments />} />
        <Route path="prescriptions" element={<PatientPrescriptions />} />
        <Route path="messages" element={<PatientMessages />} />
        <Route path="profile" element={<PatientProfile />} />
      </Route>
      <Route path={ROUTES.DOCTOR.DASHBOARD} element={<DoctorDashboard />} />
      <Route path={ROUTES.DOCTOR.ANALYTICS} element={<DoctorAnalytics />} />
      <Route path={ROUTES.DOCTOR.APPOINTMENTS} element={<DoctorAppointments />} />
      <Route path={ROUTES.DOCTOR.MESSAGES} element={<DoctorMessages />} />
      <Route path={ROUTES.DOCTOR.PATIENTS} element={<DoctorPatients />} />
      <Route path={ROUTES.DOCTOR.PRESCRIPTIONS} element={<DoctorPrescriptions />} />
      <Route path={ROUTES.CLINIC} element={<ComingSoon title="Clinic Manager Dashboard" />} />
      <Route path={ROUTES.ADMIN} element={<ComingSoon title="System Admin Dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
