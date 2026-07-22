// ヘッダーのハンバーガーメニュー・ダークモード切替・印刷時のdetails展開
// フック:
//   #nav-toggle / #header-nav … モバイルドロワーの開閉（aria-expanded同期）
//   #theme-toggle             … ダークモード手動切替（localStorage "topica:theme"）
//   <html data-theme>         … 実際のテーマ値。head内のinlineスクリプトが初期値を設定する
(function () {
  var THEME_KEY = "topica:theme";

  // ---- モバイルドロワー ----
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("header-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    // メニュー内のリンクをクリックしたらドロワーを閉じる
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    // 開いた状態で画面外をクリックしたら閉じる
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  }

  // ---- ダークモード手動切替 ----
  var themeBtn = document.getElementById("theme-toggle");
  function paintThemeButton() {
    if (!themeBtn) return;
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    themeBtn.textContent = isDark ? "☀️" : "🌙";
    themeBtn.setAttribute(
      "aria-label",
      isDark ? "ライトモードに切り替える" : "ダークモードに切り替える"
    );
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current =
        document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* localStorage不可時は保存しないだけ */
      }
      paintThemeButton();
    });
    paintThemeButton();
  }

  // ---- 印刷時に <details> をすべて開く（印刷後に元の状態へ復元） ----
  var printOpenState = null;
  window.addEventListener("beforeprint", function () {
    printOpenState = [];
    document.querySelectorAll("details").forEach(function (d) {
      printOpenState.push([d, d.open]);
      d.open = true;
    });
  });
  window.addEventListener("afterprint", function () {
    if (!printOpenState) return;
    printOpenState.forEach(function (pair) {
      pair[0].open = pair[1];
    });
    printOpenState = null;
  });
})();
