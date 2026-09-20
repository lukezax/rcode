import { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Tag,
  Space,
  Descriptions,
  Message,
  Divider,
  Modal,
  Form,
  Radio,
  Input,
  Result,
} from '@arco-design/web-react';
import { IconCopy, IconCheck, IconClose, IconExclamationCircle } from '@arco-design/web-react/icon';
import { useNavigate, useParams } from 'react-router-dom';
import { codeApi, CodeDetail as CodeDetailType } from '../api';
import { CODE_STATUS } from '../constants';
import { useUserStore } from '../store/useUserStore';

export default function CodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const [data, setData] = useState<CodeDetailType | null>(null);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportForm] = Form.useForm();

  const fetchDetail = async () => {
    const res = await codeApi.detail(id!);
    setData(res);
  };

  useEffect(() => {
    // 每次进入详情页，查看次数 +1
    codeApi.view(id!).catch(() => {});
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onCopy = async () => {
    if (!user) {
      Message.warning('请先登录后查看完整邀请码');
      navigate('/login');
      return;
    }
    try {
      await navigator.clipboard.writeText(data!.code);
      Message.success('复制成功');
    } catch {
      Message.error('复制失败，请手动复制');
    }
  };

  const onFeedback = async (vote: 'valid' | 'invalid') => {
    if (!user) {
      Message.warning('请先登录');
      navigate('/login');
      return;
    }
    if (data!.isOwner) {
      Message.warning('不能给自己的邀请码投票');
      return;
    }
    const res: any = await codeApi.feedback(id!, { vote });
    Message.success('感谢您的反馈');
    setData({
      ...data!,
      validCount: res.validCount,
      invalidCount: res.invalidCount,
      status: res.status,
      myFeedback: vote,
    });
  };

  const onReport = async () => {
    try {
      const values = await reportForm.validate();
      await codeApi.report(id!, values);
      Message.success('举报已提交，我们会尽快处理');
      setReportVisible(false);
      reportForm.resetFields();
    } catch {
      /* 校验失败 */
    }
  };

  if (!data) return null;

  const st = CODE_STATUS[data.status] || CODE_STATUS.pending;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <Button type="text" onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← 返回
      </Button>

      <Card>
        <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
          <Tag color={st.color} style={{ marginBottom: 12 }}>
            {st.text}
          </Tag>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 2,
              wordBreak: 'break-all',
            }}
          >
            {data.code}
          </div>
          {!data.isFullCode && (
            <div style={{ color: '#ff7d00', marginTop: 10, fontSize: 13 }}>
              登录后可查看完整邀请码并复制
            </div>
          )}
          <Space style={{ marginTop: 20 }}>
            <Button type="primary" icon={<IconCopy />} onClick={onCopy}>
              复制邀请码
            </Button>
            {data.link && (
              <Button
                onClick={() => {
                  window.open(data.link!, '_blank');
                }}
              >
                打开推荐链接
              </Button>
            )}
          </Space>
        </div>

        <Divider />

        <Descriptions
          column={2}
          data={[
            { label: '所属工具', value: data.target?.name || '-' },
            { label: '上传者', value: data.user?.nickname || '匿名' },
            {
              label: '上传时间',
              value: new Date(data.createdAt).toLocaleString(),
            },
            { label: '有效期', value: data.expireAt ? new Date(data.expireAt).toLocaleDateString() : '未填写' },
            { label: '查看次数', value: data.viewCount },
            {
              label: '反馈',
              value: (
                <Space>
                  <span style={{ color: '#00b42a' }}>有效 {data.validCount}</span>
                  <span style={{ color: '#f53f3f' }}>无效 {data.invalidCount}</span>
                </Space>
              ),
            },
            { label: '分享者奖励', value: data.rewardShare || '未填写', span: 2 },
            { label: '被分享者奖励', value: data.rewardReceive || '未填写', span: 2 },
            { label: '备注', value: data.description || '无', span: 2 },
          ]}
        />

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 12, color: '#86909c' }}>
            使用后请反馈，帮助社区筛选真实可用的邀请码
          </div>
          {data.isOwner ? (
            <Tag color="gray">这是您上传的邀请码，无法投票</Tag>
          ) : (
            <Space size="large">
              <Button
                type={data.myFeedback === 'valid' ? 'primary' : 'outline'}
                status="success"
                icon={<IconCheck />}
                onClick={() => onFeedback('valid')}
              >
                我用过，有效
              </Button>
              <Button
                type={data.myFeedback === 'invalid' ? 'primary' : 'outline'}
                status="danger"
                icon={<IconClose />}
                onClick={() => onFeedback('invalid')}
              >
                我用过，无效
              </Button>
            </Space>
          )}
          <div style={{ marginTop: 20 }}>
            <Button
              type="text"
              size="small"
              icon={<IconExclamationCircle />}
              onClick={() => {
                if (!user) {
                  Message.warning('请先登录');
                  navigate('/login');
                  return;
                }
                setReportVisible(true);
              }}
            >
              举报该邀请码
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        title="举报邀请码"
        visible={reportVisible}
        onOk={onReport}
        onCancel={() => setReportVisible(false)}
      >
        <Form form={reportForm} layout="vertical" initialValues={{ reason: '已失效' }}>
          <Form.Item label="举报原因" field="reason" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="已失效">已失效</Radio>
              <Radio value="虚假信息">虚假信息</Radio>
              <Radio value="违规内容">违规内容</Radio>
              <Radio value="其他">其他</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="详细说明" field="detail">
            <Input.TextArea placeholder="选填" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
