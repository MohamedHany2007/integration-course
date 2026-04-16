// =============================================
// بيانات الكتاب: محاضرات في حساب التكامل (د. صالح الدين عباس)
// =============================================
const courseData = {
  chapters: [
    {
      id: 1,
      title: "١. التكامل غير المحدود والجدول القياسي",
      content: `
        <h2>التكامل غير المحدود</h2>
        <p class="mb-4">تعريف: إذا كانت \\(f, g\\) دالتين معرفتين على الفترة المفتوحة \\((a, b)\\) وكانت \\(f\\) دالة قابلة للاشتقاق على هذه الفترة بحيث يكون \\(f'(x) = g(x)\\) لكل \\(x \\in (a, b)\\) فإن الدالة \\(f\\) تسمى دالة مقابلة أو تكامل غير محدود للدالة \\(g\\) ونعبر عن ذلك بالرمز \\(\\int g(x) dx = f(x) + c\\).</p>
        
        <h3>الجدول القياسي للتكاملات</h3>
        <table class="math-table">
          <thead>
            <tr><th>القاعدة</th><th>التكامل</th></tr>
          </thead>
          <tbody>
            <tr><td>(1)</td><td>\\(\\int 0 \\, dx = c\\)</td></tr>
            <tr><td>(2)</td><td>\\(\\int k f(x) dx = k \\int f(x) dx\\)</td></tr>
            <tr><td>(3)</td><td>\\(\\int [f(x) + g(x)] dx = \\int f(x) dx + \\int g(x) dx\\)</td></tr>
            <tr><td>(4)</td><td>\\(\\int [f(x) - g(x)] dx = \\int f(x) dx - \\int g(x) dx\\)</td></tr>
            <tr><td>(5)</td><td>\\(\\int x^n dx = \\frac{x^{n+1}}{n+1} + c \\quad (n \\neq -1)\\)</td></tr>
            <tr><td>(6)</td><td>\\(\\int \\frac{dx}{x} = \\ln |x| + c\\)</td></tr>
            <tr><td>(7)</td><td>\\(\\int e^x dx = e^x + c\\)</td></tr>
            <tr><td>(8)</td><td>\\(\\int a^x dx = \\frac{a^x}{\\ln a} + c\\)</td></tr>
          </tbody>
        </table>
        
        <h3>أمثلة محلولة (من الكتاب صفحة ١٢-١٣)</h3>
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <p class="font-bold">مثال ١:</p>
          <p>\\(\\int (2x^3 - 4x^2 + x) dx = 2 \\int x^3 dx - 4 \\int x^2 dx + \\int x dx = \\frac{1}{2}x^4 - \\frac{4}{3}x^3 + \\frac{1}{2}x^2 + c\\)</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <p class="font-bold">مثال ٢:</p>
          <p>\\(\\int \\left(8x^3 - 6\\sqrt{x} + \\frac{1}{x^2}\\right) dx = \\frac{1}{4}x^4 - 4x^{3/2} - \\frac{1}{x} + c\\)</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <p class="font-bold">مثال ٣:</p>
          <p>\\(\\int \\frac{x+1}{\\sqrt{x}} dx = \\int x^{1/2} dx + \\int x^{-1/2} dx = \\frac{2}{3}x^{3/2} + 2x^{1/2} + c\\)</p>
        </div>
        
        <h3>المعادلات التفاضلية من الدرجة الأولى</h3>
        <p>المعادلة التفاضلية في متغيرين \\(x, y\\) هي معادلة تحتوي على المتغيرين وتفاضلات \\(y\\) بالنسبة إلى \\(x\\). وتكون على الصورة \\(\\frac{dy}{dx} = f(x, y)\\).</p>
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <p class="font-bold">مثال ٤ (صفحة ١٥):</p>
          <p>أوجد الحل العام للمعادلة \\(\\frac{dy}{dx} = 5\\)</p>
          <p>الحل: \\(dy = 5 dx \\implies \\int dy = \\int 5 dx \\implies y = 5x + c\\)</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <p class="font-bold">مثال ٥ (صفحة ١٦):</p>
          <p>\\(\\frac{dy}{dx} = x^2 + 1 \\implies y = \\frac{1}{3}x^3 + x + c\\)</p>
        </div>
        
        <p class="mt-4 text-sm text-gray-600">المصدر: محاضرات في حساب التكامل - د. صالح الدين عباس، كلية العلوم - جامعة سوهاج.</p>
      `
    }
    // باقي الأبواب ستضاف لاحقاً بنفس الهيكل
  ]
};

// =============================================
// وظائف العرض والتفاعل (بدون تغيير)
// =============================================

const chapterListEl = document.getElementById('chapter-list');
const contentAreaEl = document.getElementById('content-area');

function renderSidebar() {
  if (!chapterListEl) return;
  let html = '';
  courseData.chapters.forEach((chapter) => {
    html += `
      <li>
        <button 
          class="sidebar-item w-full text-right px-4 py-3 rounded-lg text-slate-200 hover:text-white flex items-center"
          data-chapter-id="${chapter.id}"
        >
          <span class="mr-2 text-blue-300">📘</span>
          <span>${chapter.title}</span>
        </button>
      </li>
    `;
  });
  chapterListEl.innerHTML = html;
  document.querySelectorAll('[data-chapter-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.dataset.chapterId);
      loadChapter(id);
      document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function loadChapter(chapterId) {
  const chapter = courseData.chapters.find(ch => ch.id === chapterId);
  if (!chapter) return;
  contentAreaEl.innerHTML = chapter.content;
  if (window.MathJax) {
    MathJax.typesetPromise([contentAreaEl]).catch(err => console.log('MathJax error:', err));
  }
}

function initializePage() {
  renderSidebar();
  if (courseData.chapters.length > 0) {
    const firstChapterId = courseData.chapters[0].id;
    loadChapter(firstChapterId);
    const firstBtn = document.querySelector(`[data-chapter-id="${firstChapterId}"]`);
    if (firstBtn) firstBtn.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', initializePage);
