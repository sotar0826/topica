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

export interface SubjectDef {
  slug: string;
  name: string;
  description: string;
  parts: PartDef[];
  /** true なら公開ナビ・トップ・sitemapに出さない（保管庫送り。ページ自体は残す） */
  archived?: boolean;
}

export const SUBJECT = {
  slug: "minpo",
  name: "民法",
  description:
    "契約・所有・家族など、暮らしと取引の基本ルールを定める法律。総則から親族・相続まで、全51トピックで体系的に学べます。",
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
      { slug: "sagi-kyohaku", title: "詐欺・強迫", hasAdvanced: true },
      { slug: "dairi-kiso", title: "代理（基礎）", hasAdvanced: false },
      { slug: "muken-dairi", title: "無権代理", hasAdvanced: true },
      { slug: "hyoken-dairi", title: "表見代理", hasAdvanced: true },
      { slug: "muko-torikeshi", title: "無効と取消し", hasAdvanced: false },
      { slug: "joken-kigen", title: "条件・期限", hasAdvanced: false },
      { slug: "shutoku-jiko", title: "取得時効", hasAdvanced: true },
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
      { slug: "bensai", title: "弁済", hasAdvanced: true },
      { slug: "sosai", title: "相殺", hasAdvanced: true },
    ],
  },
  {
    number: 4,
    name: "債権各論",
    slug: "saiken-kakuron",
    topics: [
      { slug: "keiyaku-soron", title: "契約総論・契約の成立", hasAdvanced: true },
      { slug: "doji-riko", title: "同時履行の抗弁・危険負担", hasAdvanced: true },
      { slug: "kaijo", title: "契約の解除", hasAdvanced: true },
      { slug: "baibai", title: "売買", hasAdvanced: true },
      { slug: "chintaishaku", title: "賃貸借", hasAdvanced: true },
      { slug: "ukeoi-inin", title: "請負・委任", hasAdvanced: true },
      { slug: "sonota-keiyaku", title: "その他の典型契約", hasAdvanced: false },
      { slug: "futo-ritoku", title: "不当利得", hasAdvanced: true },
      { slug: "fuho-koi-kiso", title: "不法行為（基礎）", hasAdvanced: true },
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
      { slug: "sozokunin", title: "相続人と相続分", hasAdvanced: true },
      { slug: "sozoku-shonin", title: "相続の承認・放棄・遺産分割", hasAdvanced: true },
      { slug: "yuigon", title: "遺言", hasAdvanced: true },
      { slug: "iryubun", title: "遺留分", hasAdvanced: true },
    ],
  },
];

// ===== 破産法 =====
// 申立代理人が自己破産事件（自然人・法人）を進める時系列ベースの構成。
// 対象読者は実務家。基礎編でも民法より水準を高く設定する。

export const HASAN_CURRICULUM: PartDef[] = [
  {
    number: 1,
    name: "総論・受任まで",
    slug: "soron",
    topics: [
      { slug: "hasan-zentaizo", title: "破産制度の全体像と債務整理手段の選択", hasAdvanced: false },
      { slug: "junin-handan", title: "法律相談と受任判断", hasAdvanced: true },
      { slug: "junin-tsuchi", title: "受任通知と弁護士介入の効果", hasAdvanced: false },
    ],
  },
  {
    number: 2,
    name: "自然人の自己破産",
    slug: "shizenjin",
    topics: [
      { slug: "zaisan-chosa", title: "申立準備①——財産調査と家計の整理", hasAdvanced: false },
      { slug: "moshitate-kian", title: "申立準備②——申立書・陳述書の起案", hasAdvanced: false },
      { slug: "doji-haishi-kanzai", title: "同時廃止と管財事件の振り分け", hasAdvanced: true },
      { slug: "jiyu-zaisan", title: "自由財産と自由財産拡張", hasAdvanced: true },
      { slug: "menseki", title: "免責手続と免責不許可事由", hasAdvanced: true },
      { slug: "himenseki-saiken", title: "非免責債権", hasAdvanced: false },
    ],
  },
  {
    number: 3,
    name: "法人の自己破産",
    slug: "hojin",
    topics: [
      { slug: "hojin-shodo", title: "法人破産の受任と初動", hasAdvanced: true },
      { slug: "hojin-junbi", title: "法人申立ての準備", hasAdvanced: false },
      { slug: "hojin-daihyosha", title: "法人と代表者の同時申立て", hasAdvanced: false },
    ],
  },
  {
    number: 4,
    name: "破産手続の進行",
    slug: "shinko",
    topics: [
      { slug: "kaishi-kettei", title: "破産手続開始決定の効果", hasAdvanced: false },
      { slug: "kanzainin-taio", title: "管財人の職務と申立代理人の協力義務", hasAdvanced: false },
      { slug: "hinin-ken", title: "否認権", hasAdvanced: true },
      { slug: "sosai-kinshi", title: "相殺と相殺禁止", hasAdvanced: true },
      { slug: "torimodoshi-betsujo", title: "取戻権・別除権・財団債権", hasAdvanced: false },
    ],
  },
  {
    number: 5,
    name: "周辺論点",
    slug: "shuhen",
    topics: [
      { slug: "kojin-saisei-hikaku", title: "個人再生との比較・選択", hasAdvanced: false },
      { slug: "kazoku-hoshonin", title: "破産と家族・保証人への影響", hasAdvanced: false },
    ],
  },
];

/** 全科目の定義。ナビ・トップページはここを基準にする */
export const SUBJECTS: SubjectDef[] = [
  {
    slug: "minpo",
    name: "民法",
    description: SUBJECT.description,
    parts: CURRICULUM,
  },
  {
    slug: "hasan",
    name: "破産法",
    description:
      "申立代理人の視点から、自然人・法人の自己破産を受任から免責まで時系列で扱います。実務マニュアルとしても使える実務家向けの内容です。",
    parts: HASAN_CURRICULUM,
    // 2026-07-05 お蔵入り。公開導線から外すがページは保持（管理ダッシュボードから閲覧可）
    archived: true,
  },
];

/** 公開ナビ・トップに出す科目のみ */
export const PUBLIC_SUBJECTS = SUBJECTS.filter((s) => !s.archived);

export function findSubject(slug: string) {
  return SUBJECTS.find((s) => s.slug === slug) ?? null;
}

/** 科目ごとの基礎編トピックを学習順に平坦化したリスト */
export function topicOrderOf(subjectSlug: string) {
  const subject = findSubject(subjectSlug);
  if (!subject) return [];
  return subject.parts
    .flatMap((part) =>
      part.topics.map((t) => ({
        slug: t.slug,
        title: t.title,
        number: 0,
        partNumber: part.number,
        partName: part.name,
        hasAdvanced: t.hasAdvanced,
      })),
    )
    .map((t, i) => ({ ...t, number: i + 1 }));
}

export function findTopicOf(subjectSlug: string, slug: string) {
  const base = slug.replace(/-ouyou$/, "");
  const order = topicOrderOf(subjectSlug);
  const idx = order.findIndex((t) => t.slug === base);
  return idx === -1 ? null : { ...order[idx], index: idx };
}

export function prevNextOf(subjectSlug: string, slug: string) {
  const t = findTopicOf(subjectSlug, slug);
  if (!t) return { prev: null, next: null };
  const order = topicOrderOf(subjectSlug);
  return {
    prev: t.index > 0 ? order[t.index - 1] : null,
    next: t.index < order.length - 1 ? order[t.index + 1] : null,
  };
}

/** 基礎編トピックを学習順に平坦化したリスト（number は一覧の整数ナンバリングと一致） */
export const TOPIC_ORDER: { slug: string; title: string; number: number; partNumber: number; partName: string; hasAdvanced: boolean }[] =
  CURRICULUM.flatMap((part) =>
    part.topics.map((t) => ({
      slug: t.slug,
      title: t.title,
      number: 0, // 直後に通し番号を振る
      partNumber: part.number,
      partName: part.name,
      hasAdvanced: t.hasAdvanced,
    })),
  ).map((t, i) => ({ ...t, number: i + 1 }));

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
