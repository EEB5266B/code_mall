import { IRequest } from 'itty-router'
import { auth, responseErrorBody, responseUnauthorizedBody } from '../../common/utils/authUtil'
import { env } from 'cloudflare:workers'

export interface XianyuAutoReplyCreateRequest {
	/**
	 * 订单编号
	 */
	order_id: string
	/**
	 * 商品编号
	 */
	item_id: string
	/**
	 * 订单数量
	 */
	order_quantity: number
}

export default async (request: IRequest, ...args: any[]): Promise<Response> => {
	try {
		const query = request.query
		const bodyStr = await request.clone().text()

		console.log(`收到 /xianyu-auto-reply/create 请求, query 参数 ${JSON.stringify(query)}, body ${bodyStr}`)
		const body = await request.json<XianyuAutoReplyCreateRequest>()

		if (auth(request.headers)) {
			const { order_id, item_id, order_quantity } = body
			const cardItems: string[] = []

			for (let i = 0; i < order_quantity; i++) {
				const id = crypto.randomUUID()
				const create_time = Date.now()
				await env.CODE_MALL_DB.prepare('INSERT INTO order_cards (id, order_no, goods_no, biz_order_no, create_time) VALUES (?, ?, ?, ?, ?)').bind(id, order_id, item_id, order_id, create_time).run()
				cardItems.push(id)
			}

			let lines = []
			lines.push(`订单编号：${order_id}`)
			lines.push(`卡密：${cardItems.join(',')}`)
			lines.push(`商城地址：https://mall.eeb5266b.com`)
			lines.push(`兑换地址：${cardItems.map((card) => 'https://mall.eeb5266b.com?key=' + card).join(',')}`)
			lines.push(`温馨提示：卡密一经兑现，不支持退换或退款，请确认需求后再下单。有问题可留言，我会尽快回复～`)
			return new Response(lines.join('\n'))
		} else {
			return responseUnauthorizedBody()
		}
	} catch (e) {
		console.error(e)
	}
	return responseErrorBody()
}
