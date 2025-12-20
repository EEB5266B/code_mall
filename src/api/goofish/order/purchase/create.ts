import { IRequest } from 'itty-router'
import { genSign, responseBody, responseErrorBody } from '../../../../common/utils/goofishUtil'
import { env } from 'cloudflare:workers'

export interface OrderPurchaseCreateRequest {
	/**
	 * 管家订单号
	 */
	order_no: string
	/**
	 * 商品编码
	 */
	goods_no: string
	/**
	 * 购买数量
	 */
	buy_quantity: number
	/**
	 * 最大金额
	 */
	max_amount: number
	/**
	 * 回调地址
	 */
	notify_url: string
	/**
	 * 业务订单号
	 */
	biz_order_no: string
	/**
	 * 管家商品ID
	 */
	product_id: number
	/**
	 * 管家规格ID
	 */
	product_sku: number
	/**
	 * 闲鱼商品ID
	 */
	item_id: number
}

export interface OrderPurchaseCreateResponse {
	/**
	 * 商家订单号
	 */
	order_no: string
	/**
	 * 平台订单号
	 */
	out_order_no: string
	/**
	 * 订单状态
	 * 10：处理中
	 * 20：已成功
	 * 30：已失败
	 */
	order_status: number
	/**
	 * 订单金额
	 */
	order_amount: number
	/**
	 * 下单时间
	 */
	order_time: number
	/**
	 * 完结时间
	 */
	end_time: number
	/**
	 * 卡密列表
	 */
	card_items: CardItems[]
	/**
	 * 订单备注
	 */
	remark: string
}

export interface CardItems {
	/**
	 * 卡号
	 */
	card_no?: string
	/**
	 * 卡密
	 */
	card_pwd: string
}

export default async (request: IRequest, ...args: any[]): Promise<Response> => {
	try {
		const query = request.query
		const bodyStr = await request.clone().text()
		const body = await request.json<OrderPurchaseCreateRequest>()
		const orderTime = Date.now()

		console.log(`收到 /goofish/order/purchase/create 请求, query 参数 ${JSON.stringify(query)}, body ${bodyStr}`)

		const mchId = query.mch_id
		const timestamp = query.timestamp
		const sign = query.sign

		if (mchId && timestamp && sign && typeof mchId === 'string' && typeof timestamp === 'string' && typeof sign === 'string' && genSign(timestamp, bodyStr, sign)) {
			const { order_no, goods_no, buy_quantity, biz_order_no } = body
			const cardItems: CardItems[] = []

			for (let i = 0; i < buy_quantity; i++) {
				const id = crypto.randomUUID()
				const create_time = Date.now()
				await env.CODE_MALL_DB.prepare('INSERT INTO order_cards (id, order_no, goods_no, biz_order_no, create_time) VALUES (?, ?, ?, ?, ?)').bind(id, order_no, goods_no, biz_order_no, create_time).run()
				cardItems.push({ card_pwd: id })
			}

			const orderPurchaseCreateResponse: OrderPurchaseCreateResponse = {
				order_no,
				out_order_no: biz_order_no,
				order_status: 20,
				order_amount: 100,
				order_time: orderTime,
				end_time: Date.now(),
				card_items: cardItems,
				remark: '',
			}
			return new Response(responseBody(orderPurchaseCreateResponse))
		}
	} catch (e) {
		console.error(e)
	}
	return new Response(responseErrorBody())
}
