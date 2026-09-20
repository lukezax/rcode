import { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Modal, Input, Message } from '@arco-design/web-react';
import { adminApi } from '../api';

export default function Targets() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rejectVisible, setRejectVisible] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.pendingTargets();
      setList(res.list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onApprove = async (id: number) => {
    await adminApi.approveTarget(id);
    Message.success('已通过');
    fetchData();
  };

  const onReject = async () => {
    if (!rejectId) return;
    await adminApi.rejectTarget(rejectId, rejectReason);
    Message.success('已拒绝');
    setRejectVisible(false);
    setRejectReason('');
    fetchData();
  };

  return (
    <Card title="目标审批">
      <Table
        rowKey="id"
        loading={loading}
        data={list}
        pagination={false}
        columns={[
          { title: '名称', dataIndex: 'name' },
          { title: '标识', dataIndex: 'slug' },
          { title: '分类', dataIndex: 'category' },
          { title: '官网', dataIndex: 'website', render: (v: string) => v || '-' },
          { title: '简介', dataIndex: 'description', render: (v: string) => v || '-' },
          {
            title: '申请人',
            dataIndex: 'createdBy',
            render: (v: any) => v?.nickname || '-',
          },
          {
            title: '操作',
            render: (_: any, record: any) => (
              <Space>
                <Button size="small" type="primary" onClick={() => onApprove(record.id)}>
                  通过
                </Button>
                <Button
                  size="small"
                  status="danger"
                  onClick={() => {
                    setRejectId(record.id);
                    setRejectVisible(true);
                  }}
                >
                  拒绝
                </Button>
              </Space>
            ),
          },
        ]}
        noDataElement="暂无待审批目标"
      />

      <Modal
        title="拒绝目标申请"
        visible={rejectVisible}
        onOk={onReject}
        onCancel={() => setRejectVisible(false)}
      >
        <Input.TextArea
          placeholder="请填写拒绝原因"
          value={rejectReason}
          onChange={setRejectReason}
        />
      </Modal>
    </Card>
  );
}
