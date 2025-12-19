import {Router} from 'itty-router'
import goofishOpenInfo from './api/goofish/open/info'
import goofishUserInfo from './api/goofish/user/info'

// 创建路由器
const router = Router()
router
	// 闲管家
	.post('/goofish/open/info', goofishOpenInfo)
	.post('/goofish/user/info', goofishUserInfo)
	.all('*', () => new Response('Not Found', {status: 404}))

// 导出默认 fetch handler
export default {...router}


