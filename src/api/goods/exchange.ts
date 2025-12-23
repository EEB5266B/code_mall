import { IRequest } from 'itty-router'
import { env } from 'cloudflare:workers'
import { OrderCards } from '../../dataobject/orderCards'

export default async (request: IRequest, ...args: any[]): Promise<Response> => {
	const { goods, key } = request.params

	console.log(`使用 ${key} 兑换 ${goods} 商品`)

	const orderCard = await env.CODE_MALL_DB.prepare('select id, order_no, goods_no, biz_order_no, create_time, goods, consume_time from order_cards where id = ?').bind(key).first<OrderCards>()

	if (!orderCard) {
		return new Response('卡密错误', { status: 400 })
	}

	if (orderCard.consume_time && orderCard.goods) {
		if (orderCard.goods !== goods) {
			return new Response('卡密已使用，请到订单页面查询', { status: 400 })
		}
	} else {
		await env.CODE_MALL_DB.prepare('update order_cards set consume_time = ?, goods = ? where id = ?').bind(Date.now(), goods, key).run()
	}

	return new Response()
}
