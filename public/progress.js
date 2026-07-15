// 学習進捗トラッキング（localStorage・ログイン不要）
// キー: "topica:read:{subject}/{slug}" = 読了日（YYYY-MM-DD）
// フック:
//   [data-read-page="minpo/sakugo"]   … 記事末尾の読了トグルボタンの挿入先
//   li[data-read-slug="minpo/sakugo"] … 一覧行（✓マークを付ける）
//   [data-progress data-subject data-total] … 進捗バー（.progress-count / .progress-fill を内包）
//       data-hide-empty="1" なら読了0件のとき非表示（トップページ用）
//   [data-reset-subject="minpo"]      … リセットボタン（"*" で全科目）
(function () {
  var PREFIX = "topica:read:";

  function readCount(subject) {
    var n = 0;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      // 進捗バーは基礎編ベース（応用編 -ouyou は数えない）
      if (k && k.indexOf(PREFIX + subject + "/") === 0 && !/-ouyou$/.test(k)) n++;
    }
    return n;
  }

  function paint() {
    // 一覧の✓マーク
    document.querySelectorAll("li[data-read-slug]").forEach(function (li) {
      var done = !!localStorage.getItem(PREFIX + li.dataset.readSlug);
      li.classList.toggle("is-read", done);
      var mark = li.querySelector(".read-mark");
      if (done && !mark) {
        mark = document.createElement("span");
        mark.className = "read-mark";
        mark.textContent = "✓";
        mark.title = "読了";
        li.appendChild(mark);
      } else if (!done && mark) {
        mark.remove();
      }
    });

    // 進捗バー
    document.querySelectorAll("[data-progress]").forEach(function (box) {
      var total = parseInt(box.dataset.total, 10) || 0;
      var read = Math.min(readCount(box.dataset.subject), total);
      if (box.dataset.hideEmpty === "1") box.hidden = read === 0;
      var count = box.querySelector(".progress-count");
      var fill = box.querySelector(".progress-fill");
      if (count) count.textContent = read + " / " + total;
      if (fill) fill.style.width = (total ? (read / total) * 100 : 0) + "%";
    });

    // トップの進捗サマリー（全科目0件なら丸ごと隠す）
    var summary = document.getElementById("progress-summary");
    if (summary) {
      var anyVisible = Array.prototype.some.call(
        summary.querySelectorAll("[data-progress]"),
        function (b) { return !b.hidden; }
      );
      summary.hidden = !anyVisible;
    }
  }

  // 記事末尾の読了トグル
  document.querySelectorAll("[data-read-page]").forEach(function (el) {
    var key = PREFIX + el.dataset.readPage;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "read-btn";
    function render() {
      var done = !!localStorage.getItem(key);
      btn.textContent = done ? "✓ 読了済み（もう一度押すと取り消し）" : "☑ このページを読了にする";
      btn.classList.toggle("done", done);
    }
    btn.addEventListener("click", function () {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, new Date().toISOString().slice(0, 10));
      }
      render();
      paint();
    });
    el.appendChild(btn);
    render();
  });

  // リセット
  document.querySelectorAll("[data-reset-subject]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var s = btn.dataset.resetSubject;
      var label = s === "*" ? "全科目" : btn.dataset.resetLabel || s;
      if (!confirm(label + "の読了記録をすべてリセットします。よろしいですか？")) return;
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf(PREFIX) !== 0) continue;
        if (s === "*" || k.indexOf(PREFIX + s + "/") === 0) keys.push(k);
      }
      keys.forEach(function (k) { localStorage.removeItem(k); });
      paint();
    });
  });

  paint();
})();
