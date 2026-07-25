// /hanrei/ 一覧のフィルタ（科目タブ・重要度チェック・並び替え）。バニラJS。
// フック:
//   #hanrei-filters              … フィルタUI全体（JS有効時のみ [hidden] を外して表示）
//   .filter-chip[data-subject]   … 科目タブ（"all" または科目slug）
//   [data-rank-checkbox]         … 重要度A/B/Cのチェックボックス
//   #hanrei-sort / [data-sort]   … 並び替えセレクト（"subject" | "date"）
//   .hanrei-view[data-view]      … 表示切替対象（"subject"=科目順グループ表示 / "date"=年代順フラット表示）
//   .hanrei-item[data-subject][data-rank][data-date] … 各判例の<li>
// 状態はURLハッシュ（#subject=keiho&rank=A,B&sort=date）に保存し、リロード・共有で復元できるようにする。
// JS無効時はこのファイル自体が読み込まれないため、現行の科目別全件表示のまま壊れない。
(function () {
  var filters = document.getElementById("hanrei-filters");
  if (!filters) return;

  var chips = Array.prototype.slice.call(filters.querySelectorAll(".filter-chip"));
  var rankBoxes = Array.prototype.slice.call(filters.querySelectorAll("[data-rank-checkbox]"));
  var sortSelect = document.getElementById("hanrei-sort");
  var views = Array.prototype.slice.call(document.querySelectorAll(".hanrei-view"));
  var countEl = document.getElementById("hanrei-filter-count");
  var allItems = Array.prototype.slice.call(document.querySelectorAll(".hanrei-item"));

  var ALL_RANKS = ["A", "B", "C"];

  function parseHash() {
    var state = { subject: "all", ranks: ALL_RANKS.slice(), sort: "subject" };
    var raw = window.location.hash.replace(/^#/, "");
    if (!raw) return state;
    raw.split("&").forEach(function (pair) {
      var idx = pair.indexOf("=");
      if (idx < 0) return;
      var key = decodeURIComponent(pair.slice(0, idx));
      var value = decodeURIComponent(pair.slice(idx + 1));
      if (key === "subject" && value) state.subject = value;
      if (key === "rank" && value) {
        var ranks = value
          .split(",")
          .map(function (r) {
            return r.trim().toUpperCase();
          })
          .filter(function (r) {
            return ALL_RANKS.indexOf(r) !== -1;
          });
        if (ranks.length > 0) state.ranks = ranks;
      }
      if (key === "sort" && (value === "subject" || value === "date")) state.sort = value;
    });
    return state;
  }

  function writeHash(state) {
    var parts = [];
    if (state.subject !== "all") parts.push("subject=" + encodeURIComponent(state.subject));
    if (state.ranks.length !== ALL_RANKS.length) parts.push("rank=" + state.ranks.join(","));
    if (state.sort !== "subject") parts.push("sort=" + state.sort);
    var hash = parts.length ? "#" + parts.join("&") : "";
    // pushStateではなくreplaceStateで履歴を汚さない
    var url = window.location.pathname + window.location.search + hash;
    window.history.replaceState(null, "", url);
  }

  var state = parseHash();

  function paintChips() {
    chips.forEach(function (chip) {
      var isActive = chip.getAttribute("data-subject") === state.subject;
      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function paintRankBoxes() {
    rankBoxes.forEach(function (box) {
      box.checked = state.ranks.indexOf(box.value) !== -1;
    });
  }

  function paintSort() {
    if (sortSelect) sortSelect.value = state.sort;
    views.forEach(function (view) {
      view.hidden = view.getAttribute("data-view") !== state.sort;
    });
  }

  function applyFilters() {
    allItems.forEach(function (li) {
      var subjectOk = state.subject === "all" || li.getAttribute("data-subject") === state.subject;
      var rank = li.getAttribute("data-rank") || "";
      var rankOk = rank === "" || state.ranks.indexOf(rank) !== -1;
      li.hidden = !(subjectOk && rankOk);
    });

    // 科目順ビューでは、該当0件になった科目セクションごと隠す
    document.querySelectorAll(".hanrei-view[data-view] [data-subject-section]").forEach(function (section) {
      var hasVisible = Array.prototype.some.call(section.querySelectorAll(".hanrei-item"), function (li) {
        return !li.hidden;
      });
      section.hidden = !hasVisible;
    });

    // 件数表示は「現在表示中のビュー」だけを数える（subject/dateの2ビュー分を
    // 二重カウントしないように）。全体件数は表示中ビューの総アイテム数を使う。
    if (countEl) {
      var activeView = views.filter(function (v) {
        return !v.hidden;
      })[0];
      var activeItems = activeView ? Array.prototype.slice.call(activeView.querySelectorAll(".hanrei-item")) : [];
      var total = activeItems.length;
      var visibleCount = activeItems.filter(function (li) {
        return !li.hidden;
      }).length;
      countEl.textContent = total + "件中 " + visibleCount + "件を表示中";
    }
  }

  function render() {
    paintChips();
    paintRankBoxes();
    paintSort();
    applyFilters();
    writeHash(state);
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      state.subject = chip.getAttribute("data-subject") || "all";
      render();
    });
  });

  rankBoxes.forEach(function (box) {
    box.addEventListener("change", function () {
      var checked = rankBoxes
        .filter(function (b) {
          return b.checked;
        })
        .map(function (b) {
          return b.value;
        });
      // 全解除は「絞り込みなし」として全件表示に戻す（0件表示を避ける）
      state.ranks = checked.length > 0 ? checked : ALL_RANKS.slice();
      render();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value === "date" ? "date" : "subject";
      render();
    });
  }

  window.addEventListener("hashchange", function () {
    state = parseHash();
    render();
  });

  // JS有効時のみフィルタUIを表示する（プログレッシブエンハンスメント）
  filters.hidden = false;
  render();
})();
