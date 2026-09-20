import { Layout, Menu, Button, Space, Tag, Message } from '@arco-design/web-react';
import {
  IconDashboard,
  IconApps,
  IconLink,
  IconExclamationCircle,
  IconUser,
} from '@arco-design/web-react/icon';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAdminStore } from '../store/useAdminStore';

const { Sider, Header, Content } = Layout;
const MenuItem = Menu.Item;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, token, logout } = useAdminStore();

  if (!token) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    Message.success('已退出');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ background: '#fff' }}>
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#165dff',
            borderBottom: '1px solid #eee',
          }}
        >
          管理后台
        </div>
        <Menu
          selectedKeys={[location.pathname]}
          onClickMenuItem={(key) => navigate(key)}
          style={{ width: '100%' }}
        >
          <MenuItem key="/">
            <IconDashboard /> 数据看板
          </MenuItem>
          <MenuItem key="/targets">
            <IconApps /> 目标审批
          </MenuItem>
          <MenuItem key="/codes">
            <IconLink /> 邀请码管理
          </MenuItem>
          <MenuItem key="/reports">
            <IconExclamationCircle /> 举报处理
          </MenuItem>
          <MenuItem key="/users">
            <IconUser /> 用户管理
          </MenuItem>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            borderBottom: '1px solid #eee',
          }}
        >
          <Space>
            <Tag color="arcoblue">{admin?.nickname || admin?.email || 'admin'}</Tag>
            <Button size="small" onClick={handleLogout}>
              退出登录
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: 24, background: '#f7f8fa' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
