/* ═══════════════════════════════════════════════
   حساب التكامل — د. صلاح الدين عباس
   main.js
   ═══════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   بيانات روابط صفحات الأسئلة لكل باب
   المفتاح هو رقم الباب (0 = مقدمة)
   ────────────────────────────────────────────── */
const QUIZ_URLS = {
  0: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/1471926c-3c73-4cfa-a02d-d440f51d0bb6",
  1: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/4559a66c-bc61-4aa1-884d-7a1d60298a69",
  2: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/fef96b74-2586-46f3-8537-113642403d57",
  3: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/71ab0b0f-779a-43e9-9803-7fe3589dbd74",
  4: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/ecf64df8-5f0a-4b37-98c7-6c8ebce1e54f",
  5: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/e9b24488-2274-44c6-ab90-352d5e6f86c3",
  6: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/5d9dc46f-076f-4d16-8a7a-dbf49e2f133c",
  7: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/86e681f0-ac66-47b0-915a-ec607d3b1f7e",
  8: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/124b35ee-4089-4e34-ae40-9ced7c60a494",
  9: "https://notebooklm.google.com/notebook/4d18c0f9-1aaf-4c52-a731-3579701ac56a/artifact/f9faa0ce-dfea-41eb-9afa-8744701f240b"
};

/* رقم الباب الحالي المعروض */
let currentChapter = 0;

/* ──────────────────────────────────────────────
   showChapter — الانتقال بين الأبواب
   ────────────────────────────────────────────── */
function showChapter(idx) {
  // أخفِ كل الأبواب وأزل الـ active من كل عنصر تنقل
  document.querySelectorAll('.chapter').forEach((c, i) => {
    c.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.nav-item').forEach((n, i) => {
    n.classList.toggle('active', i === idx);
  });

  currentChapter = idx;

  // أعد تصيير معادلات KaTeX في الباب الجديد بعد ظهوره
  requestAnimationFrame(() => {
    const activeChapter = document.getElementById('ch' + idx);
    if (activeChapter && window.renderMathInElement) {
      renderMathInElement(activeChapter, {
        delimiters: [
          { left: "$$",   right: "$$",   display: true  },
          { left: "\\[",  right: "\\]",  display: true  },
          { left: "$",    right: "$",    display: false },
          { left: "\\(",  right: "\\)",  display: false }
        ],
        throwOnError: false
      });
    }
  });

  // مرر إلى أعلى منطقة المحتوى
  const pane = document.querySelector('.content-pane');
  if (pane) pane.scrollTop = 0;

  // أغلق إطار المتصفح المدمج إن كان مفتوحاً
  closeBrowser();
}

/* ──────────────────────────────────────────────
   toggleExample — إظهار/إخفاء حل مثال
   ────────────────────────────────────────────── */
function toggleExample(header) {
  const sol   = header.closest('.example-card').querySelector('.example-solution');
  const isOpen = sol.classList.toggle('show');
  header.classList.toggle('open', isOpen);
}

/* ──────────────────────────────────────────────
   checkQuiz — التحقق من إجابات الاختبار القصير
   answers: كائن { اسم_السؤال: القيمة_الصحيحة }
   ────────────────────────────────────────────── */
function checkQuiz(resultId, answers) {
  // أزل التلوين السابق من كل الخيارات
  document.querySelectorAll('.quiz-opt').forEach(opt => {
    opt.classList.remove('correct', 'wrong');
  });

  let correct     = 0;
  let total       = Object.keys(answers).length;
  let allAnswered = true;

  for (const [qName, correctVal] of Object.entries(answers)) {
    const selected = document.querySelector(`input[name="${qName}"]:checked`);
    if (!selected) { allAnswered = false; continue; }

    const label = selected.closest('.quiz-opt');
    if (selected.value === correctVal) {
      correct++;
      label.classList.add('correct');
    } else {
      label.classList.add('wrong');
      // لوّن الإجابة الصحيحة باللون الأخضر تلقائياً
      const correctInput = document.querySelector(
        `input[name="${qName}"][value="${correctVal}"]`
      );
      if (correctInput) correctInput.closest('.quiz-opt').classList.add('correct');
    }
  }

  const result = document.getElementById(resultId);
  if (!result) return;

  if (!allAnswered) {
    result.className    = 'quiz-result show fail';
    result.textContent  = '⚠️ يرجى الإجابة على جميع الأسئلة أولاً.';
    return;
  }

  result.className   = `quiz-result show ${correct === total ? 'pass' : 'fail'}`;
  result.textContent = correct === total
    ? `✅ ممتاز! أجبت على ${correct} من ${total} إجابات صحيحة.`
    : `❌ أجبت على ${correct} من ${total}. راجع الإجابات الصحيحة المُظللة.`;
}

/* ══════════════════════════════════════════════
   BROWSER — نظام المتصفح المدمج
   ══════════════════════════════════════════════ */

/* مرجع إطار iframe */
let iframeEl = null;

/* ──────────────────────────────────────────────
   openBrowser — فتح المتصفح المدمج برابط معين
   ────────────────────────────────────────────── */
function openBrowser(url) {
  const browserWrap = document.getElementById('browser-wrap');
  const contentPane = document.querySelector('.content-pane');
  const urlBar      = document.getElementById('browser-url-bar');
  const loading     = document.getElementById('iframe-loading');

  if (!browserWrap || !contentPane) return;

  // أخفِ محتوى الباب وأظهر المتصفح
  contentPane.style.display  = 'none';
  browserWrap.style.display  = 'flex';

  // ضع الرابط في شريط العنوان
  if (urlBar) urlBar.value = url;

  // أظهر مؤشر التحميل
  if (loading) loading.classList.remove('hidden');

  // حمّل الرابط في iframe
  iframeEl = document.getElementById('quiz-iframe');
  if (iframeEl) {
    iframeEl.src = url;
    iframeEl.onload = () => {
      if (loading) loading.classList.add('hidden');
    };
  }
}

/* ──────────────────────────────────────────────
   closeBrowser — إغلاق المتصفح والعودة للمحتوى
   ────────────────────────────────────────────── */
function closeBrowser() {
  const browserWrap = document.getElementById('browser-wrap');
  const contentPane = document.querySelector('.content-pane');

  if (!browserWrap || !contentPane) return;

  browserWrap.style.display = 'none';
  contentPane.style.display = 'flex'; // أعد إظهار المحتوى

  // أوقف تحميل iframe لتجنب الاستهلاك
  if (iframeEl) iframeEl.src = 'about:blank';
}

/* ──────────────────────────────────────────────
   refreshBrowser — إعادة تحميل الصفحة في الإطار
   ────────────────────────────────────────────── */
function refreshBrowser() {
  if (!iframeEl) return;
  const loading = document.getElementById('iframe-loading');
  if (loading) loading.classList.remove('hidden');

  const currentSrc = iframeEl.src;
  iframeEl.src = 'about:blank';
  setTimeout(() => {
    iframeEl.src = currentSrc;
    iframeEl.onload = () => {
      if (loading) loading.classList.add('hidden');
    };
  }, 80);
}

/* ──────────────────────────────────────────────
   openQuizForCurrentChapter — يُستدعى من زر
   "افتح صفحة الأسئلة" في كل باب
   ────────────────────────────────────────────── */
function openQuizForCurrentChapter() {
  const url = QUIZ_URLS[currentChapter];
  if (url) openBrowser(url);
}

/* ──────────────────────────────────────────────
   openExternalTab — فتح الرابط في تبويب جديد
   ────────────────────────────────────────────── */
function openExternalTab() {
  const urlBar = document.getElementById('browser-url-bar');
  const url    = urlBar ? urlBar.value : null;
  if (url && url !== 'about:blank') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/* ──────────────────────────────────────────────
   DOMContentLoaded — تشغيل KaTeX عند تحميل الصفحة
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  // تصيير المعادلات في الباب الأول (المقدمة) فقط عند البدء
  const firstChapter = document.getElementById('ch0');
  if (firstChapter && window.renderMathInElement) {
    renderMathInElement(firstChapter, {
      delimiters: [
        { left: "$$",   right: "$$",   display: true  },
        { left: "\\[",  right: "\\]",  display: true  },
        { left: "$",    right: "$",    display: false },
        { left: "\\(",  right: "\\)",  display: false }
      ],
      throwOnError: false
    });
  }
});
// تبديل الوضع الليلي
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', targetTheme);
  themeToggle.innerText = targetTheme === 'dark' ? '☀️' : '🌙';
});

// تحسين وظيفة التنقل بين الفصول لإضافة الأنيميشن
function showChapter(index) {
  const chapters = document.querySelectorAll('.chapter');
  const navItems = document.querySelectorAll('.nav-item');

  chapters.forEach(ch => {
    ch.classList.remove('active');
    setTimeout(() => ch.style.display = 'none', 400); // انتظر حتى ينتهي الأنيميشن
  });

  navItems.forEach(item => item.classList.remove('active'));

  setTimeout(() => {
    const activeChapter = document.getElementById(`ch${index}`);
    activeChapter.style.display = 'block';
    setTimeout(() => activeChapter.classList.add('active'), 10);
    navItems[index].classList.add('active');
    
    // تصيير المعادلات في الباب الجديد
    if (window.renderMathInElement) {
      renderMathInElement(activeChapter, {
        delimiters: [
          { left: "$$",  right: "$$",  display: true },
          { left: "$",   right: "$",   display: false }
        ]
      });
    }
  }, 400);

  currentChapter = index;
  closeBrowser();
}
