import { Router } from 'itty-router'
import goofishOpenInfo from './api/goofish/open/info'
import goofishUserInfo from './api/goofish/user/info'
import goofishGoodsList from './api/goofish/goods/list'
import goofishGoodsDetail from './api/goofish/goods/detail'
import goofishOrderPurchaseCreate from './api/goofish/order/purchase/create'
import goodsExchange from './api/goods/exchange'
import goodsDownload from './api/goods/download'
import xianyuAutoReplyCreate from './api/xianyuAutoReply/create'

// 创建路由器
const router = Router()
router
	// 闲管家
	.post('/goofish/open/info', goofishOpenInfo)
	.post('/goofish/user/info', goofishUserInfo)
	.post('/goofish/goods/list', goofishGoodsList)
	.post('/goofish/goods/detail', goofishGoodsDetail)
	.post('/goofish/order/purchase/create', goofishOrderPurchaseCreate)
	// xianyu-auto-reply
	.post('/xianyu-auto-reply/create', xianyuAutoReplyCreate)
	// 商品
	.get('/api/goods/exchange/:goods/:key', goodsExchange)
	.get('/api/goods/download/:key', goodsDownload)
	.all('*', () => new Response('Not Found', { status: 404 }))

// 导出默认 fetch handler
export default { ...router }
