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
// 商法・会社法カリキュラム（2026-07-06 ユーザー承認：会社法中心の6編＋手形小切手）
export const SHOHO_CURRICULUM: PartDef[] = [
  {
    number: 1,
    name: "会社法の全体像と設立",
    slug: "kaisha-soron",
    topics: [
      { slug: "shoho-zentaizo", title: "商法・会社法の全体像と学び方", hasAdvanced: false },
      { slug: "kaisha-hojinkaku", title: "会社の法人格と株主の有限責任", hasAdvanced: true },
      { slug: "kaisha-setsuritsu", title: "株式会社の設立", hasAdvanced: true },
    ],
  },
  {
    number: 2,
    name: "株式",
    slug: "kabushiki",
    topics: [
      { slug: "kabushiki-soron", title: "株式と株主の権利・株主平等原則", hasAdvanced: false },
      { slug: "kabushiki-joto", title: "株式の譲渡と譲渡制限", hasAdvanced: true },
      { slug: "jiko-kabushiki", title: "自己株式・株式の併合と分割", hasAdvanced: false },
      { slug: "shurui-kabushiki", title: "種類株式", hasAdvanced: false },
      { slug: "kabunushi-meibo", title: "株主名簿と権利行使（基準日・名義書換）", hasAdvanced: false },
    ],
  },
  {
    number: 3,
    name: "機関",
    slug: "kikan",
    topics: [
      { slug: "kikan-sekkei", title: "機関設計の全体像", hasAdvanced: false },
      { slug: "kabunushi-sokai", title: "株主総会（招集・決議）", hasAdvanced: true },
      { slug: "torishimariyaku", title: "取締役・取締役会・代表取締役", hasAdvanced: true },
      { slug: "yakuin-gimu", title: "役員の義務（善管注意・競業・利益相反）", hasAdvanced: true },
      { slug: "yakuin-sekinin", title: "役員の責任（会社・第三者に対する）", hasAdvanced: true },
      { slug: "daihyo-sosho", title: "株主代表訴訟・違法行為の差止め", hasAdvanced: false },
      { slug: "kansa-kikan", title: "監査役・委員会型の機関", hasAdvanced: false },
    ],
  },
  {
    number: 4,
    name: "資金調達・計算",
    slug: "shikin-keisan",
    topics: [
      { slug: "boshu-kabushiki", title: "募集株式の発行", hasAdvanced: true },
      { slug: "shinkabu-yoyakuken", title: "新株予約権", hasAdvanced: false },
      { slug: "shasai", title: "社債", hasAdvanced: false },
      { slug: "keisan-shihon", title: "計算・資本金と準備金", hasAdvanced: false },
      { slug: "jouyokin-haito", title: "剰余金の配当と分配可能額", hasAdvanced: false },
    ],
  },
  {
    number: 5,
    name: "組織再編・解散",
    slug: "soshiki-saihen",
    topics: [
      { slug: "jigyo-joto", title: "事業譲渡", hasAdvanced: false },
      { slug: "gappei", title: "合併", hasAdvanced: false },
      { slug: "kaisha-bunkatsu", title: "会社分割", hasAdvanced: true },
      { slug: "kabushiki-kokan", title: "株式交換・株式移転・株式交付", hasAdvanced: false },
      { slug: "kaisan-seisan", title: "解散・清算", hasAdvanced: false },
    ],
  },
  {
    number: 6,
    name: "商法総則・商行為",
    slug: "shoho-soron",
    topics: [
      { slug: "shonin-shokoi", title: "商人と商行為の基礎", hasAdvanced: false },
      { slug: "shogo-naitagashi", title: "商号・名板貸し", hasAdvanced: true },
      { slug: "shogyo-toki", title: "商業登記の効力", hasAdvanced: false },
      { slug: "eigyo-joto", title: "営業譲渡と商号続用", hasAdvanced: false },
      { slug: "shoji-baibai", title: "商事売買・商行為の特則", hasAdvanced: false },
    ],
  },
  {
    number: 7,
    name: "手形・小切手",
    slug: "tegata",
    topics: [
      { slug: "tegata-kiso", title: "約束手形の仕組みと手形行為", hasAdvanced: false },
      { slug: "tegata-uragaki", title: "裏書と手形の譲渡", hasAdvanced: false },
      { slug: "tegata-kojin-koben", title: "人的抗弁の切断・善意取得", hasAdvanced: true },
      { slug: "tegata-giso", title: "手形の偽造・変造・白地手形", hasAdvanced: false },
    ],
  },
];

// 民事訴訟法カリキュラム（2026-07-07 開始。訴訟の時系列＋主要論点の6編・28トピック）
export const MINSO_CURRICULUM: PartDef[] = [
  {
    number: 1,
    name: "民訴の全体像と訴え",
    slug: "uttae",
    topics: [
      { slug: "minso-zentaizo", title: "民事訴訟の全体像と学び方", hasAdvanced: false },
      { slug: "uttae-ruikei", title: "訴えの類型と訴訟物", hasAdvanced: true },
      { slug: "shobun-shugi", title: "処分権主義", hasAdvanced: false },
      { slug: "soshou-yoken", title: "訴訟要件・訴えの利益", hasAdvanced: true },
      { slug: "kankatsu", title: "管轄・移送", hasAdvanced: false },
    ],
  },
  {
    number: 2,
    name: "当事者",
    slug: "tojisha",
    topics: [
      { slug: "tojisha-noryoku", title: "当事者能力・訴訟能力", hasAdvanced: false },
      { slug: "tojisha-kakutei", title: "当事者の確定", hasAdvanced: false },
      { slug: "tojisha-tekikaku", title: "当事者適格・訴訟担当", hasAdvanced: true },
      { slug: "soshou-dairi", title: "訴訟上の代理", hasAdvanced: false },
    ],
  },
  {
    number: 3,
    name: "審理（弁論・証拠）",
    slug: "shinri",
    topics: [
      { slug: "benron-shugi", title: "弁論主義", hasAdvanced: true },
      { slug: "shakumei", title: "釈明権・法的観点指摘義務", hasAdvanced: false },
      { slug: "jihaku", title: "裁判上の自白", hasAdvanced: true },
      { slug: "shomei-sekinin", title: "証明責任と証明度", hasAdvanced: true },
      { slug: "shoko-shirabe", title: "証拠調べ・文書提出命令", hasAdvanced: false },
      { slug: "soten-seiri", title: "争点整理と審理の進行", hasAdvanced: false },
    ],
  },
  {
    number: 4,
    name: "判決と効力",
    slug: "hanketsu",
    topics: [
      { slug: "hanketsu-shurui", title: "判決の種類と確定", hasAdvanced: false },
      { slug: "kihanryoku", title: "既判力の基礎", hasAdvanced: true },
      { slug: "kihanryoku-hani", title: "既判力の範囲（時的・客観的・主観的）", hasAdvanced: true },
      { slug: "ichibu-seikyu", title: "一部請求・相殺の抗弁", hasAdvanced: true },
    ],
  },
  {
    number: 5,
    name: "複雑訴訟",
    slug: "fukuzatsu",
    topics: [
      { slug: "seikyu-heigo", title: "請求の併合・変更・反訴", hasAdvanced: false },
      { slug: "kyodo-soshou", title: "共同訴訟", hasAdvanced: true },
      { slug: "hojo-sanka", title: "補助参加・訴訟告知", hasAdvanced: false },
      { slug: "dokuritsu-sanka", title: "独立当事者参加", hasAdvanced: false },
      { slug: "soshou-shokei", title: "訴訟承継", hasAdvanced: false },
    ],
  },
  {
    number: 6,
    name: "終了と上訴",
    slug: "shuryo",
    topics: [
      { slug: "soshou-shuryo", title: "訴えの取下げ・和解・放棄認諾", hasAdvanced: false },
      { slug: "joso", title: "控訴・上告・抗告", hasAdvanced: false },
      { slug: "saishin", title: "再審", hasAdvanced: false },
      { slug: "kani-tetsuzuki", title: "簡易な手続（少額訴訟・支払督促・手形訴訟）", hasAdvanced: false },
    ],
  },
];

// 憲法カリキュラム（2026-07-12 開始。人権4編＋統治2編・29トピック。判例中心科目）
export const KENPO_CURRICULUM: PartDef[] = [
  {
    number: 1,
    name: "憲法の全体像と人権総論",
    slug: "jinken-soron",
    topics: [
      { slug: "kenpo-zentaizo", title: "憲法の全体像と学び方", hasAdvanced: false },
      { slug: "jinken-kyoyu", title: "人権の享有主体（外国人・法人）", hasAdvanced: true },
      { slug: "shijinkan-koryoku", title: "人権の私人間効力", hasAdvanced: true },
      { slug: "koumuin-jinken", title: "特別な法律関係における人権（公務員・在監者）", hasAdvanced: false },
      { slug: "jinken-genkai", title: "人権の限界と違憲審査の枠組み", hasAdvanced: false },
    ],
  },
  {
    number: 2,
    name: "包括的基本権と平等",
    slug: "hokatsu-byodo",
    topics: [
      { slug: "kofuku-tsuikyu", title: "幸福追求権（13条）とプライバシー", hasAdvanced: true },
      { slug: "hou-no-shita-no-byodo", title: "法の下の平等（14条）", hasAdvanced: true },
      { slug: "kazoku-to-byodo", title: "家族と平等（国籍・再婚禁止・夫婦同氏）", hasAdvanced: true },
    ],
  },
  {
    number: 3,
    name: "精神的自由",
    slug: "seishin-jiyu",
    topics: [
      { slug: "shiso-ryoshin", title: "思想・良心の自由（19条）", hasAdvanced: true },
      { slug: "shinkyo-jiyu", title: "信教の自由（20条）", hasAdvanced: true },
      { slug: "seikyo-bunri", title: "政教分離", hasAdvanced: true },
      { slug: "hyogen-jiyu-soron", title: "表現の自由・総論（21条）", hasAdvanced: true },
      { slug: "hyogen-jiyu-kakuron", title: "表現の自由・各論（事前抑制・検閲・報道）", hasAdvanced: true },
      { slug: "gakumon-jiyu", title: "学問の自由（23条）", hasAdvanced: false },
    ],
  },
  {
    number: 4,
    name: "経済的自由・人身の自由・社会権",
    slug: "keizai-shakai",
    topics: [
      { slug: "shokugyo-jiyu", title: "職業選択の自由（22条）", hasAdvanced: true },
      { slug: "zaisan-ken", title: "財産権（29条）", hasAdvanced: true },
      { slug: "jinshin-jiyu", title: "人身の自由と適正手続（31条以下）", hasAdvanced: false },
      { slug: "seizon-ken", title: "生存権（25条）", hasAdvanced: true },
      { slug: "kyoiku-rodo", title: "教育を受ける権利・労働基本権（26〜28条）", hasAdvanced: false },
      { slug: "sanseiken", title: "参政権と選挙制度（15条・議員定数）", hasAdvanced: true },
    ],
  },
  {
    number: 5,
    name: "統治①国会・内閣・財政",
    slug: "tochi-1",
    topics: [
      { slug: "kokkai", title: "国会（国権の最高機関・立法）", hasAdvanced: false },
      { slug: "giin-jichi", title: "議院の自律と議員の特権", hasAdvanced: false },
      { slug: "naikaku", title: "内閣と議院内閣制（解散を含む）", hasAdvanced: false },
      { slug: "zaisei-chihojichi", title: "財政・地方自治", hasAdvanced: false },
    ],
  },
  {
    number: 6,
    name: "統治②裁判所と憲法保障",
    slug: "tochi-2",
    topics: [
      { slug: "shiho-ken", title: "司法権の意義と限界", hasAdvanced: true },
      { slug: "saibansho-dokuritsu", title: "裁判所の組織と裁判官の独立", hasAdvanced: false },
      { slug: "iken-shinsa-sei", title: "違憲審査制と憲法判断の方法", hasAdvanced: true },
      { slug: "heiwa-shugi", title: "平和主義（前文・9条）", hasAdvanced: false },
      { slug: "kenpo-kaisei", title: "憲法改正・最高法規性・憲法保障", hasAdvanced: false },
    ],
  },
];

export const SUBJECTS: SubjectDef[] = [
  {
    slug: "minpo",
    name: "民法",
    description: SUBJECT.description,
    parts: CURRICULUM,
  },
  {
    slug: "shoho",
    name: "商法・会社法",
    description:
      "会社という仕組みを動かすルール。株式・機関・資金調達から組織再編、商法総則・手形小切手まで、会社法を中心に全34トピックで体系的に学べます。",
    parts: SHOHO_CURRICULUM,
  },
  {
    slug: "kenpo",
    name: "憲法",
    description:
      "国家の基本設計と人権保障を定める最高法規。人権の享有主体から精神的自由・経済的自由、統治機構・違憲審査まで、判例を軸に全29トピックで体系的に学べます。",
    parts: KENPO_CURRICULUM,
  },
  {
    slug: "minso",
    name: "民事訴訟法",
    description:
      "民事紛争を裁判で解決するための手続法。訴えの提起から審理・判決・上訴までの流れと、弁論主義・既判力などの基本原理を全28トピックで体系的に学べます。",
    parts: MINSO_CURRICULUM,
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
