// 民法カリキュラム定義
// サイト全体のナビゲーション・ツリー表示・前後リンクはこのファイルが基準。
// トピックを追加・改名する場合はここと content/minpo/ の両方を更新する。

export interface TopicDef {
  /** URLスラッグ。基礎編は slug、応用編は `${slug}-ouyou` のMarkdownファイルに対応 */
  slug: string;
  title: string;
  /** 応用編ページがあるか */
  hasAdvanced: boolean;
}

export interface PartDef {
  number: number;
  name: string;
  slug: string;
  topics: TopicDef[];
}

export const SUBJECT = {
  slug: "minpo",
  name: "民法",
  description:
    "司法試験・予備試験をはじめとする法律系資格の最重要科目。総則から親族・相続まで、全51トピックで体系的に学べます。",
} as const;

export const CURRICULUM: PartDef[] = [
  {
    number: 1,
    name: "民法総則",
    slug: "sosoku",
    topics: [
      { slug: "zentaizo", title: "民法の全体像と学び方", hasAdvanced: false },
      { slug: "kenri-noryoku", title: "権利能力・意思能力", hasAdvanced: false },
      { slug: "seigen-koi-noryoku", title: "制限行為能力者", hasAdvanced: false },
      { slug: "hojin", title: "法人", hasAdvanced: false },
      { slug: "shinri-ryuho", title: "意思表示総論・心裡留保", hasAdvanced: false },
      { slug: "kyogi-hyoji", title: "虚偽表示", hasAdvanced: true },
      { slug: "sakugo", title: "錯誤", hasAdvanced: true },
      { slug: "sagi-kyohaku", title: "詐欺・強迫", hasAdvanced: false },
      { slug: "dairi-kiso", title: "代理（基礎）", hasAdvanced: false },
      { slug: "muken-dairi", title: "無権代理", hasAdvanced: true },
      { slug: "hyoken-dairi", title: "表見代理", hasAdvanced: true },
      { slug: "muko-torikeshi", title: "無効と取消し", hasAdvanced: false },
      { slug: "joken-kigen", title: "条件・期限", hasAdvanced: false },
      { slug: "shutoku-jiko", title: "取得時効", hasAdvanced: false },
      { slug: "shometsu-jiko", title: "消滅時効", hasAdvanced: true },
    ],
  },
  {
    number: 2,
    name: "物権",
    slug: "bukken",
    topics: [
      { slug: "bukken-soron", title: "物権総論・物権変動の基礎", hasAdvanced: false },
      { slug: "fudosan-bukken-hendo", title: "不動産物権変動（177条）", hasAdvanced: true },
      { slug: "sokuji-shutoku", title: "動産物権変動・即時取得", hasAdvanced: true },
      { slug: "senyu-ken", title: "占有権", hasAdvanced: false },
      { slug: "shoyu-ken", title: "所有権・相隣関係", hasAdvanced: false },
      { slug: "kyoyu", title: "共有", hasAdvanced: true },
      { slug: "yoeki-bukken", title: "用益物権", hasAdvanced: false },
      { slug: "ryuchi-ken", title: "担保物権総論・留置権", hasAdvanced: false },
      { slug: "sakidori-shichi", title: "先取特権・質権", hasAdvanced: false },
      { slug: "teito-ken", title: "抵当権（基礎）", hasAdvanced: true },
      { slug: "hotei-chijo-ken", title: "法定地上権", hasAdvanced: true },
      { slug: "joto-tanpo", title: "譲渡担保", hasAdvanced: true },
    ],
  },
  {
    number: 3,
    name: "債権総論",
    slug: "saiken-soron",
    topics: [
      { slug: "saimu-furiko", title: "債権の意義・債務不履行", hasAdvanced: true },
      { slug: "daii-ken", title: "債権者代位権", hasAdvanced: true },
      { slug: "sagai-koi", title: "詐害行為取消権", hasAdvanced: true },
      { slug: "rentai-saimu", title: "連帯債務", hasAdvanced: false },
      { slug: "hosho", title: "保証", hasAdvanced: true },
      { slug: "saiken-joto", title: "債権譲渡", hasAdvanced: true },
      { slug: "bensai", title: "弁済", hasAdvanced: false },
      { slug: "sosai", title: "相殺", hasAdvanced: true },
    ],
  },
  {
    number: 4,
    name: "債権各論",
    slug: "saiken-kakuron",
    topics: [
      { slug: "keiyaku-soron", title: "契約総論・契約の成立", hasAdvanced: false },
      { slug: "doji-riko", title: "同時履行の抗弁・危険負担", hasAdvanced: false },
      { slug: "kaijo", title: "契約の解除", hasAdvanced: true },
      { slug: "baibai", title: "売買", hasAdvanced: true },
      { slug: "chintaishaku", title: "賃貸借", hasAdvanced: true },
      { slug: "ukeoi-inin", title: "請負・委任", hasAdvanced: false },
      { slug: "sonota-keiyaku", title: "その他の典型契約", hasAdvanced: false },
      { slug: "futo-ritoku", title: "不当利得", hasAdvanced: true },
      { slug: "fuho-koi-kiso", title: "不法行為（基礎）", hasAdvanced: false },
      { slug: "fuho-koi-tokushu", title: "不法行為（特殊類型）", hasAdvanced: true },
    ],
  },
  {
    number: 5,
    name: "親族・相続",
    slug: "shinzoku-sozoku",
    topics: [
      { slug: "konin-rikon", title: "婚姻・離婚", hasAdvanced: false },
      { slug: "oyako", title: "親子（実子・養子）", hasAdvanced: false },
      { slug: "sozokunin", title: "相続人と相続分", hasAdvanced: false },
      { slug: "sozoku-shonin", title: "相続の承認・放棄・遺産分割", hasAdvanced: false },
      { slug: "yuigon", title: "遺言", hasAdvanced: false },
      { slug: "iryubun", title: "遺留分", hasAdvanced: false },
    ],
  },
];

/** 基礎編トピックを学習順に平坦化したリスト */
export const TOPIC_ORDER: { slug: string; title: string; partNumber: number; partName: string; hasAdvanced: boolean }[] =
  CURRICULUM.flatMap((part) =>
    part.topics.map((t) => ({
      slug: t.slug,
      title: t.title,
      partNumber: part.number,
      partName: part.name,
      hasAdvanced: t.hasAdvanced,
    })),
  );

export function findTopic(slug: string) {
  const base = slug.replace(/-ouyou$/, "");
  const idx = TOPIC_ORDER.findIndex((t) => t.slug === base);
  return idx === -1 ? null : { ...TOPIC_ORDER[idx], index: idx };
}

/** 基礎編の学習順での前後トピック */
export function prevNext(slug: string) {
  const t = findTopic(slug);
  if (!t) return { prev: null, next: null };
  return {
    prev: t.index > 0 ? TOPIC_ORDER[t.index - 1] : null,
    next: t.index < TOPIC_ORDER.length - 1 ? TOPIC_ORDER[t.index + 1] : null,
  };
}
