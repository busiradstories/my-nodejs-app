const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
  مرحباً! التطبيق شغال على Vercel بنجاح! 🎉
  طمني عليك 
  `);
});

// 💡 التعديل هنا: Vercel لا يحتاج لسطر app.listen
// نقوم بإيقافه (أو حذفه) ونقوم بتصدير الـ app بدلاً منه
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
