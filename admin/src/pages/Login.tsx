import { useState } from 'react';
import { Card, Form, Input, Button, Message } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAdminStore } from '../store/useAdminStore';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAdminStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await authApi.login(values);
      if (res.user?.role !== 'admin') {
        Message.error('该账号不是管理员');
        return;
      }
      setAuth(res.token, res.user);
      Message.success('登录成功');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f8fa',
      }}
    >
      <Card style={{ width: 400 }} title="管理后台登录">
        <Form layout="vertical" onSubmit={onSubmit}>
          <Form.Item
            label="邮箱"
            field="email"
            rules={[{ required: true, type: 'email', message: '请输入正确的邮箱' }]}
          >
            <Input placeholder="admin@example.com" />
          </Form.Item>
          <Form.Item label="密码" field="password" rules={[{ required: true }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Button type="primary" htmlType="submit" long loading={loading}>
            登录
          </Button>
        </Form>
      </Card>
    </div>
  );
}
