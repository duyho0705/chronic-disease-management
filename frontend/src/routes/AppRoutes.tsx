import { Routes, Route } from 'react-router-dom';
import DoctorDashboard from '../pages/DoctorDashboard';
import DoctorAppointments from '../pages/DoctorAppointments';
import DoctorMessages from '../pages/DoctorMessages';
import ClinicDashboard from '../pages/ClinicDashboard';
import DoctorAnalytics from '../pages/DoctorAnalytics';
import DoctorPatients from '../pages/DoctorPatients';
import DoctorPrescriptions from '../pages/DoctorPrescriptions';
import { ROUTES } from '../constants/routes';
import ComingSoon from '../pages/ComingSoon';

import ClinicReports from '../pages/ClinicReports';
import ClinicRiskAlerts from '../pages/ClinicRiskAlerts';
import ClinicPatients from '../pages/ClinicPatients';
import ClinicDoctors from '../pages/ClinicDoctors';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<DoctorDashboard />} />
      <Route path={ROUTES.PATIENT.DASHBOARD} element={<ComingSoon title="Patient Dashboard" />} />
      <Route path={ROUTES.PATIENT.METRICS} element={<ComingSoon title="Patient Metrics" />} />
      <Route path={ROUTES.PATIENT.APPOINTMENTS} element={<ComingSoon title="Patient Appointments" />} />
      <Route path={ROUTES.PATIENT.PRESCRIPTIONS} element={<ComingSoon title="Patient Prescriptions" />} />
      <Route path={ROUTES.PATIENT.MESSAGES} element={<ComingSoon title="Patient Messages" />} />
      <Route path={ROUTES.PATIENT.PROFILE} element={<ComingSoon title="Patient Profile" />} />
      <Route path={ROUTES.DOCTOR.DASHBOARD} element={<DoctorDashboard />} />
      <Route path={ROUTES.DOCTOR.ANALYTICS} element={<DoctorAnalytics />} />
      <Route path={ROUTES.DOCTOR.APPOINTMENTS} element={<DoctorAppointments />} />
      <Route path={ROUTES.DOCTOR.MESSAGES} element={<DoctorMessages />} />
      <Route path={ROUTES.DOCTOR.PATIENTS} element={<DoctorPatients />} />
      <Route path={ROUTES.DOCTOR.PRESCRIPTIONS} element={<DoctorPrescriptions />} />
      <Route path={ROUTES.CLINIC.DASHBOARD} element={<ClinicDashboard />} />
      <Route path={ROUTES.CLINIC.REPORTS} element={<ClinicReports />} />
      <Route path={ROUTES.CLINIC.ALERTS} element={<ClinicRiskAlerts />} />
      <Route path={ROUTES.CLINIC.PATIENTS} element={<ClinicPatients />} />
      <Route path={ROUTES.CLINIC.DOCTORS} element={<ClinicDoctors />} />
      <Route path={ROUTES.ADMIN} element={<ComingSoon title="System Admin Dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
