const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000  // ⚠️ 端口固定 5000

// 中间件
app.use(cors())           // 允许跨域，前端才能调接口
app.use(express.json())   // 解析 JSON 请求体

// 测试路由——确认服务跑起来了
app.get('/api/test', (req, res) => {
  res.json({ message: '后端小店开业啦～', time: new Date().toLocaleString() })
})

// 启动！
app.listen(PORT, () => {
  console.log(`🚀 服务器跑起来了：http://localhost:${PORT}`)
})

