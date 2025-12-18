/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname } = new URL(request.url);

		if (pathname === "/api/beverages") {
			// If you did not use `DB` as your binding name, change it here
			const { results } = await env.code_mall.prepare(
				"SELECT * FROM order_cards"
			)
				.run();
			return new Response(JSON.stringify(results), {
				headers: { 'Content-Type': 'application/json' }
			});
		}

		return new Response(
			"Call /api/beverages to see everyone who works at Bs Beverages"
		);
	},
} satisfies ExportedHandler<Env>;
