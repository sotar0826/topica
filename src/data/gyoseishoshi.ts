// 行政書士試験の学習サイト（/gyoseishoshi/ 以下）の定義。
// トピカ本体とは別サイトとして扱う：トピカのナビ・トップ・検索・RSSからは一切リンクしない。
// 単元（units）の slug は src/content/gyoseishoshi/<subject>/<slug>.md と対応する。

/** サイト名（ヘッダー・title に使う）。変更はここだけでよい */
export const SHOSHI_SITE_NAME = "行政書士ノート";
export const SHOSHI_BASE = "/gyoseishoshi";

/** 検索エンジンに公開するか（定義は sitemap と共有するため quality-gates.mjs 側） */
export { SHOSHI_INDEXABLE } from "./quality-gates.mjs";

export type ShoshiUnit = { slug: string; title: string };
export type ShoshiPart = { name: string; units: ShoshiUnit[] };
export type ShoshiSubject = {
  slug: string;
  name: string;
  /** 試験科目の区分 */
  category: "法令等" | "基礎知識";
  /** 例年の出題数の目安（科目一覧に表示） */
  questions: string;
  description: string;
  parts: ShoshiPart[];
};

export const SHOSHI_SUBJECTS: ShoshiSubject[] = [
  {
    slug: "kiso-hogaku",
    name: "基礎法学",
    category: "法令等",
    questions: "5肢択一 2問",
    description: "法の分類・法源・解釈の方法、裁判制度、法令用語など、各科目の前提となる法の一般理論を扱う。出題数は少ないが範囲が広いため、条文を読むための基本用語と、法の効力・解釈の方法を押さえて確実に得点したい。",
    parts: [
      {
        name: "基礎法学",
        units: [
          { slug: "ho-no-bunrui", title: "法の分類と法源" },
          { slug: "ho-no-kaishaku", title: "法の解釈と適用" },
          { slug: "saiban-seido", title: "裁判制度と紛争解決" },
          { slug: "horei-yougo", title: "法令用語（「推定する」「みなす」等）" },
        ],
      },
    ],
  },
  {
    slug: "kenpo",
    name: "憲法",
    category: "法令等",
    questions: "5肢択一 5問・多肢選択 1問",
    description: "人権と統治機構。判例の結論と理由づけが問われる。",
    parts: [
      {
        name: "総論・人権",
        units: [
          { slug: "kenpo-soron", title: "憲法総論（国民主権・天皇・平和主義）" },
          { slug: "jinken-soron", title: "人権総論（享有主体・私人間効力・包括的基本権）" },
          { slug: "seishinteki-jiyu", title: "精神的自由権" },
          { slug: "keizaiteki-jiyu", title: "経済的自由権・人身の自由" },
          { slug: "shakaiken", title: "社会権・参政権・国務請求権" },
        ],
      },
      {
        name: "統治",
        units: [
          { slug: "kokkai", title: "国会" },
          { slug: "naikaku", title: "内閣" },
          { slug: "saibansho", title: "裁判所・違憲審査" },
          { slug: "zaisei-chiho-jichi", title: "財政・地方自治・憲法改正" },
        ],
      },
    ],
  },
  {
    slug: "gyoseiho",
    name: "行政法",
    category: "法令等",
    questions: "5肢択一 19問・多肢選択 2問・記述 1問",
    description: "配点の最も大きい科目。行政法総論と、行政手続法・行政不服審査法・行政事件訴訟法・国家賠償法・地方自治法の条文知識が中心。",
    parts: [
      {
        name: "行政法の一般的な法理論",
        units: [
          { slug: "gyosei-kihon-genri", title: "行政法の基本原理" },
          { slug: "gyosei-soshiki", title: "行政組織" },
          { slug: "gyosei-koi", title: "行政行為（種類・効力・瑕疵・取消しと撤回）" },
          { slug: "gyosei-sairyo", title: "行政裁量" },
          { slug: "gyosei-rippo-keikaku-keiyaku", title: "行政立法・行政計画・行政契約" },
          { slug: "gyosei-kyosei", title: "行政上の強制措置・行政罰" },
        ],
      },
      {
        name: "行政手続法",
        units: [
          { slug: "tetsuzuki-sosoku", title: "総則・適用除外" },
          { slug: "shinsei-shobun", title: "申請に対する処分" },
          { slug: "furieki-shobun", title: "不利益処分（聴聞・弁明の機会の付与）" },
          { slug: "gyosei-shido-todokede", title: "行政指導・処分等の求め・届出" },
          { slug: "iken-kobo", title: "意見公募手続" },
        ],
      },
      {
        name: "行政不服審査法",
        units: [
          { slug: "shinsa-seikyu-yoken", title: "審査請求の対象・適格・期間" },
          { slug: "shinri-tetsuzuki", title: "審理手続（審理員・行政不服審査会）" },
          { slug: "saiketsu-shikko-teishi", title: "裁決・執行停止" },
          { slug: "saichosa-saishinsa", title: "再調査の請求・再審査請求・教示" },
        ],
      },
      {
        name: "行政事件訴訟法",
        units: [
          { slug: "sosho-ruikei", title: "行政事件訴訟の類型" },
          { slug: "torikeshi-sosho-yoken", title: "取消訴訟の訴訟要件（処分性・原告適格・訴えの利益）" },
          { slug: "torikeshi-sosho-shinri", title: "取消訴訟の審理と判決" },
          { slug: "kari-no-kyusai", title: "執行停止・仮の義務付け・仮の差止め" },
          { slug: "sonota-kokoku-sosho", title: "無効等確認・不作為の違法確認・義務付け・差止めの訴え" },
          { slug: "tojisha-sosho", title: "当事者訴訟・民衆訴訟・機関訴訟" },
        ],
      },
      {
        name: "国家賠償法・損失補償",
        units: [
          { slug: "kokubai-1jo", title: "国家賠償法1条" },
          { slug: "kokubai-2jo", title: "国家賠償法2条・3条以下" },
          { slug: "sonshitsu-hosho", title: "損失補償" },
        ],
      },
      {
        name: "地方自治法",
        units: [
          { slug: "chiho-kokyo-dantai", title: "地方公共団体の種類と事務" },
          { slug: "jumin-no-kenri", title: "住民の権利（直接請求・住民監査請求・住民訴訟）" },
          { slug: "gikai-to-cho", title: "議会と長" },
          { slug: "jorei-kisoku", title: "条例・規則" },
          { slug: "kanyo-oyake-shisetsu", title: "国の関与・公の施設" },
        ],
      },
    ],
  },
  {
    slug: "minpo",
    name: "民法",
    category: "法令等",
    questions: "5肢択一 9問・記述 2問",
    description: "総則・物権・債権・家族法の全範囲。記述式では要件・効果を条文の文言で書けることが求められる。",
    parts: [
      {
        name: "総則",
        units: [
          { slug: "noryoku", title: "権利能力・意思能力・行為能力" },
          { slug: "ishi-hyoji", title: "意思表示" },
          { slug: "dairi", title: "代理" },
          { slug: "muko-torikeshi", title: "無効・取消し・条件・期限" },
          { slug: "jiko", title: "時効" },
        ],
      },
      {
        name: "物権",
        units: [
          { slug: "bukken-hendo", title: "物権変動と対抗要件" },
          { slug: "senyu-shoyu", title: "占有権・所有権・共有" },
          { slug: "yoeki-bukken", title: "用益物権" },
          { slug: "tanpo-bukken", title: "留置権・先取特権・質権" },
          { slug: "teitoken", title: "抵当権" },
        ],
      },
      {
        name: "債権総論",
        units: [
          { slug: "saimu-furiko", title: "債務不履行" },
          { slug: "sekinin-zaisan", title: "債権者代位権・詐害行為取消権" },
          { slug: "hosho", title: "多数当事者の債権債務・保証" },
          { slug: "saiken-joto", title: "債権譲渡・債務引受" },
          { slug: "bensai-sosai", title: "弁済・相殺" },
        ],
      },
      {
        name: "債権各論",
        units: [
          { slug: "keiyaku-soron", title: "契約総論（成立・解除・危険負担）" },
          { slug: "baibai", title: "売買・贈与" },
          { slug: "chintaishaku", title: "賃貸借" },
          { slug: "ukeoi-inin", title: "請負・委任・寄託" },
          { slug: "jimu-kanri-futo-ritoku", title: "事務管理・不当利得" },
          { slug: "fuho-koi", title: "不法行為" },
        ],
      },
      {
        name: "親族・相続",
        units: [
          { slug: "shinzoku", title: "親族（婚姻・親子）" },
          { slug: "sozoku", title: "相続（相続人・相続分・遺産分割）" },
          { slug: "igon-iryubun", title: "遺言・遺留分" },
        ],
      },
    ],
  },
  {
    slug: "shoho",
    name: "商法・会社法",
    category: "法令等",
    questions: "5肢択一 5問",
    description: "商法総則・商行為と会社法。出題数は少ないが、会社法は設立・株式・機関を中心に頻出の条文がある。",
    parts: [
      {
        name: "商法・会社法",
        units: [
          { slug: "shoho-sosoku", title: "商法総則・商行為" },
          { slug: "kaisha-setsuritsu", title: "会社法総論・設立" },
          { slug: "kabushiki", title: "株式" },
          { slug: "kikan", title: "機関（株主総会・取締役・監査役等）" },
          { slug: "shikin-chotatsu", title: "募集株式の発行・社債" },
          { slug: "keisan-saihen", title: "計算・組織再編" },
        ],
      },
    ],
  },
  {
    slug: "kiso-chishiki",
    name: "基礎知識",
    category: "基礎知識",
    questions: "5肢択一 14問",
    description: "一般知識、行政書士業務と密接に関連する諸法令、情報通信・個人情報保護、文章理解。足切り（基準点）があるため一定の得点が必要。",
    parts: [
      {
        name: "基礎知識",
        units: [
          { slug: "ippan-chishiki", title: "一般知識（政治・経済・社会）" },
          { slug: "gyomu-kanren-horei", title: "業務関連法令（行政書士法・戸籍法・住民基本台帳法）" },
          { slug: "joho-tsushin", title: "情報通信・個人情報保護" },
          { slug: "bunsho-rikai", title: "文章理解" },
        ],
      },
    ],
  },
];

export function findShoshiSubject(slug: string): ShoshiSubject | undefined {
  return SHOSHI_SUBJECTS.find((s) => s.slug === slug);
}

/** 科目内の単元を通し順で返す（前後ナビ用） */
export function shoshiUnitsOf(subjectSlug: string): ShoshiUnit[] {
  return findShoshiSubject(subjectSlug)?.parts.flatMap((p) => p.units) ?? [];
}
