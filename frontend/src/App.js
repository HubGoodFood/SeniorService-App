import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Typography, Avatar, Space, Button } from 'antd';
import {
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  ScheduleOutlined,
  DollarCircleOutlined,
  NotificationOutlined,
  SettingOutlined,
  PieChartOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import './App.css'; // Keep for minimal custom overrides if needed
import ClientListPage from './pages/ClientListPage'; // Import the new page

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

// Placeholder components for different sections
const Dashboard = () => <Title level={2}>Dashboard</Title>;
// const Clients = () => <Title level={2}>Client Information Management</Title>; // Replaced by ClientListPage
const Tasks = () => <Title level={2}>Task Scheduling</Title>;
const Dispatch = () => <Title level={2}>Driver Dispatch & Execution</Title>;
const Billing = () => <Title level={2}>Billing & Reports</Title>;
const Notifications = () => <Title level={2}>Notifications</Title>;
const UserProfile = () => <Title level={2}>User Profile</Title>;
const Settings = () => <Title level={2}>Settings</Title>;

// Helper to create menu items
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const menuItems = [
  getItem(<Link to="/">Dashboard</Link>, '/', <PieChartOutlined />),
  getItem(<Link to="/clients">Clients</Link>, '/clients', <TeamOutlined />),
  getItem(<Link to="/tasks">Tasks</Link>, '/tasks', <ScheduleOutlined />),
  getItem(<Link to="/dispatch">Dispatch</Link>, '/dispatch', <DesktopOutlined />),
  getItem(<Link to="/billing">Billing</Link>, '/billing', <DollarCircleOutlined />),
  getItem(<Link to="/notifications">Notifications</Link>, '/notifications', <NotificationOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem(<Link to="/profile">Profile</Link>, '/profile'),
    getItem(<Link to="/settings">Settings</Link>, '/settings'),
  ]),
  // getItem('Logout', '/logout', <LogoutOutlined />), // Handle logout differently
];

// Function to get breadcrumb path
const breadcrumbNameMap = {
  '/': 'Dashboard',
  '/clients': 'Clients',
  '/tasks': 'Tasks',
  '/dispatch': 'Dispatch',
  '/billing': 'Billing',
  '/notifications': 'Notifications',
  '/profile': 'User Profile',
  '/settings': 'Settings',
};

const AppContent = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url] || url.substring(1).charAt(0).toUpperCase() + url.substring(2)}</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <>
      <Breadcrumb style={{ margin: '16px 0' }}>
        {breadcrumbItems}
      </Breadcrumb>
      <div style={{ padding: 24, minHeight: 360, background: '#fff', borderRadius: '8px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<ClientListPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
};


function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // For setting defaultSelectedKeys

  // Determine default selected key based on current path
  const currentPath = location.pathname === '/' ? '/' : location.pathname.split('/')[1] ? `/${location.pathname.split('/')[1]}` : '/';


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', textAlign:'center', lineHeight:'32px', color:'white', borderRadius:'4px' }}>
          {collapsed ? 'SS' : 'Senior Service'}
        </div>
        <Menu theme="dark" defaultSelectedKeys={[currentPath]} mode="inline" items={menuItems} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: '0 16px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
            <Title level={4} style={{ margin: 0 }}>Senior Service App</Title>
            {/* Placeholder for user avatar/logout */}
            <Space>
                <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                <span>User Name</span>
                <Button type="text" icon={<LogoutOutlined />} onClick={() => alert('Logout clicked!')}>
                    Logout
                </Button>
            </Space>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <AppContent />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Senior Service Management App ©{new Date().getFullYear()} Created by AsiaUS Business Connection LLC
        </Footer>
      </Layout>
    </Layout>
  );
}

// Wrap App with Router to use useLocation hook
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;