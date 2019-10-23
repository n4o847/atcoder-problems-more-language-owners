// ==UserScript==
// @name         AtCoder Problems More Language Owners
// @namespace    https://github.com/n4o847
// @version      1.0.0
// @description  AtCoder Problems で Language Owners の表示数を増やします
// @author       n4o847
// @match        https://kenkoooo.com/atcoder/*
// ==/UserScript==

(async function() {
  "use strict";
  if (location.hash !== "#/lang") {
      return;
  }
  const api = `https://kenkoooo.com/atcoder/resources/lang.json`;
  const res = await fetch(api);
  const data = await res.json();
  const subs = new Map();
  for (const item of data) {
      if (!subs.has(item.language)) {
          subs.set(item.language, []);
      }
      subs.get(item.language).push(item);
  }
  for (const items of subs.values()) {
      items.sort((a, b) => b.count - a.count);
  }
  const rows = new Map();
  for (const element of document.querySelectorAll("#root > div > div > div > div")) {
      const language = element.querySelector("h1").textContent;
      const row = element.querySelector(":nth-child(2)");
      rows.set(language, row);
  }
  const showRank = (n) => {
      if (10 <= n % 100 && n % 100 <= 19) return `${n}th`;
      if (n % 10 === 1) return `${n}st`;
      if (n % 10 === 2) return `${n}nd`;
      if (n % 10 === 3) return `${n}rd`;
      return `${n}th`;
  };
  const setShowingNumber = (number) => {
      for (const [language, items] of subs.entries()) {
          const row = rows.get(language);
          while (row.children.length > number) {
              row.lastElementChild.remove();
          }
          while (row.children.length < Math.min(number, items.length)) {
              const item = items[row.children.length];
              const col = document.createElement("div");
              col.className = "text-center col";
              {
                  const rank = document.createElement("h5");
                  rank.textContent = showRank(row.children.length + 1);
                  col.append(rank);
              }
              {
                  const user = document.createElement("h3");
                  user.textContent = item.user_id;
                  col.append(user);
              }
              {
                  const count = document.createElement("h5");
                  count.className = "text-muted";
                  count.textContent = `${item.count} AC`;
                  col.append(count);
              }
              row.append(col);
          }
      }
  };
  {
      const container = document.createElement("div");
      container.style.cssText = "text-align: right;";
      {
          const group = document.createElement("div");
          group.className = "btn-group";
          for (const i of [3, 5, 10, 20]) {
              const button = document.createElement("button");
              button.type = "button";
              button.className = "btn btn-secondary";
              button.textContent = i;
              button.addEventListener("click", () => {
                  setShowingNumber(i);
              });
              group.append(button);
          }
          container.append(group);
      }
      document.querySelector("#root > div > div").prepend(container);
  }
})();
