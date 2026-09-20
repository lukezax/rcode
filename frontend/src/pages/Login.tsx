import { useState } from 'react';
import { Card, Form, Input, Button, Message, Link } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useUserStore } from '../store/useUserStore';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useUserStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await authApi.login(values);
      setAuth(res.user, res.token);
      Message.success('登录成功');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
      <Card style={{ width: 400 }} title="登录">
        <Form layout="vertical" onSubmit={onSubmit}>
          <Form.Item
            label="邮箱"
            field="email"
            rules={[{ required: true, type: 'email', message: '请输入正确的邮箱' }]}
          >
            <Input placeholder="user@example.com" />
          </Form.Item>
          <Form.Item
            label="密码"
            field="password"
            rules={[{ required: true, minLength: 8, message: '密码至少 8 位' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Button type="primary" htmlType="submit" long loading={loading}>
            登录
          </Button>
        </Form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          还没有账号？<Link onClick={() => navigate('/register')}>立即注册</Link>
        </div>
      </Card>
    </div>
  );
}
