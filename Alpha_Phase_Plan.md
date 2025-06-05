# 老年服务管理应用 - Alpha 阶段实施计划

## 1. Alpha 阶段核心目标 (回顾PRD v0.3)

*   **统一数据，消除信息孤岛**：实现客户信息的集中管理。
*   **自动生成电话联系与配送排班**：实现电话联系任务的自动化生成和初步管理。
*   **对应 PRD 里程碑**: Alpha (07/2025) - 客户管理 + 自动任务调度。
*   **数据录入方式**: 本阶段优先实现客户数据的手动录入功能。

## 2. 技术栈

*   **前端**: React + Ant Design (AntD)
*   **后端**: Node.js (Express.js)
*   **数据库**: PostgreSQL
*   **版本控制**: Git

## 3. Alpha 阶段实施流程图

```mermaid
graph TD
    A[项目启动与基础搭建] --> B(前端AntD集成与布局);
    B --> C(客户信息管理模块 - AntD);
    C --> D(用户认证与权限 - AntD);
    D --> E(电话联系任务自动生成 - 后端);
    E --> F(电话任务处理与状态更新 - AntD & 后端);
    F --> G(Alpha 版本功能集成与测试);

    subgraph "后端 (API & 数据库)"
        C1[实现客户信息 CRUD API];
        D1[实现用户登录/注册 API];
        D2[角色与权限逻辑];
        E1[开发任务生成调度器 (含“周三归属”规则)];
        F1[实现电话任务更新 API];
    end

    subgraph "前端 (React + Ant Design)"
        B1[安装并配置AntD];
        B2[使用AntD Layout组件重构App.js];
        C2[客户列表页 (AntD Table, Button)];
        C3[客户信息增/改表单 (AntD Form, Modal)];
        D3[用户登录页面 (AntD Form)];
        D4[根据角色显示不同内容 (AntD Menu)];
        F2[电话任务列表展示 (AntD List/Table)];
        F3[电话任务处理界面 (AntD Modal/Form)];
    end

    B --> B1; B --> B2;
    C --> C1; C --> C2; C --> C3;
    D --> D1; D --> D2; D --> D3; D --> D4;
    E --> E1;
    F --> F1; F --> F2; F --> F3;
```

## 4. Alpha 阶段详细步骤说明

### 步骤 1: 前端 Ant Design 集成与基础布局
*   **任务**:
    *   在 `frontend` 项目中安装 `antd` 依赖。
    *   引入 AntD 的全局 CSS 样式。
    *   使用 AntD 的 `Layout` 组件（如 `Sider`, `Header`, `Content`）来重新组织 `frontend/src/App.js` 的整体布局，使其更符合 AntD 的设计风格。
    *   使用 AntD 的 `Menu` 组件构建侧边栏导航。
*   **涉及文件 (主要)**: `frontend/package.json`, `frontend/src/App.js`, `frontend/src/index.js` (引入样式).

### 步骤 2: 客户信息管理模块 (对应 PRD 5.1)
*   **后端**:
    *   实现客户信息 CRUD (Create, Read, Update, Delete) 的 API 接口 (e.g., `/api/clients`, `/api/clients/:id`).
    *   API 应能处理客户基本信息、备注、文档（初期可能只记录元数据）。
    *   数据库交互：`Clients`, `Client_Notes`, `Client_Documents` 表。
*   **前端 (AntD)**:
    *   **客户列表页面 (`/clients`)**:
        *   使用 AntD `Table` 组件展示客户数据，包括姓名、联系方式、地址、状态等。
        *   实现分页、表头排序（可由后端支持）。
        *   提供简单的搜索/筛选功能。
        *   使用 AntD `Button` 组件实现“添加新客户”及表格中每行的“查看详情”、“编辑”、“停用/启用”操作。
    *   **客户添加/编辑功能**:
        *   使用 AntD `Modal` 组件承载 `Form` 组件。
        *   表单包含 PRD 中定义的客户所有字段。
        *   实现表单数据校验。
*   **涉及文件 (示例)**:
    *   后端: `backend/routes/clientRoutes.js`, `backend/controllers/clientController.js`.
    *   前端: `frontend/src/pages/ClientListPage.js`, `frontend/src/components/ClientForm.js`.

### 步骤 3: 用户认证与权限 (对应 PRD 4. 用户画像)
*   **后端**:
    *   实现用户登录 API (e.g., `/api/auth/login`)，验证凭据，成功后返回 JWT (JSON Web Token)。
    *   实现用户注册 API (e.g., `/api/auth/register`) (初期可选，或仅限管理员操作)。
    *   创建中间件验证 JWT，保护需要授权的 API 路由。
    *   （初步）实现基于角色的 API 访问控制逻辑。
    *   数据库交互：`Users`, `Roles` 表。
*   **前端 (AntD)**:
    *   **登录页面 (`/login`)**: 使用 AntD `Form` 组件构建登录表单。
    *   实现前端路由守卫/逻辑，未登录用户访问受保护页面时跳转到登录页。
    *   登录成功后，将 JWT 存储在 localStorage 或 sessionStorage 中，并在后续 API 请求的 Authorization header 中携带。
    *   在 `App.js` 或全局状态中管理用户登录状态和角色信息。
    *   根据用户角色动态生成或显示侧边栏 `Menu` 项。
    *   实现退出登录功能。
*   **涉及文件 (示例)**:
    *   后端: `backend/routes/authRoutes.js`, `backend/controllers/authController.js`, `backend/middleware/authMiddleware.js`.
    *   前端: `frontend/src/pages/LoginPage.js`, `frontend/src/services/authService.js`, `frontend/src/App.js` (状态管理与路由)。

### 步骤 4: 电话联系任务自动生成 (对应 PRD 5.2)
*   **后端**:
    *   开发一个后台调度器/定时任务 (e.g., 使用 `node-cron` 或类似库)。
    *   调度器在每个**日历月份的第一个工作日**运行。
    *   **核心逻辑**:
        1.  获取当前运行日期 (`run_date`)。
        2.  计算 `run_date` 所在周的周三 (`target_wednesday`)。
        3.  获取 `target_wednesday` 的日历月份，此即为目标“**服务月份**”。
        4.  从数据库查询所有 `is_active = TRUE` 的客户。
        5.  为每个活跃客户，检查是否已为该客户在此目标“服务月份”生成过电话联系任务。
        6.  若未生成，则创建新的电话联系任务记录，并存入 `ServiceEvents` 和 `PhoneCallTasks` 表。任务状态初始为“Scheduled”或“Pending Contact”。
*   **涉及文件 (示例)**: `backend/scheduler/taskScheduler.js`, `backend/services/taskGenerationService.js`.

### 步骤 5: 电话任务处理与状态更新 (对应 PRD 5.2)
*   **后端**:
    *   实现 API 接口 (e.g., `/api/tasks/phone/:taskId`) 允许更新电话任务的状态 (如 'Confirmed', 'No Answer', 'Skipped')、通话备注、下次回访日期等。
    *   API 应能处理 PRD 中提到的“未接电话 → 次日自动提醒；若周五仍未接 → 状态更新为‘跳过’”的逻辑（状态更新由前端发起，后端记录）。
    *   数据库交互：`ServiceEvents`, `PhoneCallTasks` 表。
*   **前端 (AntD)**:
    *   **电话任务列表页面 (`/tasks` 或 `/phone-tasks`)**:
        *   使用 AntD `Table` 或 `List` 组件展示分配给当前登录用户（客户联系员）的电话任务。
        *   显示任务关键信息：客户姓名、联系电话、任务状态、计划联系日期/月份、备注等。
        *   提供筛选/排序功能（按状态、日期等）。
    *   **任务处理界面**:
        *   可能通过在表格行内展开、或点击任务后弹出 AntD `Modal` 的方式。
        *   使用 AntD `Form`, `Select`, `DatePicker`, `Input.TextArea` 等组件让用户更新任务状态、记录通话结果、设置下次回访日期。
*   **涉及文件 (示例)**:
    *   后端: `backend/routes/taskRoutes.js`, `backend/controllers/taskController.js`.
    *   前端: `frontend/src/pages/PhoneTaskListPage.js`, `frontend/src/components/PhoneTaskItem.js` or `PhoneTaskModal.js`.

### 步骤 6: Alpha 版本功能集成与测试
*   **任务**:
    *   确保前后端功能顺畅对接，API 调用正常。
    *   进行内部测试，覆盖核心用户场景：
        *   管理员/运营经理登录。
        *   手动添加/编辑客户。
        *   客户联系员登录。
        *   查看自动生成的电话任务列表。
        *   处理电话任务，更新状态和备注。
    *   修复测试过程中发现的BUG。

## 5. 后续考虑 (Alpha之后)
*   Google Sheets 同步/导入导出。
*   配送任务与司机派单模块。
*   Heavy Chore 任务模块。
*   账单与报表模块。
*   更完善的通知中心。

---
*本文档基于截止 2025-06-04 的讨论结果编写。*