import { IRequest } from 'itty-router'
import { genSign, responseBody, responseErrorBody } from '../../../common/utils/goofishUtil'
import { env } from 'cloudflare:workers'
import { GoodsItem } from '../../../dataobject/goods'

export interface GoodsListRequest {
	keyword: string
	goods_type: number
	page_no: number
	page_size: number
}

export interface GoodsListResponse {
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
		const body = await request.json<GoodsListRequest>()

		console.log(`收到 /goofish/goods/list 请求, query 参数 ${JSON.stringify(query)}, body ${JSON.stringify(body)}`)

		const mchId = query.mch_id
		const timestamp = query.timestamp
		const sign = query.sign

		if (mchId && timestamp && sign && typeof mchId === 'string' && typeof timestamp === 'string' && typeof sign === 'string' && genSign(timestamp, JSON.stringify(body), sign)) {
			const { keyword, goods_type, page_no, page_size } = body

			let whereClause = '1=1'
			const binds: any[] = []

			if (keyword) {
				whereClause += ' AND goods_name LIKE ?'
				binds.push(`%${keyword}%`)
				whereClause += ' AND goods_no = ?'
				binds.push(`%${keyword}%`)
			}

			if (goods_type) {
				whereClause += ' AND goods_type = ?'
				binds.push(goods_type)
			}

			const countStmt = env.CODE_MALL_DB.prepare(`SELECT COUNT(*) AS count FROM goods WHERE ${whereClause}`)
			const dataStmt = env.CODE_MALL_DB.prepare(`SELECT * FROM goods WHERE ${whereClause} ORDER BY update_time DESC`)

			const countResult = await countStmt.bind(...binds).first<{ count: number }>()
			const count = countResult?.count || 0

			if (count > 0) {
				const goodsList = await dataStmt.bind(...binds).all<GoodsItem>()

				const list: GoodsListResponse[] = []

				goodsList.results.forEach((goodsItem) => {
					list.push({
						goods_no: goodsItem.goods_no,
						goods_type: goodsItem.goods_type,
						goods_name: goodsItem.goods_name,
						price: goodsItem.price,
						stock: goodsItem.stock,
						status: goodsItem.status,
						update_time: goodsItem.update_time,
					})
				})

				return new Response(responseBody({ count, list }))
			}

			return new Response(responseBody({ count, list: [] }))
		}
	} catch (e) {
		console.error(e)
	}
	return new Response(responseErrorBody())
}
