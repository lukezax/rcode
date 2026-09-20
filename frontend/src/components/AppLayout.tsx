import { Layout, Menu, Button, Space, Avatar, Dropdown, Message } from '@arco-design/web-react';
import { IconUser, IconPlus, IconApps, IconSearch } from '@arco-design/web-react/icon';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

const { Header, Content, Footer } = Layout;
const MenuItem = Menu.Item;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserStore();

  const menuSelected = () => {
    if (location.pathname === '/') return ['/'];
    if (location.pathname.startsWith('/user')) return ['/user'];
    return [];
  };

  const handleLogout = () => {
    logout();
    Message.success('已退出登录');
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          borderBottom: '1px solid #eee',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <div
            style={{ fontSize: 20, fontWeight: 700, cursor: 'pointer', color: '#165dff' }}
            onClick={() => navigate('/')}
          >
            🔗 AI 邀请码分享
          </div>
          <Menu
            mode="horizontal"
            selectedKeys={menuSelected()}
            style={{ borderBottom: 'none' }}
            onClickMenuItem={(key) => navigate(key)}
          >
            <MenuItem key="/">
              <IconApps /> 首页
            </MenuItem>
            <MenuItem key="/upload">
              <IconPlus /> 上传邀请码
            </MenuItem>
            {user && (
              <MenuItem key="/user">
                <IconUser /> 我的
              </MenuItem>
            )}
          </Menu>
        </div>

        <Space>
          {user ? (
            <Dropdown
              droplist={
                <Menu onClickMenuItem={(key) => (key === 'logout' ? handleLogout() : navigate(key))}>
                  <Menu.Item key="/user">个人中心</Menu.Item>
                  <Menu.Item key="logout">退出登录</Menu.Item>
                </Menu>
              }
              position="br"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar size={28} style={{ background: '#165dff' }}>
                  {(user.nickname || user.email)?.[0]?.toUpperCase()}
                </Avatar>
                <span>{user.nickname || user.email}</span>
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button type="text" onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                注册
              </Button>
            </Space>
          )}
        </Space>
      </Header>

      <Content style={{ padding: '24px 32px', maxWidth: 1200, width: '100%', margin: '0 auto' }}>
        <Outlet />
      </Content>

      <Footer style={{ textAlign: 'center', color: '#999' }}>
        平台仅提供信息分享，不保证邀请码 100% 有效 · AI 邀请码分享平台 © 2026
      </Footer>
    </Layout>
  );
}
