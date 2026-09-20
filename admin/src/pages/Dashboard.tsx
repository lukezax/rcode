import { useEffect, useState } from 'react';
import { Card, Grid, Statistic, Spin } from '@arco-design/web-react';
import { adminApi } from '../api';

const { Row, Col } = Grid;

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const items = [
    { title: '目标总数', value: stats?.targetCount, color: '#165dff' },
    { title: '邀请码总数', value: stats?.codeCount, color: '#00b42a' },
    { title: '用户总数', value: stats?.userCount, color: '#722ed1' },
    { title: '待审批目标', value: stats?.pendingTargetCount, color: '#ff7d00' },
    { title: '待处理举报', value: stats?.pendingReportCount, color: '#f53f3f' },
    { title: '有效邀请码', value: stats?.validCodeCount, color: '#00b42a' },
    { title: '无效邀请码', value: stats?.invalidCodeCount, color: '#f53f3f' },
  ];

  return (
    <Spin loading={loading} style={{ width: '100%' }}>
      <Row gutter={[16, 16]}>
        {items.map((it) => (
          <Col key={it.title} xs={12} sm={8} md={6}>
            <Card>
              <Statistic title={it.title} value={it.value ?? 0} styleValue={{ color: it.color }} />
            </Card>
          </Col>
        ))}
      </Row>
    </Spin>
  );
}
