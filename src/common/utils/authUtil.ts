import CryptoJS from 'crypto-js'
import { env } from 'cloudflare:workers'

const getClientVersion = (clientId: string): string | null => {
	if (Object.hasOwn(env.CLIENT_VERSIONS, clientId)) {
		return env.CLIENT_VERSIONS[clientId as keyof typeof env.CLIENT_VERSIONS]
	}
	return null
}

/**
 * 注册客户端
 * @param clientId 客户端ID
 */
const registerClient = (clientId: string): string => {
	return CryptoJS.HmacSHA256(`${clientId}:${getClientVersion(clientId)}`, env.HMAC_KEY).toString()
}

/**
 * 验证客户端
 * @param headers 请求头
 */
export const auth = (headers: Headers): boolean => {
	const clientId = headers.get('X-Client-ID')
	const apiKey = headers.get('X-API-Key')

	if (clientId && apiKey) {
		const clientVersion = getClientVersion(clientId)

		if (clientVersion) {
			const key = registerClient(clientId)
			if (apiKey === key) {
				return true
			} else {
				console.warn(`Illegal key, X-Client-ID ${clientId} X-API-Key ${apiKey} key ${key}`)
				return false
			}
		} else {
			console.warn(`Illegal client, X-Client-ID ${clientId} X-API-Key ${apiKey}`)
		}
	} else {
		console.warn(`X-Client-ID ${clientId} X-API-Key ${apiKey}`)
	}

	return false
}

/**
 * 错误客户端
 */
export const responseUnauthorizedBody = (): Response => {
	return new Response('', { status: 401 })
}

/**
 * 错误客户端
 */
export const responseErrorBody = (): Response => {
	return new Response('System exception', { status: 500 })
}
