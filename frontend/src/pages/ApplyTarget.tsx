import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Select, Message } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import { targetApi } from '../api';
import { CATEGORIES } from '../constants';
import { useUserStore } from '../store/useUserStore';

export default function ApplyTarget() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      Message.warning('请先登录');
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await targetApi.apply({
        name: values.name,
        slug: values.slug,
        category: values.category,
        website: values.website,
        logoUrl: values.logoUrl,
        description: values.description,
        reason: values.reason,
      });
      Message.success('申请已提交，等待管理员审批');
      navigate('/user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Card title="申请新增 AI 工具">
        <Form form={form} layout="vertical" onSubmit={onSubmit}>
          <Form.Item
            label="工具名称"
            field="name"
            rules={[{ required: true, message: '请输入工具名称' }]}
          >
            <Input placeholder="例如：某某 AI" />
          </Form.Item>
          <Form.Item
            label="英文名 / 唯一标识"
            field="slug"
            rules={[
              { required: true, message: '请输入唯一标识' },
              { match: /^[a-z0-9-]+$/, message: '仅支持小写字母、数字和短横线' },
            ]}
          >
            <Input placeholder="例如：some-ai" />
          </Form.Item>
          <Form.Item
            label="分类"
            field="category"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select options={CATEGORIES.map((c) => ({ label: c, value: c }))} />
          </Form.Item>
          <Form.Item label="官网（可选）" field="website">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="Logo 链接（可选）" field="logoUrl">
            <Input placeholder="https://.../logo.png" />
          </Form.Item>
          <Form.Item label="简介（可选）" field="description">
            <Input.TextArea placeholder="简单介绍该工具" />
          </Form.Item>
          <Form.Item
            label="申请理由"
            field="reason"
            rules={[{ required: true, message: '请填写申请理由' }]}
          >
            <Input.TextArea placeholder="为什么希望平台支持该工具" />
          </Form.Item>
          <Button type="primary" htmlType="submit" long loading={loading}>
            提交申请
          </Button>
        </Form>
      </Card>
    </div>
  );
}
