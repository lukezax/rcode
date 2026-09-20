import { useEffect, useState } from 'react';
import { Card, Table, Button, Tag, Message, Popconfirm } from '@arco-design/web-react';
import { adminApi } from '../api';

export default function Users() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.users();
      setList(res.list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onToggle = async (id: number) => {
    await adminApi.toggleUser(id);
    Message.success('操作成功');
    fetchData();
  };

  return (
    <Card title="用户管理">
      <Table
        rowKey="id"
        loading={loading}
        data={list}
        pagination={{ pageSize: 10 }}
        columns={[
          { title: 'ID', dataIndex: 'id', width: 70 },
          { title: '邮箱', dataIndex: 'email' },
          { title: '昵称', dataIndex: 'nickname', render: (v: string) => v || '-' },
          {
            title: '角色',
            dataIndex: 'role',
            render: (v: string) =>
              v === 'admin' ? <Tag color="arcoblue">管理员</Tag> : <Tag>普通用户</Tag>,
          },
          {
            title: '状态',
            dataIndex: 'status',
            render: (v: string) =>
              v === 'active' ? <Tag color="green">正常</Tag> : <Tag color="red">已封禁</Tag>,
          },
          {
            title: '注册时间',
            dataIndex: 'createdAt',
            render: (v: string) => new Date(v).toLocaleString(),
          },
          {
            title: '操作',
            render: (_: any, record: any) =>
              record.role === 'admin' ? (
                '-'
              ) : (
                <Popconfirm
                  title={record.status === 'active' ? '确认封禁该用户？' : '确认解封该用户？'}
                  onOk={() => onToggle(record.id)}
                >
                  <Button size="small" status={record.status === 'active' ? 'danger' : 'success'}>
                    {record.status === 'active' ? '封禁' : '解封'}
                  </Button>
                </Popconfirm>
              ),
          },
        ]}
      />
    </Card>
  );
}
