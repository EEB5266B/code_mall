import { IRequest } from 'itty-router'
import { genSign, responseBody, responseErrorBody } from '../../../common/utils/goofishUtil'
import { env } from 'cloudflare:workers'
import { GoodsItem } from '../../../dataobject/goods'

export interface GoodsDetailRequest {
	goods_type: number
	goods_no: number
}

export interface GoodsDetailResponse {
	goods_no: string
	goods_type: number
	goods_name: string
	price: number
	stock: number
	status: number
	update_time: number
}

export default async (request: IRequest, ...args: any[]): Promise<Response> => {
	try {
		const query = request.query
		const bodyStr = await request.clone().text()
		const body = await request.json<GoodsDetailRequest>()

		console.log(`收到 /goofish/goods/detail 请求, query 参数 ${JSON.stringify(query)}, body ${bodyStr}`)

		const mchId = query.mch_id
		const timestamp = query.timestamp
		const sign = query.sign

		if (mchId && timestamp && sign && typeof mchId === 'string' && typeof timestamp === 'string' && typeof sign === 'string' && genSign(timestamp, bodyStr, sign)) {
			const { goods_type, goods_no } = body

			const dataStmt = env.CODE_MALL_DB.prepare('SELECT * FROM goods WHERE goods_no = ? and goods_type = ?')

			const goodsItem = await dataStmt.bind(goods_no, goods_type).first<GoodsItem>()
			if (goodsItem) {
				const goodsDetailResponses: GoodsDetailResponse = {
					goods_no: goodsItem.goods_no,
					goods_type: goodsItem.goods_type,
					goods_name: goodsItem.goods_name,
					price: goodsItem.price,
					stock: goodsItem.stock,
					status: goodsItem.status,
					update_time: goodsItem.update_time,
				}
				return new Response(responseBody(goodsDetailResponses))
			}
		}
	} catch (e) {
		console.error(e)
	}
	return new Response(responseErrorBody())
}
