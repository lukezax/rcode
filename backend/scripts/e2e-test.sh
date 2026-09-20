#!/usr/bin/env bash
# 端到端 API 测试脚本
set -u
BASE="http://localhost:3000/api"
PASS=0
FAIL=0

# 等待服务就绪
echo "等待服务启动..."
for i in $(seq 1 40); do
  if curl -s "$BASE/targets" > /dev/null 2>&1; then
    echo "服务已就绪"
    break
  fi
  sleep 1
done

assert() {
  local name="$1"
  local cond="$2"
  if [ "$cond" = "1" ]; then
    echo "  ✅ $name"
    PASS=$((PASS+1))
  else
    echo "  ❌ $name"
    FAIL=$((FAIL+1))
  fi
}

echo ""
echo "========== 1. 认证模块 =========="

# 注册
REG=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123","nickname":"Alice"}')
echo "注册: $REG"
TOKEN=$(echo "$REG" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
assert "注册返回 token" "$([ -n "$TOKEN" ] && echo 1 || echo 0)"

# 重复注册应失败
DUP=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}')
echo "重复注册: $DUP"
echo "$DUP" | grep -q "已被注册" && assert "重复注册被拒绝" 1 || assert "重复注册被拒绝" 0

# 登录
LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}')
TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
assert "登录成功" "$([ -n "$TOKEN" ] && echo 1 || echo 0)"

# 获取当前用户
ME=$(curl -s "$BASE/auth/me" -H "Authorization: Bearer $TOKEN")
echo "当前用户: $ME"
echo "$ME" | grep -q "alice@example.com" && assert "获取当前用户" 1 || assert "获取当前用户" 0

# 无 token 访问受保护接口
NOAUTH=$(curl -s "$BASE/auth/me")
echo "$NOAUTH" | grep -qiE "认证|401" && assert "未认证被拒绝" 1 || assert "未认证被拒绝" 0

echo ""
echo "========== 2. 目标模块 =========="

# 目标列表
TARGETS=$(curl -s "$BASE/targets?page=1&pageSize=5")
echo "目标列表(截断): $(echo "$TARGETS" | head -c 300)"
echo "$TARGETS" | grep -q "OpenCode" && assert "目标列表包含预置目标" 1 || assert "目标列表包含预置目标" 0

# 目标详情
TDETAIL=$(curl -s "$BASE/targets/1")
echo "目标详情: $(echo "$TDETAIL" | head -c 200)"
echo "$TDETAIL" | grep -q "codeCount" && assert "目标详情返回 codeCount" 1 || assert "目标详情返回 codeCount" 0

# 分类筛选
CAT=$(curl -s "$BASE/targets?category=AI%20%E7%BC%96%E7%A8%8B")
echo "$CAT" | grep -q "Cursor" && assert "分类筛选有效" 1 || assert "分类筛选有效" 0

# 搜索
SEARCH=$(curl -s "$BASE/targets?keyword=cursor")
echo "$SEARCH" | grep -q "Cursor" && assert "关键词搜索有效" 1 || assert "关键词搜索有效" 0

# 申请新增目标
APPLY=$(curl -s -X POST "$BASE/targets/apply" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"TestTool","slug":"test-tool","category":"AI 编程","website":"https://test.com","reason":"测试申请"}')
echo "申请新增目标: $APPLY"
echo "$APPLY" | grep -q "pending" && assert "申请新增目标" 1 || assert "申请新增目标" 0

# 重复申请应失败
APPLY2=$(curl -s -X POST "$BASE/targets/apply" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"TestTool","slug":"test-tool","category":"AI 编程","reason":"重复"}')
echo "$APPLY2" | grep -q "已存在" && assert "重复申请被拒绝" 1 || assert "重复申请被拒绝" 0

echo ""
echo "========== 3. 邀请码模块 =========="

# 上传邀请码
CODE=$(curl -s -X POST "$BASE/codes" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"targetId":1,"code":"INVITE123ABC","link":"https://opencode.ai/invite/INVITE123ABC","rewardShare":"双方得10美元","rewardReceive":"新用户得5美元","description":"测试码"}')
echo "上传邀请码: $CODE"
CODE_ID=$(echo "$CODE" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
assert "上传邀请码" "$([ -n "$CODE_ID" ] && echo 1 || echo 0)"

# 重复邀请码应失败
CODE_DUP=$(curl -s -X POST "$BASE/codes" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"targetId":1,"code":"INVITE123ABC"}')
echo "$CODE_DUP" | grep -q "已被上传" && assert "重复邀请码被拒绝" 1 || assert "重复邀请码被拒绝" 0

# 游客查看详情（部分隐藏）
GUEST=$(curl -s "$BASE/codes/$CODE_ID")
echo "游客详情: $GUEST"
echo "$GUEST" | grep -q '\*\*\*' && assert "游客看到隐藏邀请码" 1 || assert "游客看到隐藏邀请码" 0
echo "$GUEST" | grep -q '"isFullCode":false' && assert "游客 isFullCode=false" 1 || assert "游客 isFullCode=false" 0

# 登录用户查看详情（完整码）
LOGGED=$(curl -s "$BASE/codes/$CODE_ID" -H "Authorization: Bearer $TOKEN")
echo "登录详情: $LOGGED"
echo "$LOGGED" | grep -q "INVITE123ABC" && assert "登录用户看到完整码" 1 || assert "登录用户看到完整码" 0

# 增加查看次数
VIEW1=$(curl -s -X POST "$BASE/codes/$CODE_ID/view")
VIEW2=$(curl -s -X POST "$BASE/codes/$CODE_ID/view")
echo "查看次数: $VIEW1 -> $VIEW2"
echo "$VIEW2" | grep -q '"viewCount":2' && assert "查看次数递增" 1 || assert "查看次数递增" 0

# 目标下的邀请码列表
CODELIST=$(curl -s "$BASE/targets/1/codes?sort=newest")
echo "邀请码列表: $(echo "$CODELIST" | head -c 250)"
echo "$CODELIST" | grep -q '\*\*\*' && assert "邀请码列表返回隐藏码" 1 || assert "邀请码列表返回隐藏码" 0

# 上传者不能给自己投票
SELFVOTE=$(curl -s -X POST "$BASE/codes/$CODE_ID/feedback" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" -d '{"vote":"valid"}')
echo "自投: $SELFVOTE"
echo "$SELFVOTE" | grep -q "不能给自己" && assert "上传者不能自投" 1 || assert "上传者不能自投" 0

echo ""
echo "========== 4. 反馈模块（第二个用户）=========="

REG2=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"email":"bob@example.com","password":"password123","nickname":"Bob"}')
TOKEN2=$(echo "$REG2" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
assert "注册第二个用户" "$([ -n "$TOKEN2" ] && echo 1 || echo 0)"

# Bob 投有效票
FB1=$(curl -s -X POST "$BASE/codes/$CODE_ID/feedback" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" -d '{"vote":"valid","comment":"好用"}')
echo "反馈(有效): $FB1"
echo "$FB1" | grep -q '"validCount":1' && echo "$FB1" | grep -q '"status":"valid"' \
  && assert "有效票后状态为 valid" 1 || assert "有效票后状态为 valid" 0

# Bob 改投无效
FB2=$(curl -s -X POST "$BASE/codes/$CODE_ID/feedback" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" -d '{"vote":"invalid"}')
echo "反馈(改为无效): $FB2"
echo "$FB2" | grep -q '"invalidCount":1' && echo "$FB2" | grep -q '"validCount":0' \
  && assert "修改投票计数正确" 1 || assert "修改投票计数正确" 0

# 加入第三个用户投有效，形成 1:1 待验证
curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"email":"carol@example.com","password":"password123","nickname":"Carol"}' > /dev/null
TOKEN3=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"carol@example.com","password":"password123"}' | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
FB3=$(curl -s -X POST "$BASE/codes/$CODE_ID/feedback" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN3" -d '{"vote":"valid"}')
echo "第三个用户投有效: $FB3"
echo "$FB3" | grep -q '"status":"pending"' && assert "1:1 时状态为待验证" 1 || assert "1:1 时状态为待验证" 0

echo ""
echo "========== 5. 举报 & 用户中心 =========="

REPORT=$(curl -s -X POST "$BASE/codes/$CODE_ID/report" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" -d '{"reason":"已失效","detail":"测试举报"}')
echo "举报: $REPORT"
echo "$REPORT" | grep -q "pending" && assert "举报提交" 1 || assert "举报提交" 0

# 重复举报应失败
REPORT2=$(curl -s -X POST "$BASE/codes/$CODE_ID/report" -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" -d '{"reason":"已失效"}')
echo "$REPORT2" | grep -q "已举报" && assert "重复举报被拒绝" 1 || assert "重复举报被拒绝" 0

MYCODES=$(curl -s "$BASE/me/codes" -H "Authorization: Bearer $TOKEN")
echo "我的上传: $(echo "$MYCODES" | head -c 200)"
echo "$MYCODES" | grep -q "INVITE123ABC" && assert "我的上传包含邀请码" 1 || assert "我的上传包含邀请码" 0

MYFB=$(curl -s "$BASE/me/feedbacks" -H "Authorization: Bearer $TOKEN2")
echo "我的反馈: $(echo "$MYFB" | head -c 200)"
echo "$MYFB" | grep -q '"vote":"invalid"' && assert "我的反馈包含记录" 1 || assert "我的反馈包含记录" 0

MYAPP=$(curl -s "$BASE/me/applications" -H "Authorization: Bearer $TOKEN")
echo "$MYAPP" | grep -q "TestTool" && assert "我的申请包含目标" 1 || assert "我的申请包含目标" 0

echo ""
echo "========== 6. 管理后台 =========="

# 管理员登录
ADMIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}')
ADMIN_TOKEN=$(echo "$ADMIN" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "管理员登录: $(echo "$ADMIN" | head -c 150)"
assert "管理员登录" "$([ -n "$ADMIN_TOKEN" ] && echo 1 || echo 0)"

# 普通用户访问管理接口应 403
FORBID=$(curl -s "$BASE/admin/stats" -H "Authorization: Bearer $TOKEN")
echo "普通用户访问管理接口: $FORBID"
echo "$FORBID" | grep -q "管理员" && assert "普通用户被拒绝" 1 || assert "普通用户被拒绝" 0

# 待审批目标
PENDING=$(curl -s "$BASE/admin/targets/pending" -H "Authorization: Bearer $ADMIN_TOKEN")
echo "待审批目标: $(echo "$PENDING" | head -c 250)"
PENDING_ID=$(echo "$PENDING" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
assert "待审批列表包含申请" "$([ -n "$PENDING_ID" ] && echo 1 || echo 0)"

# 通过审批
APPROVE=$(curl -s -X POST "$BASE/admin/targets/$PENDING_ID/approve" -H "Authorization: Bearer $ADMIN_TOKEN")
echo "审批通过: $APPROVE"
echo "$APPROVE" | grep -q '"status":"active"' && assert "审批通过" 1 || assert "审批通过" 0

# 邀请码管理列表
ACODES=$(curl -s "$BASE/admin/codes" -H "Authorization: Bearer $ADMIN_TOKEN")
echo "$ACODES" | grep -q "INVITE123ABC" && assert "邀请码管理列表" 1 || assert "邀请码管理列表" 0

# 举报列表
REPORTS=$(curl -s "$BASE/admin/reports" -H "Authorization: Bearer $ADMIN_TOKEN")
echo "举报列表: $(echo "$REPORTS" | head -c 200)"
REPORT_ID=$(echo "$REPORTS" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
echo "$REPORTS" | grep -q "已失效" && assert "举报列表" 1 || assert "举报列表" 0

# 处理举报（下架）
RESOLVE=$(curl -s -X POST "$BASE/admin/reports/$REPORT_ID/resolve" -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" -d '{"action":"remove"}')
echo "处理举报: $RESOLVE"
echo "$RESOLVE" | grep -q "resolved" && assert "处理举报(下架)" 1 || assert "处理举报(下架)" 0

# 下架后邀请码状态
AFTER=$(curl -s "$BASE/codes/$CODE_ID" -H "Authorization: Bearer $ADMIN_TOKEN")
echo "$AFTER" | grep -q '"status":"removed"' && assert "邀请码已下架" 1 || assert "邀请码已下架" 0

# 统计
STATS=$(curl -s "$BASE/admin/stats" -H "Authorization: Bearer $ADMIN_TOKEN")
echo "统计: $STATS"
echo "$STATS" | grep -q "targetCount" && assert "统计数据" 1 || assert "统计数据" 0

# 用户列表
USERS=$(curl -s "$BASE/admin/users" -H "Authorization: Bearer $ADMIN_TOKEN")
echo "$USERS" | grep -q "alice@example.com" && assert "用户列表" 1 || assert "用户列表" 0

echo ""
echo "======================================"
echo "测试完成: 通过 $PASS 项, 失败 $FAIL 项"
echo "======================================"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
