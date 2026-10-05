/* register-live.js - the formality checker for learn-business-chinese-advanced-with-phoebe
 *
 * A printed rule list, not a model of Chinese. It finds casual, formal and over-formal markers in a
 * draft, turns them into one formality index from 0 to 100, and scores the draft against the
 * band that suits the channel it is going to. Every marker, weight and band is in this file.
 *
 * What is REAL: every match, every count, every index and every fit on the widget.
 * What it CANNOT judge, and says so on the widget: grammar, meaning, tone of voice, whether a
 *   sentence is true, and any marker not on the list. A draft can score well and still be wrong.
 *
 * Channels and their bands (the index a well-judged message usually lands in):
 *   email   a first formal email to a partner company          70 to 92
 *   wechat  WeChat to a partner's manager you have met            42 to 68
 *   team    a chat message to your own colleague                  12 to 40
 */
(function (root) {
  "use strict";

  /* kind: c = casual, f = formal, o = over-formal (classical or letter-only phrasing).
     swap: the suggestion shown when the marker pushes a draft out of its band. */
  var MARKERS = [
    { m: "你们公司", k: "c", w: 3, swap: "贵公司 (guì gōngsī, your company)" },
    { m: "我们公司", k: "c", w: 2, swap: "我司 (wǒ sī, our company)" },
    { m: "咋样", k: "c", w: 3, swap: "如何 (rúhé, how)" },
    { m: "咋", k: "c", w: 3, swap: "怎么 (zěnme, how)" },
    { m: "啥", k: "c", w: 3, swap: "什么 (shénme, what)" },
    { m: "搞定", k: "c", w: 3, swap: "完成 (wánchéng, complete)" },
    { m: "弄好", k: "c", w: 2, swap: "处理好 (chǔlǐ hǎo, handle)" },
    { m: "赶紧", k: "c", w: 2, swap: "尽快 (jǐnkuài, as soon as possible)" },
    { m: "回头", k: "c", w: 2, swap: "稍后 (shāohòu, later)" },
    { m: "东西", k: "c", w: 1, swap: "资料 (zīliào, materials)" },
    { m: "帮我", k: "c", w: 2, swap: "烦请 (fánqǐng, may I trouble you to)" },
    { m: "谢啦", k: "c", w: 3, swap: "谢谢 (xièxie, thank you)" },
    { m: "没问题", k: "c", w: 1, swap: "可以 (kěyǐ, that works)" },
    { m: "哈哈", k: "c", w: 3, swap: "(remove)" },
    { m: "嗯嗯", k: "c", w: 3, swap: "(remove)" },
    { m: "亲", k: "c", w: 3, swap: "(remove; shop-assistant register)" },
    { m: "啦", k: "c", w: 2, swap: "(remove the particle)" },
    { m: "哦", k: "c", w: 2, swap: "(remove the particle)" },
    { m: "吧", k: "c", w: 1, swap: "(soften with 请 qǐng, please, instead)" },
    { m: "你", k: "c", w: 2, swap: "您 (nín, you, polite)" },
    { m: "吗", k: "c", w: 1, swap: "是否 (shìfǒu, whether)" },

    { m: "您", k: "f", w: 2 },
    { m: "贵公司", k: "f", w: 3 },
    { m: "贵司", k: "f", w: 3 },
    { m: "我司", k: "f", w: 2 },
    { m: "烦请", k: "f", w: 3 },
    { m: "请查收", k: "f", w: 3 },
    { m: "如有疑问", k: "f", w: 3 },
    { m: "是否", k: "f", w: 2 },
    { m: "尽快", k: "f", w: 1 },
    { m: "稍后", k: "f", w: 1 },
    { m: "尊敬的", k: "f", w: 3 },
    { m: "感谢", k: "f", w: 1 },
    { m: "请", k: "f", w: 1 },
    { m: "此致", k: "f", w: 3 },
    { m: "敬礼", k: "f", w: 2 },

    { m: "敝司", k: "o", w: 4, swap: "我司 (wǒ sī, our company)" },
    { m: "鄙人", k: "o", w: 5, swap: "我 (wǒ, I)" },
    { m: "兹", k: "o", w: 4, swap: "现 (xiàn, now)" },
    { m: "谨此", k: "o", w: 4, swap: "(remove)" },
    { m: "承蒙", k: "o", w: 4, swap: "感谢 (gǎnxiè, thanks to)" },
    { m: "顺颂商祺", k: "o", w: 4, swap: "祝好 (zhù hǎo, best wishes) in a message" },
    { m: "恭候佳音", k: "o", w: 4, swap: "期待您的回复 (qīdài nín de huífù, looking forward to your reply)" }
  ];
  /* longer markers first, so 贵公司 is not also counted as 公司-something, and 你们公司 is not also 你 */
  MARKERS.sort(function (a, b) { return b.m.length - a.m.length; });

  var CHANNELS = {
    email: { label: "Formal email to a partner company", lo: 70, hi: 92 },
    wechat: { label: "WeChat to a partner's manager you have met", lo: 42, hi: 68 },
    team: { label: "Chat to your own colleague", lo: 12, hi: 40 }
  };

  function find(text) {
    var used = new Array(text.length), hits = [];
    MARKERS.forEach(function (mk) {
      var i = text.indexOf(mk.m);
      while (i >= 0) {
        var free = true;
        for (var j = i; j < i + mk.m.length; j++) if (used[j]) { free = false; break; }
        if (free) { for (j = i; j < i + mk.m.length; j++) used[j] = true; hits.push({ at: i, mk: mk }); }
        i = text.indexOf(mk.m, i + 1);
      }
    });
    return hits.sort(function (a, b) { return a.at - b.at; });
  }

  /* the index: 47 is neutral; formal and over-formal points push it up, casual points pull it
     down, scaled by length so a long message is not formal just for being long */
  function analyse(text) {
    var hits = find(text), c = 0, f = 0, o = 0;
    hits.forEach(function (h) { if (h.mk.k === "c") c += h.mk.w; else if (h.mk.k === "f") f += h.mk.w; else o += h.mk.w; });
    var hanzi = (text.match(/[一-鿿]/g) || []).length;
    var scale = Math.max(1, Math.sqrt(hanzi / 30));
    var raw = 47 + 2.1 * (f + 1.6 * o - c) / scale;
    var index = Math.max(0, Math.min(100, Math.round(raw)));
    return { hits: hits, casual: c, formal: f, over: o, hanzi: hanzi, index: index };
  }
  function fit(a, channel) {
    var ch = CHANNELS[channel];
    var off = a.index < ch.lo ? ch.lo - a.index : (a.index > ch.hi ? a.index - ch.hi : 0);
    return { inBand: off === 0, off: off, score: Math.max(0, 100 - 3 * off), dir: a.index < ch.lo ? "too casual" : (a.index > ch.hi ? "too stiff" : "in band") };
  }

  /* ---------- the bench: one message, written five ways ---------- */
  /* The message: confirm Thursday's 3 pm meeting, attach the draft contract, ask them to
     look at the price clause before then. Written by the bench author; constructed. */
  var DRAFTS = [
    { id: "friend", label: "As if to a friend",
      text: "哈哈好的！周四下午三点见啦。合同我弄好了，你看看价格那块咋样，回头聊哦～",
      en: "Ha ha OK! See you Thursday at three. I've sorted the contract, take a look at how the price bit is, chat later~" },
    { id: "literal", label: "Translated word for word from English",
      text: "你好，我想确认周四下午三点的会议。我附上了合同草稿。你可以在会议前看一下价格条款吗？谢谢。",
      en: "Hello, I want to confirm the meeting on Thursday at 3 pm. I have attached the draft contract. Can you look at the price clause before the meeting? Thank you." },
    { id: "polite", label: "Polite WeChat",
      text: "王经理您好，周四下午三点的会议我这边确认没问题。合同草稿已发您，麻烦您会前看一下价格条款，有任何问题随时告诉我，谢谢！",
      en: "Hello Manager Wang, I can confirm Thursday's 3 pm meeting. The draft contract has been sent to you; could I trouble you to look at the price clause before the meeting? Let me know any time if anything comes up, thank you!" },
    { id: "formal", label: "Formal email",
      text: "尊敬的王经理：您好！现确认周四下午三点的会议安排。合同草稿已随附件发送，请查收。烦请您在会议前审阅价格条款，如有疑问，请随时与我联系。感谢您的支持！此致 敬礼",
      en: "Dear Manager Wang: Hello! This is to confirm the meeting arrangements for Thursday at 3 pm. The draft contract is attached; please find it enclosed. May I trouble you to review the price clause before the meeting; if you have any questions, please contact me at any time. Thank you for your support! With respect" },
    { id: "polished", label: "Polish everything", anti: true,
      text: "尊敬的王经理：兹谨此确认周四下午三点之会议安排。承蒙贵司厚爱，敝司已随附合同草稿，烦请查收并审阅价格条款。恭候佳音，顺颂商祺。鄙人敬上",
      en: "Respected Manager Wang: We hereby respectfully confirm the arrangements for Thursday's 3 pm meeting. Indebted to your esteemed company's kind regard, our humble company encloses the draft contract and troubles you to receive it and review the price clause. Awaiting your good news, and wishing your business well. Respectfully, this humble person" }
  ];
  function runBench() {
    var out = {};
    DRAFTS.forEach(function (d) {
      var a = analyse(d.text), row = { index: a.index, casual: a.casual, formal: a.formal, over: a.over, fits: {} };
      Object.keys(CHANNELS).forEach(function (ch) { row.fits[ch] = fit(a, ch); });
      out[d.id] = row;
    });
    return out;
  }

  /* ---------- UI ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function mark(text, hits) {
    var out = "", last = 0;
    hits.forEach(function (h) {
      out += esc(text.slice(last, h.at)) + "<mark class='rg-" + h.mk.k + "' title='" + esc(h.mk.swap || "formal marker") + "'>" + esc(h.mk.m) + "</mark>";
      last = h.at + h.mk.m.length;
    });
    return out + esc(text.slice(last));
  }
  function buildBench(el, res) {
    var head = Object.keys(CHANNELS).map(function (k) { return "<th>" + esc(CHANNELS[k].label) + "<em>band " + CHANNELS[k].lo + " to " + CHANNELS[k].hi + "</em></th>"; }).join("");
    var body = DRAFTS.map(function (d) {
      var r = res[d.id];
      var cells = Object.keys(CHANNELS).map(function (k) { var f = r.fits[k]; return "<td class='" + (f.inBand ? "rg-in" : "") + "'><b>" + f.score + "</b><em>" + f.dir + "</em></td>"; }).join("");
      return "<tr" + (d.anti ? " class='tl-anti'" : "") + "><th>" + esc(d.label) + (d.anti ? " <span class='mb-anti'>trap</span>" : "") +
        "<em>index " + r.index + " · casual " + r.casual + " · formal " + r.formal + " · over-formal " + r.over + "</em></th>" + cells + "</tr>";
    }).join("");
    el.innerHTML = "<table class='dt-table tl-table'><thead><tr><th>The same message, written as</th>" + head + "</tr></thead><tbody>" + body + "</tbody></table>" +
      "<details class='rg-drafts'><summary>Read the five drafts, with every marker highlighted</summary>" +
      DRAFTS.map(function (d) { return "<p><b>" + esc(d.label) + ".</b> " + mark(d.text, find(d.text)) + "<br><em class='rg-en'>(In English: " + esc(d.en) + ")</em></p>"; }).join("") + "</details>" +
      "<p class='mb-hint'>Fit is 100 inside the channel's band and drops 3 points for every point of the index outside it. The checker is a printed list of " + MARKERS.length +
      " markers with weights; it cannot judge grammar, meaning or anything not on the list. The drafts are constructed.</p>";
  }
  function buildCheck(el) {
    var opts = Object.keys(CHANNELS).map(function (k) { return "<option value='" + k + "'>" + esc(CHANNELS[k].label) + "</option>"; }).join("");
    el.innerHTML = "<div class='tl-row'><label>Going to <select class='rg-ch'>" + opts + "</select></label>" +
      "<button type='button' class='btn primary rg-go'>Check my draft</button></div>" +
      "<textarea class='rg-in' rows='5' placeholder='Paste or type a draft in Chinese'></textarea><div class='rg-out'></div>";
    var ta = el.querySelector(".rg-in"), ch = el.querySelector(".rg-ch"), out = el.querySelector(".rg-out");
    ta.value = DRAFTS[1].text;
    el.querySelector(".rg-go").addEventListener("click", function () {
      var a = analyse(ta.value), f = fit(a, ch.value);
      var tips = a.hits.filter(function (h) { return (f.dir === "too casual" && h.mk.k === "c") || (f.dir === "too stiff" && h.mk.k === "o"); })
        .map(function (h) { return "<li><b>" + esc(h.mk.m) + "</b> → " + esc(h.mk.swap) + "</li>"; });
      out.innerHTML = "<div class='mb-verdict " + (f.inBand ? "is-good" : "is-ok") + "'>Index " + a.index + " · fit " + f.score + " for this channel · " + f.dir + "</div>" +
        "<p class='rg-marked'>" + mark(ta.value, a.hits) + "</p>" +
        (tips.length ? "<p><b>What moves it into the band:</b></p><ul class='tl-list'>" + tips.join("") + "</ul>" : "") +
        "<p class='mb-hint'>Highlighted: casual, formal, over-formal. A draft can sit in the band and still say the wrong thing; read it once more as the person receiving it.</p>";
    });
  }
  function init() {
    var b = document.getElementById("register-bench"), c = document.getElementById("register-check");
    if (b) { var res = runBench(); buildBench(b, res); root.REGISTER_LIVE = { results: res }; }
    if (c) buildCheck(c);
  }
  var api = { analyse: analyse, fit: fit, find: find, runBench: runBench, DRAFTS: DRAFTS, CHANNELS: CHANNELS, MARKERS: MARKERS };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document !== "undefined") { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init(); }
})(typeof window !== "undefined" ? window : this);
