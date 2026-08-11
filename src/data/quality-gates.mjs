/**
 * 検索・広告審査に出す判例解説。
 * 百選級リニューアル（事案、判旨、解説、答案での使い方まで収録）が完了したものだけを列挙する。
 * 旧版の短い解説は公開を維持しつつ noindex とし、改稿後にこの一覧へ追加する。
 */
export const INDEXABLE_HANREI_SLUGS = [
  "byoin-kaisetsu-chushi-kankoku-h17",
  "416jo-ruisui-s48",
  "benron-shugi-ihan-s41",
  "chintaishaku-shinrai-kankei-s28",
  "daii-ken-ishakin-s58",
  "hotei-chijoken-s36",
  "ichibu-seikyu-kihanryoku-s37",
  "ikkyu-kenchikushi-menkyo-torikeshi-h23",
  "ikata-genpatsu-h4",
  "kabunushi-sokai-sairyo-kikyaku-s30",
  "kansetsu-jijitsu-jihaku-s41",
  "kyodo-sozoku-toki-s38",
  "kyosei-shobun-igi-s51",
  "naitagashi-sekinin-s41",
  "ryoteki-kajo-boei-h20",
  "shinkabu-hakko-koka-h9",
  "shokei-kyodo-seihan-h24",
  "shutoku-jiko-toki-s41",
  "soin-henko-yohi-h13",
  "sokuji-shutoku-s35",
  "yuigon-muko-kakunin-s47",
  "94jo2ko-ruisui-s45",
  "anzen-hairyo-gimu-s50",
  "chloroform-jiken",
  "ehime-tamagushiryo-jiken",
  "gofurikomi-sagi-jiken",
  "gps-sosa-jiken",
  "haishinteki-akuisha-h18",
  "hakusanmaru-jiken",
  "hichakushutsushi-iken-kettei",
  "hoppo-journal-jiken",
  "hojinkaku-hinin-s44",
  "kokusekiho-iken-hanketsu",
  "kochi-rakuseki-s45",
  "kojin-taxi-s46",
  "kokudo-43go-h7",
  "kyoto-fugakuren-jiken",
  "mclean-jiken",
  "kasen-fukinchi-seigenrei-s43",
  "kazei-shobun-shingisoku-s62",
  "musashino-kyoiku-shisetsu-futankin-h5",
  "mitsubishi-jushi-jiken",
  "nerima-jiken",
  "osaka-kakuseizai-jiken",
  "osaka-nanko-jiken",
  "odakyu-kokakuka-h17",
  "rumbar-jiken",
  "sekken-shitei-h11",
  "shakti-jiken",
  "shinrinho-iken-hanketsu",
  "shiratori-kettei",
  "sorachibuto-jinja-jiken",
  "swat-jiken",
  "tsu-jichinsai-jiken",
  "winny-jiken",
  "yakujiho-iken-hanketsu",
  "yakuin-sekinin-daisansha-s44",
  "yukan-wakayama-jiken",
  "yonago-ginko-jiken",
  "zaigai-senkyoken-hanketsu",
];

export const INDEXABLE_HANREI_SET = new Set(INDEXABLE_HANREI_SLUGS);

/** @param {string} page */
export function shouldIncludeInSitemap(page) {
  const pathname = new URL(page).pathname;

  if (
    pathname.includes("/kanri-") ||
    pathname.startsWith("/hasan/") ||
    pathname.includes("/zenbun/") ||
    pathname === "/search/" ||
    pathname === "/404.html"
  ) {
    return false;
  }

  // 個別用語ページは現状600〜900字程度の簡易版。内容を拡充するまで一覧ページだけを収録する。
  if (/^\/yougo\/[^/]+\/$/.test(pathname)) return false;

  const hanreiMatch = pathname.match(/^\/hanrei\/([^/]+)\/$/);
  if (hanreiMatch) return INDEXABLE_HANREI_SET.has(hanreiMatch[1]);

  return true;
}
