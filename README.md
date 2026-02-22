# Tina Crazy 8s 🃏

一个基于 React + Tailwind CSS + Framer Motion 构建的经典“疯狂 8 点”纸牌游戏。

## 🚀 部署到 Vercel 指南

由于我是一个 AI 环境，无法直接操作您的 GitHub 账号，请按照以下步骤手动完成部署：

### 1. 准备工作
确保您已经在本地安装了 [Git](https://git-scm.com/) 和 [Node.js](https://nodejs.org/)。

### 2. 初始化 Git 并推送到 GitHub
1. 在您的电脑上新建一个文件夹，并将此项目的所有文件下载/复制进去。
2. 打开终端（Terminal/Command Prompt），进入该文件夹。
3. 执行以下命令：
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tina Crazy 8s"
   ```
4. 在 GitHub 上创建一个新的仓库（Repository）。
5. 关联远程仓库并推送：
   ```bash
   git remote add origin https://github.com/您的用户名/您的仓库名.git
   git branch -M main
   git push -u origin main
   ```

### 3. 在 Vercel 上部署
1. 登录 [Vercel 官网](https://vercel.com/)。
2. 点击 **"Add New..."** -> **"Project"**。
3. 导入您刚刚创建的 GitHub 仓库。
4. Vercel 会自动识别这是一个 Vite 项目：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 **"Deploy"**。

### 4. 环境变量（可选）
如果您的游戏将来需要使用 Gemini API，请在 Vercel 项目设置的 **Environment Variables** 中添加 `GEMINI_API_KEY`。

---

## 🎮 游戏规则
- **发牌**：玩家和 AI 各 8 张牌。
- **出牌**：花色或点数匹配即可出牌。
- **万能 8 点**：数字“8”是万能牌，可以随时打出并指定新花色。
- **摸牌**：无牌可出时需摸一张。
- **胜利**：先清空手牌的一方获胜。

祝您游戏愉快！
