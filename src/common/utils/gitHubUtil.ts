import { env } from 'cloudflare:workers'

export const downloader = async (repo: string): Promise<Response> => {
	const githubUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${repo}/zipball/main`
	return await fetch(githubUrl, {
		headers: {
			Authorization: `token ${env.GITHUB_PAT}`, // 自动从 secret 注入
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'cf-worker-github-downloader',
		},
	})
}
