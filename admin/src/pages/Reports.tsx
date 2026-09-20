import { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Message, Tabs } from '@arco-design/web-react';
import { adminApi } from '../api';

export default function Reports() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');

  const fetchData = async (st = status) => {
    setLoading(true);
    try {
      const res = await adminApi.reports(st || undefined);
      setList(res.list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData('pending');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onResolve = async (id: number, action: 'remove' | 'reject') => {
    await adminApi.resolveReport(id, action);
    Message.success('已处理');
    fetchData();
  };

  const statusMap: Record<string, { text: string; color: string }> = {
    pending: { text: '待处理', color: 'orange' },
    resolved: { text: '已下架', color: 'green' },
    rejected: { text: '已驳回', color: 'gray' },
  };

  return (
    <Card title="举报处理">
      <Tabs
        activeTab={status}
        onChange={(k) => {
          setStatus(k);
          fetchData(k === 'all' ? '' : k);
        }}
        style={{ marginBottom: 16 }}
      >
        <Tabs.TabPane key="pending" title="待处理" />
        <Tabs.TabPane key="resolved" title="已下架" />
        <Tabs.TabPane key="rejected" title="已驳回" />
        <Tabs.TabPane key="all" title="全部" />
      </Tabs>

      <Table
        rowKey="id"
        loading={loading}
        data={list}
        pagination={{ pageSize: 10 }}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 70 },
          {
            title: '被举报邀请码',
            dataIndex: 'referralCode',
            render: (c: any) => (
              <span style={{ fontFamily: 'monospace' }}>{c?.code || '-'}</span>
            ),
          },
          {
            title: '所属工具',
            dataIndex: 'referralCode',
            render: (c: any) => c?.target?.name || '-',
          },
          { title: '举报人', dataIndex: 'user', render: (u: any) => u?.nickname || '-' },
          { title: '原因', dataIndex: 'reason' },
          { title: '说明', dataIndex: 'detail', render: (v: string) => v || '-' },
          {
            title: '状态',
            dataIndex: 'status',
            render: (s: string) => {
              const st = statusMap[s] || statusMap.pending;
              return <Tag color={st.color}>{st.text}</Tag>;
            },
          },
          {
            title: '操作',
            render: (_: any, record: any) =>
              record.status === 'pending' ? (
                <Space>
                  <Button size="small" type="primary" onClick={() => onResolve(record.id, 'remove')}>
                    核实后下架
                  </Button>
                  <Button size="small" onClick={() => onResolve(record.id, 'reject')}>
                    驳回
                  </Button>
                </Space>
              ) : (
                '-'
              ),
          },
        ]}
      />
    </Card>
  );
}
