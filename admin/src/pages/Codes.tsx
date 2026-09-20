import { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Message, Popconfirm } from '@arco-design/web-react';
import { adminApi } from '../api';

const CODE_STATUS: Record<string, { text: string; color: string }> = {
  pending: { text: '待验证', color: 'gray' },
  valid: { text: '有效', color: 'green' },
  invalid: { text: '无效', color: 'red' },
  expired: { text: '已过期', color: 'orange' },
  removed: { text: '已下架', color: 'gray' },
};

export default function Codes() {
  const [list, setList] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchData = async (p = page, kw = keyword, st = status) => {
    setLoading(true);
    try {
      const res = await adminApi.codes({
        page: p,
        pageSize: 10,
        keyword: kw || undefined,
        status: st || undefined,
      });
      setList(res.list);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, '', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRemove = async (id: number) => {
    await adminApi.removeCode(id);
    Message.success('已下架');
    fetchData();
  };

  return (
    <Card title="邀请码管理">
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="搜索邀请码"
          value={keyword}
          onChange={setKeyword}
          onPressEnter={() => {
            setPage(1);
            fetchData(1, keyword, status);
          }}
          style={{ width: 240 }}
          allowClear
        />
        <Select
          placeholder="状态"
          value={status || undefined}
          onChange={(v) => {
            setStatus(v || '');
            setPage(1);
            fetchData(1, keyword, v || '');
          }}
          allowClear
          style={{ width: 140 }}
          options={[
            { label: '待验证', value: 'pending' },
            { label: '有效', value: 'valid' },
            { label: '无效', value: 'invalid' },
            { label: '已过期', value: 'expired' },
            { label: '已下架', value: 'removed' },
          ]}
        />
        <Button
          type="primary"
          onClick={() => {
            setPage(1);
            fetchData(1, keyword, status);
          }}
        >
          查询
        </Button>
      </Space>

      <Table
        rowKey="id"
        loading={loading}
        data={list}
        pagination={{
          current: page,
          total,
          pageSize: 10,
          onChange: (p) => {
            setPage(p);
            fetchData(p, keyword, status);
          },
        }}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 70 },
          { title: '邀请码', dataIndex: 'code', render: (v: string) => <span style={{ fontFamily: 'monospace' }}>{v}</span> },
          { title: '所属工具', dataIndex: 'target', render: (t: any) => t?.name || '-' },
          { title: '上传者', dataIndex: 'user', render: (u: any) => u?.nickname || '-' },
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
          {
            title: '操作',
            render: (_: any, record: any) => (
              <Popconfirm title="确认下架该邀请码？" onOk={() => onRemove(record.id)}>
                <Button size="small" status="danger" disabled={record.status === 'removed'}>
                  下架
                </Button>
              </Popconfirm>
            ),
          },
        ]}
      />
    </Card>
  );
}
