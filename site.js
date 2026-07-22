/* ============================================================
   メキキHP 共通スクリプト site.js（2026-07-22）
   CSP（script-src 'self'）対応のため、インラインJSではなく
   本ファイルに全スクリプトをまとめています。
   1) ナビ開閉（全ページ）
   2) コラム予約公開（data-publish の日付が来たら自動表示）
   3) コラムのカテゴリ絞り込みタブ
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

  var list = document.querySelector('.article-list');
  if (!list) return; /* コラム一覧がないページはここまで */

  /* ---------- 2) 予約公開 ----------
     カードに data-publish="YYYY-MM-DD" が付いている場合、
     その日付になるまで非表示（CSS側で既定非表示 → ここで公開判定）。
     日付なしのカードは常に表示。 */
  function todayStr() {
    var d = new Date();
    var m = String(d.getMonth() + 1);
    var day = String(d.getDate());
    if (m.length < 2) m = '0' + m;
    if (day.length < 2) day = '0' + day;
    return d.getFullYear() + '-' + m + '-' + day;
  }
  var items = Array.prototype.slice.call(list.querySelectorAll('.article-item'));
  var today = todayStr();
  items.forEach(function (item) {
    var pub = item.getAttribute('data-publish');
    if (!pub || pub <= today) item.classList.add('is-published');
  });

  /* ---------- 3) カテゴリ絞り込み ---------- */
  var filter = document.querySelector('.col-filter');
  if (!filter) return;
  var buttons = Array.prototype.slice.call(filter.querySelectorAll('button[data-filter]'));

  function published() {
    return items.filter(function (i) { return i.classList.contains('is-published'); });
  }

  /* ボタンに公開済み件数を表示 */
  buttons.forEach(function (b) {
    var key = b.getAttribute('data-filter');
    var n = published().filter(function (i) {
      return key === 'all' || i.getAttribute('data-cat') === key;
    }).length;
    var cnt = document.createElement('span');
    cnt.className = 'cnt';
    cnt.textContent = String(n);
    b.appendChild(cnt);
  });

  function apply(key) {
    items.forEach(function (i) {
      var match = (key === 'all' || i.getAttribute('data-cat') === key);
      i.classList.toggle('is-hidden', !match);
    });
    buttons.forEach(function (b) {
      var active = b.getAttribute('data-filter') === key;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      apply(b.getAttribute('data-filter'));
    });
  });

  apply('all');
})();
