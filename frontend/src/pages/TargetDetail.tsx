import { useEffect, useState } from 'react';
import {
  Card,
  Tag,
  Button,
  List,
  Space,
  Select,
  Pagination,
  Spin,
  Empty,
  Avatar,
  Message,
} from '@arco-design/web-react';
import { useNavigate, useParams } from 'react-router-dom';
import { targetApi, Target, CodeListItem } from '../api';
import { CODE_STATUS } from '../constants';
import { useUserStore } from '../store/useUserStore';

export default function TargetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const [target, setTarget] = useState<Target | null>(null);
  const [codes, setCodes] = useState<CodeListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('default');
  const [loading, setLoading] = useState(false);

  const fetchTarget = async () => {
    const res = await targetApi.detail(id!);
    setTarget(res);
  };

  const fetchCodes = async (p = 1, s = sort) => {
    setLoading(true);
    try {
      const res = await targetApi.codes(id!, { page: p, sort: s, pageSize: 10 });
      setCodes(res.list);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarget();
    fetchCodes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!target) return <Spin loading style={{ width: '100%', marginTop: 60 }} />;

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: '#f2f3f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            {target.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <Space>
              <span style={{ fontSize: 22, fontWeight: 700 }}>{target.name}</span>
              <Tag color="arcoblue">{target.category}</Tag>
            </Space>
            <div style={{ color: '#86909c', marginTop: 6 }}>{target.description}</div>
            {target.website && (
              <a href={target.website} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                {target.website}
              </a>
            )}
          </div>
          <Button
            type="primary"
            onClick={() => {
              if (!user) {
                Message.warning('请先登录');
                navigate('/login');
                return;
              }
              navigate(`/upload?targetId=${target.id}`);
            }}
          >
            上传该工具邀请码
          </Button>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 600 }}>邀请码列表（{total}）</span>
        <Select
          value={sort}
          style={{ width: 160 }}
          onChange={(v) => {
            setSort(v);
            setPage(1);
            fetchCodes(1, v);
          }}
          options={[
            { label: '默认（有效优先）', value: 'default' },
            { label: '最新', value: 'newest' },
            { label: '最多查看', value: 'most_view' },
            { label: '最多有效', value: 'most_valid' },
          ]}
        />
      </div>

      <Spin loading={loading} style={{ width: '100%' }}>
        {codes.length === 0 ? (
          <Empty description="暂无邀请码，快来上传第一个吧" />
        ) : (
          <List
            bordered
            dataSource={codes}
            render={(item) => {
              const st = CODE_STATUS[item.status] || CODE_STATUS.pending;
              return (
                <List.Item
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/codes/${item.id}`)}
                  extra={
                    <Button type="text" onClick={() => navigate(`/codes/${item.id}`)}>
                      查看详情
                    </Button>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar size={36} style={{ background: '#165dff' }}>
                        {item.user?.nickname?.[0]?.toUpperCase() || '?'}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <span style={{ fontFamily: 'monospace', fontSize: 16 }}>{item.code}</span>
                        <Tag size="small" color={st.color}>
                          {st.text}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space size="large" style={{ fontSize: 13, color: '#86909c' }}>
                        <span>上传者：{item.user?.nickname || '匿名'}</span>
                        <span>查看 {item.viewCount}</span>
                        <span style={{ color: '#00b42a' }}>有效 {item.validCount}</span>
                        <span style={{ color: '#f53f3f' }}>无效 {item.invalidCount}</span>
                      </Space>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Spin>

      {total > 10 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Pagination
            current={page}
            total={total}
            pageSize={10}
            onChange={(p) => {
              setPage(p);
              fetchCodes(p, sort);
            }}
          />
        </div>
      )}
    </div>
  );
}
