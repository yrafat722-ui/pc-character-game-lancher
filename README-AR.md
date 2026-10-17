# PC Character Games — لانشر ويندوز

هذه نسخة مصدر جاهزة للبناء كتطبيق Windows EXE/Setup. تم حذف ربط Firebase وملف Google verification وسكربت Google AdSense، وكذلك بطاقة إعلان AdSense وزر تنزيل اللانشر من داخل الواجهة. ملفات الألعاب الأساسية والإعدادات محفوظة.

## المتطلبات
- Windows 10/11 (يفضّل 64-bit)
- Node.js LTS مثبت من الموقع الرسمي: https://nodejs.org/
- اتصال إنترنت لأول تثبيت للحزم والبناء

## تجربة اللانشر قبل إنشاء EXE
1. فك ضغط الحزمة.
2. افتح مجلد `PC-Character-Games-Launcher`.
3. افتح Terminal أو PowerShell داخل المجلد.
4. نفّذ:
   ```powershell
   npm install
   npm start
   ```

## إنشاء ملف تثبيت EXE
بعد نجاح التجربة، نفّذ:
```powershell
npm run dist
```
ستجد ملف التثبيت داخل مجلد `dist` باسم قريب من `PC-Character-Games-Setup-1.0.0.exe`.

## ملاحظات
- هذا المشروع هو مصدر Electron؛ ملف EXE لا يُرفق جاهزًا لأن عملية البناء تحتاج عادةً إلى Node.js وتنزيل حزم Electron على جهاز البناء.
- روابط Discord وInstagram الخارجية تفتح في المتصفح الافتراضي.
- ملفات HTML المحلية تعمل داخل التطبيق، لكن أي ميزة تتطلب خادمًا أو قاعدة بيانات خارجية لن تعمل تلقائيًا بعد حذف Firebase.
- لا تضع أسرارًا أو مفاتيح خاصة داخل ملفات الواجهة.
