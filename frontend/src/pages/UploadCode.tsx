import { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Message,
} from '@arco-design/web-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { targetApi, codeApi, Target } from '../api';
import { useUserStore } from '../store/useUserStore';

export default function UploadCode() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const user = useUserStore((s) => s.user);
  const [form] = Form.useForm();
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      Message.warning('请先登录');
      navigate('/login');
      return;
    }
    targetApi.list({ pageSize: 200 }).then((res) => setTargets(res.list));
    const presetTargetId = params.get('targetId');
    if (presetTargetId) {
      form.setFieldValue('targetId', Number(presetTargetId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: any) => {
    setLoading(true);
    try {
      await codeApi.create({
        targetId: values.targetId,
        code: values.code,
        link: values.link,
        rewardShare: values.rewardShare,
        rewardReceive: values.rewardReceive,
        description: values.description,
        expireAt: values.expireAt ? new Date(values.expireAt).toISOString() : undefined,
      });
      Message.success('上传成功，邀请码已进入待验证状态');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Card title="上传邀请码">
        <Form form={form} layout="vertical" onSubmit={onSubmit}>
          <Form.Item
            label="选择工具"
            field="targetId"
            rules={[{ required: true, message: '请选择工具' }]}
          >
            <Select
              placeholder="请选择要分享邀请码的 AI 工具"
              showSearch
              options={targets.map((t) => ({ label: `${t.name}（${t.category}）`, value: t.id }))}
            />
          </Form.Item>
          <Form.Item
            label="邀请码 / 推荐码"
            field="code"
            rules={[{ required: true, message: '请输入邀请码' }]}
          >
            <Input placeholder="例如 ABCDEF123456" />
          </Form.Item>
          <Form.Item label="推荐链接（可选）" field="link">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="分享者奖励说明（可选）" field="rewardShare">
            <Input placeholder="例如：双方各得 10 美元额度" />
          </Form.Item>
          <Form.Item label="被分享者奖励说明（可选）" field="rewardReceive">
            <Input placeholder="例如：新用户注册得 5 美元" />
          </Form.Item>
          <Form.Item label="有效期（可选）" field="expireAt">
            <DatePicker style={{ width: '100%' }} showTime />
          </Form.Item>
          <Form.Item label="备注（可选）" field="description">
            <Input.TextArea placeholder="补充说明" />
          </Form.Item>
          <div style={{ color: '#86909c', fontSize: 12, marginBottom: 16 }}>
            提示：同一工具每日最多上传 3 条，同一邀请码不可重复上传；请确保内容真实，平台不保证奖励兑现。
          </div>
          <Button type="primary" htmlType="submit" long loading={loading}>
            提交
          </Button>
        </Form>
      </Card>
    </div>
  );
}
