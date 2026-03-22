import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { HeartPulse, Stethoscope, Building2, Shield, Activity } from 'lucide-react';
import DoctorDashboard from './pages/DoctorDashboard';

const LandingPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'patient',
      title: 'Bệnh Nhân',
      description: 'Theo dõi lịch sử bệnh, quản lý toa thuốc, nhập thông tin sức khoẻ và nhận nhắc nhở tự động.',
      icon: <HeartPulse />,
      className: 'patient-card',
      features: ['Nhắc giờ uống thuốc', 'Cảnh báo tự động', 'Chat với bác sĩ']
    },
    {
      id: 'doctor',
      title: 'Bác Sĩ',
      description: 'Quản lý thông tin bệnh nhân, theo dõi biểu đồ chỉ số, kê toa thuốc và phân tích nguy cơ.',
      icon: <Stethoscope />,
      className: 'doctor-card',
      features: ['Theo dõi chỉ số', 'Phân tích nguy cơ cao', 'Quản lý toa thuốc']
    },
    {
      id: 'clinic',
      title: 'Phòng Khám',
      description: 'Báo cáo thống kê tổng quan, quản lý hiệu suất bác sĩ và quản lý phân quyền sử dụng hệ thống.',
      icon: <Building2 />,
      className: 'clinic-card',
      features: ['Dashboard báo cáo', 'Phân công bệnh nhân', 'Xuất dữ liệu / Excel']
    },
    {
      id: 'admin',
      title: 'System Admin',
      description: 'Kiểm soát hệ thống toàn diện, ghi log Audit, cấu hình hệ thống cảnh báo, email và SMS.',
      icon: <Shield />,
      className: 'admin-card',
      features: ['Quản lý Role & Auth', 'Giám sát Audit Log', 'Cấu hình hệ thống']
    }
  ];

  return (
    <div className="app-container">
      <div className="background-elements">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>
      
      <header className="header">
        <h1>
          Hệ Thống <span className="heading-gradient">Quản Lý Tuyến Khoẻ</span>
        </h1>
        <p>Nền tảng tích hợp toàn diện giúp theo dõi, chăm sóc sức khoẻ bệnh nhân mãn tính với cảnh báo và phân tích thông minh.</p>
      </header>

      <div className="roles-grid">
        {roles.map((role) => (
          <div 
            key={role.id} 
            className={`role-card ${role.className}`}
            onClick={() => navigate(`/${role.id}`)}
          >
            <div className="icon-wrapper">
              {role.icon}
            </div>
            <div className="role-info">
              <h2>{role.title}</h2>
              <p>{role.description}</p>
              <div className="features-list">
                {role.features.map((feature, idx) => (
                  <div key={idx} className="feature-item">
                    <Activity size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Placeholder components for the 4 roles
const PatientDashboard = () => <div className="app-container"><div className="header"><h2>Patient Dashboard</h2><p>Đang xây dựng...</p></div></div>;
const ClinicDashboard = () => <div className="app-container"><div className="header"><h2>Clinic Manager Dashboard</h2><p>Đang xây dựng...</p></div></div>;
const AdminDashboard = () => <div className="app-container"><div className="header"><h2>System Admin Dashboard</h2><p>Đang xây dựng...</p></div></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/clinic" element={<ClinicDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
