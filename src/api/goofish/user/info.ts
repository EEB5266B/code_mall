import {IRequest} from "itty-router";
import {genSign, responseBody, responseErrorBody} from "../../../common/utils/goofishUtil"

export default async (request: IRequest, ...args: any[]): Promise<Response> => {
	try {
		const query = request.query
		const body = await request.text()

		console.log(`收到 /goofish/user/info 请求, query 参数 ${JSON.stringify(query)}, body ${body}`)

		const mchId = query.mch_id
		const timestamp = query.timestamp
		const sign = query.sign

		if (mchId && timestamp && sign && typeof mchId === 'string' && typeof timestamp === 'string' && typeof sign === 'string' && genSign(timestamp, body, sign)) {

			return new Response(responseBody({balance: 1000}))
		}
	} catch (e) {
		console.error(e)
	}
	return new Response(responseErrorBody())
}
