/* ============================================================
   メキキHP 共通スクリプト site.js（2026-07-22 v2）
   CSP（script-src 'self'）対応のため、インラインJSではなく
   本ファイルに全スクリプトをまとめています。
   1) ナビ開閉（全ページ）
   2) コラム予約公開（data-publish の日付が来たら自動表示）
   3) コラムのアコーディオン（題目＝カテゴリを開いて小題目＝記事を選ぶ）
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1) ナビ開閉 ---------- */
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var acc = document.querySelector('.col-accordion');
  if (!acc) return; /* コラム一覧がないページはここまで */

  /* ---------- 2) 予約公開 ----------
     data-publish="YYYY-MM-DD" が付いた記事は、その日付になるまで非表示。
     日付なしの記事は常に公開。 */
  function todayStr() {
    var d = new Date();
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (m.length < 2) m = '0' + m;
    if (day.length < 2) day = '0' + day;
    return d.getFullYear() + '-' + m + '-' + day;
  }
  var today = todayStr();
  var items = Array.prototype.slice.call(acc.querySelectorAll('.article-item'));
  items.forEach(function (item) {
    var pub = item.getAttribute('data-publish');
    if (!pub || pub <= today) {
      item.classList.add('is-published');
    } else {
      item.classList.add('is-hidden'); /* 未公開は非表示 */
    }
  });

  /* ---------- 3) アコーディオン（題目→小題目） ---------- */
  var cats = Array.prototype.slice.call(acc.querySelectorAll('.col-cat'));
  cats.forEach(function (cat) {
    var published = cat.querySelectorAll('.article-item.is-published').length;
    var cntEl = cat.querySelector('.col-cat-count');
    if (cntEl) cntEl.textContent = String(published);
    /* 公開済みが0件の題目は、まるごと隠す */
    if (published === 0) {
      cat.classList.add('is-hidden');
      return;
    }
    var head = cat.querySelector('.col-cat-head');
    if (!head) return;
    head.addEventListener('click', function () {
      var open = cat.classList.toggle('open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
