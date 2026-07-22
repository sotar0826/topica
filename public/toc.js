// 記事ページの追従目次を自動生成する（h2/h3から）
// フック: [data-toc] … 目次の挿入先（空のプレースホルダ div）
// 見出しが少ない（3個未満）ページでは生成しない。
(function () {
  var MIN_HEADINGS = 3;

  var containers = document.querySelectorAll("[data-toc]");
  if (!containers.length) return;

  var article = document.querySelector(".topic-body");
  if (!article) return;

  var headings = Array.prototype.filter.call(
    article.querySelectorAll("h2, h3"),
    function (h) {
      return !!h.id;
    }
  );
  if (headings.length < MIN_HEADINGS) return;

  containers.forEach(function (container) {
    var nav = document.createElement("nav");
    nav.className = "toc";
    nav.setAttribute("aria-label", "目次");

    var details = document.createElement("details");
    details.className = "toc-details";
    // モバイル幅では閉じた状態、タブレット以上では開いた状態で表示
    details.open = window.innerWidth >= 768;

    var summary = document.createElement("summary");
    summary.textContent = "目次";
    details.appendChild(summary);

    var list = document.createElement("ol");
    var currentSubList = null;

    headings.forEach(function (h) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);

      if (h.tagName === "H3" && currentSubList) {
        currentSubList.appendChild(li);
      } else {
        list.appendChild(li);
        currentSubList = null;
        if (h.tagName === "H2") {
          currentSubList = document.createElement("ul");
          li.appendChild(currentSubList);
        }
      }
    });

    details.appendChild(list);
    nav.appendChild(details);
    container.appendChild(nav);
  });
})();
