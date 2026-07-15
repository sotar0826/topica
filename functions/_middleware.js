// 旧ドメイン topica.pages.dev → 新ドメイン topica-law.com への301リダイレクト。
// - ホスト名が「正確に」topica.pages.dev の場合のみ転送（パス・クエリは維持）
// - プレビューデプロイ（<hash>.topica.pages.dev）や新ドメイン自体は対象外
// ※ このファイルを含むデプロイは、新ドメインが Cloudflare Pages の
//   Custom Domains で有効化された後に行うこと（先にデプロイすると
//   pages.dev へのアクセスが未開通ドメインへ飛んで見られなくなる）。
const OLD_HOST = "topica.pages.dev";
const NEW_ORIGIN = "https://topica-law.com";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === OLD_HOST) {
    return Response.redirect(
      NEW_ORIGIN + url.pathname + url.search,
      301
    );
  }
  return context.next();
}
