import CryptoJS from 'crypto-js'
import { env } from 'cloudflare:workers'

export const genSign = (timestamp: string, jsonStr: string, sign: string): boolean => {
	const signMd5 = CryptoJS.MD5(`${env.GOOFISH_APP_ID},${env.GOOFISH_APP_SECRET},${CryptoJS.MD5(jsonStr).toString()},${timestamp},${env.GOOFISH_MCH_ID},${env.GOOFISH_MCH_SECRET}`).toString()

	console.log(`生成签名 ${signMd5}, 收到签名 ${sign}`)

	return sign === signMd5
}

export const responseBody = (data: any): string => {
	return JSON.stringify({
		code: 0,
		msg: 'OK',
		data,
	})
}

export const responseErrorBody = (): string => {
	return JSON.stringify({
		code: 100,
		msg: 'system error',
	})
}
