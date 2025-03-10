1. 首先，需要生成 SSH 密钥对并配置到 GitHub Secrets 和服务器中。请在本地执行以下命令：

```bash
# 生成 SSH 密钥对
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

2. 然后，将生成的公钥添加到服务器的 authorized_keys 文件中：

```bash
# 复制公钥内容
cat ~/.ssh/github_actions_deploy.pub

# 在服务器上执行（将上面的公钥内容添加到这个文件中）
echo "你的公钥内容" >> ~/.ssh/authorized_keys
```

3. 在 GitHub 仓库中添加以下 Secrets（在仓库的 Settings > Secrets and variables > Actions 中）：

- `SSH_PRIVATE_KEY`: 私钥内容（~/.ssh/github_actions_deploy 文件的内容）
- `SERVER_HOST`: 113.44.14.174
- `SERVER_USERNAME`: root
- `DEPLOY_PATH`: /var/www/html

4. 在项目根目录创建 `.github/workflows/deploy.yml` 文件，内容如下：

```yaml:.github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 'latest'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
          
      - name: Add host key
        run: |
          mkdir -p ~/.ssh
          ssh-keyscan -H ${{ secrets.SERVER_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy with rollback
        run: |
          # 创建时间戳目录
          TIMESTAMP=$(date +%Y%m%d_%H%M%S)
          DEPLOY_DIR="${{ secrets.DEPLOY_PATH }}/releases/${TIMESTAMP}"
          CURRENT_LINK="${{ secrets.DEPLOY_PATH }}/current"
          
          # 创建发布目录
          ssh ${{ secrets.SERVER_USERNAME }}@${{ secrets.SERVER_HOST }} "mkdir -p ${DEPLOY_DIR}"
          
          # 复制构建文件到服务器
          scp -r _site/* ${{ secrets.SERVER_USERNAME }}@${{ secrets.SERVER_HOST }}:${DEPLOY_DIR}
          
          # 部署新版本（使用原子操作）
          ssh ${{ secrets.SERVER_USERNAME }}@${{ secrets.SERVER_HOST }} "
            ln -sfn ${DEPLOY_DIR} ${CURRENT_LINK}.tmp && \
            mv -Tf ${CURRENT_LINK}.tmp ${CURRENT_LINK} && \
            echo 'Deployment successful!' || \
            (echo 'Deployment failed, rolling back...' && \
            rm -rf ${DEPLOY_DIR} && \
            exit 1)
          "
          
          # 保留最近的5个部署版本，删除旧版本
          ssh ${{ secrets.SERVER_USERNAME }}@${{ secrets.SERVER_HOST }} "
            cd ${{ secrets.DEPLOY_PATH }}/releases && \
            ls -t | tail -n +6 | xargs -r rm -rf
          "

```

5. 最后，需要修改 Nginx 配置，将根目录指向 `/var/www/html/current`。在服务器上编辑 Nginx 配置文件：

```nginx
server {
    # ... 其他配置 ...
    root /var/www/html/current;
    # ... 其他配置 ...
}
```

这个配置会：
1. 在每次推送到 main 分支时触发构建
2. 使用最新版本的 Node.js 构建项目
3. 将构建后的文件部署到服务器
4. 使用软链接实现零停机部署
5. 支持自动回滚（如果部署失败）
6. 保留最近 5 个版本的部署历史

使用前请确保：
1. 已经正确添加了所有 GitHub Secrets
2. 服务器上的目标目录具有适当的写入权限
3. Nginx 配置已更新并重启