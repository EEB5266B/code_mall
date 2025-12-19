import {IRequest} from "itty-router";
import {responseBody} from "../../../common/utils/goofishUtil"
import {env} from "cloudflare:workers";

export default async (request: IRequest, ...args: any[]): Promise<Response> => {
	console.log("收到 /goofish/user/info 请求")
	return new Response(responseBody({app_id: Number(env.GOOFISH_APP_ID)}))
}
