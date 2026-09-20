import { useEffect, useState } from 'react';
import {
  Input,
  Card,
  Tag,
  Grid,
  Pagination,
  Tabs,
  Empty,
  Spin,
  Space,
  Button,
} from '@arco-design/web-react';
import { useNavigate } from 'react-router-dom';
import { targetApi, Target } from '../api';
import { CATEGORIES } from '../constants';

const { Row, Col } = Grid;

export default function Home() {
  const navigate = useNavigate();
  const [list, setList] = useState<Target[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchData = async (p = page, kw = keyword, cat = category) => {
    setLoading(true);
    try {
      const res = await targetApi.list({
        page: p,
        pageSize: 12,
        keyword: kw || undefined,
        category: cat || undefined,
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

  const onSearch = () => {
    setPage(1);
    fetchData(1, keyword, category);
  };

  const onCategory = (cat: string) => {
    const next = category === cat ? '' : cat;
    setCategory(next);
    setPage(1);
    fetchData(1, keyword, next);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>发现 AI 工具的邀请码</h1>
        <p style={{ color: '#86909c', marginBottom: 20 }}>
          按工具分类浏览、分享邀请码，用有效/无效反馈帮社区筛选真实可用的码
        </p>
        <Space>
          <Input
            style={{ width: 400, maxWidth: '70vw' }}
            placeholder="搜索 AI 工具，如 Cursor、Midjourney"
            value={keyword}
            onChange={setKeyword}
            onPressEnter={onSearch}
            allowClear
          />
          <Button type="primary" onClick={onSearch}>
            搜索
          </Button>
        </Space>
      </div>

      <Tabs
        activeTab={category || 'all'}
        onChange={(key) => onCategory(key === 'all' ? '' : key)}
        type="rounded"
        style={{ marginBottom: 16 }}
      >
        <Tabs.TabPane key="all" title="全部" />
        {CATEGORIES.map((c) => (
          <Tabs.TabPane key={c} title={c} />
        ))}
      </Tabs>

      <Spin loading={loading} style={{ width: '100%' }}>
        {list.length === 0 ? (
          <Empty description="未找到相关工具，您可以申请新增" />
        ) : (
          <Row gutter={[16, 16]}>
            {list.map((t) => (
              <Col key={t.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => navigate(`/targets/${t.id}`)}
                  style={{ height: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: '#f2f3f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        flexShrink: 0,
                      }}
                    >
                      {t.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontWeight: 600 }}>{t.name}</div>
                      <Tag size="small" color="arcoblue">
                        {t.category}
                      </Tag>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, color: '#86909c', fontSize: 13 }}>
                    {t.codeCount ?? 0} 个邀请码
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>

      {total > 12 && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Pagination
            current={page}
            total={total}
            pageSize={12}
            onChange={(p) => {
              setPage(p);
              fetchData(p, keyword, category);
            }}
          />
        </div>
      )}
    </div>
  );
}
