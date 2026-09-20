import { useEffect, useState } from 'react';
import { Card, Tabs, Table, Tag, Button, Space, Message } from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import { meApi } from '../api';
import { CODE_STATUS, TARGET_STATUS } from '../constants';
import { useUserStore } from '../store/useUserStore';

export default function UserCenter() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const [codes, setCodes] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      Message.warning('请先登录');
      navigate('/login');
      return;
    }
    meApi.codes().then((r) => setCodes(r.list));
    meApi.feedbacks().then((r) => setFeedbacks(r.list));
    meApi.applications().then((r) => setApplications(r.list));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 70 },
    { title: '邀请码', dataIndex: 'code', render: (v: string) => <span style={{ fontFamily: 'monospace' }}>{v}</span> },
    { title: '所属工具', dataIndex: 'target', render: (t: any) => t?.name || '-' },
    { title: '查看', dataIndex: 'viewCount', width: 70 },
    { title: '有效', dataIndex: 'validCount', width: 70 },
    { title: '无效', dataIndex: 'invalidCount', width: 70 },
    {
      title: '状态',
      dataIndex: 'status',
      render: (s: string) => {
        const st = CODE_STATUS[s] || CODE_STATUS.pending;
        return <Tag color={st.color}>{st.text}</Tag>;
      },
    },
  ];

  return (
    <div>
      <Card title="个人中心">
        <Tabs>
          <Tabs.TabPane key="codes" title={`我的上传 (${codes.length})`}>
            <Table
              rowKey="id"
              data={codes}
              columns={columns}
              pagination={{ pageSize: 10 }}
              onRow={(record) => ({
                onClick: () => navigate(`/codes/${record.id}`),
                style: { cursor: 'pointer' },
              })}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="feedbacks" title={`我的反馈 (${feedbacks.length})`}>
            <Table
              rowKey="id"
              data={feedbacks}
              columns={[
                { title: '邀请码', dataIndex: 'referralCode', render: (r: any) => r?.code || '-' },
                { title: '所属工具', dataIndex: 'referralCode', render: (r: any) => r?.target?.name || '-' },
                {
                  title: '我的反馈',
                  dataIndex: 'vote',
                  render: (v: string) =>
                    v === 'valid' ? <Tag color="green">有效</Tag> : <Tag color="red">无效</Tag>,
                },
                { title: '点评', dataIndex: 'comment', render: (v: string) => v || '-' },
                {
                  title: '时间',
                  dataIndex: 'createdAt',
                  render: (v: string) => new Date(v).toLocaleString(),
                },
              ]}
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="applications" title={`我的申请 (${applications.length})`}>
            <Table
              rowKey="id"
              data={applications}
              columns={[
                { title: '名称', dataIndex: 'name' },
                { title: '分类', dataIndex: 'category' },
                {
                  title: '状态',
                  dataIndex: 'status',
                  render: (s: string) => {
                    const st = TARGET_STATUS[s] || TARGET_STATUS.pending;
                    return <Tag color={st.color}>{st.text}</Tag>;
                  },
                },
                { title: '拒绝原因', dataIndex: 'rejectReason', render: (v: string) => v || '-' },
                {
                  title: '申请时间',
                  dataIndex: 'createdAt',
                  render: (v: string) => new Date(v).toLocaleString(),
                },
              ]}
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
