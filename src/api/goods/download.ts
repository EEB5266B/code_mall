import { IRequest } from 'itty-router'
import { env } from 'cloudflare:workers'
import { OrderCards } from '../../dataobject/orderCards'
import { downloader } from '../../common/utils/gitHubUtil'

export default async (request: IRequest, ...args: any[]): Promise<Response> => {
	const { key } = request.params

	console.log(`使用 ${key} 下载商品`)

	const orderCard = await env.CODE_MALL_DB.prepare('select id, order_no, goods_no, biz_order_no, create_time, goods, consume_time from order_cards where id = ?').bind(key).first<OrderCards>()

	if (orderCard && orderCard.consume_time && orderCard.goods) {
		const response = await downloader(orderCard.goods)

		if (response.ok) {
			return new Response(response.body, {
				headers: {
					'Content-Type': 'application/zip',
					'Content-Disposition': `attachment; filename="${orderCard.goods}.zip"`,
					'Cache-Control': 'no-store, max-age=0',
				},
			})
		}
	}

	return new Response('系统异常，请联系管理员', { status: 500 })
}
