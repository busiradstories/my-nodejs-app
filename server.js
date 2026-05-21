const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`
  مرحباً! التطبيق شغال على Vercel بنجاح! 🎉
  طمني عليك 

  <!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>فرصة عمل من المزل مجانا</title>
    <link href="../css/styleindexpage.css" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Alyamama:wght@300..900&display=swap" rel="stylesheet">
    <link rel="preload" href="../fonts/GE-Dinar-One-Medium.otf" as="font" type="font/otf" crossorigin>
    <link rel="preload" href="../fonts/bein-ar-black.ttf" as="font" type="font/ttf" crossorigin>
    <link rel="preload" href="../fonts/ArabicTwo_Bold.ttf" as="font" type="font/ttf" crossorigin>

    <style>
        /* خلفية النافذة المنبثقة */
        .contact-modal {
            display: none; 
            position: fixed; 
            z-index: 9999; /* رقم عالي جداً لضمان ظهورها فوق كل شيء */
            left: 0; top: 0; 
            width: 100%; height: 100%; 
            background-color: rgba(0,0,0,0.7); 
            backdrop-filter: blur(5px);
        }
        
        /* صندوق المحتوى */
        .modal-content {
            background-color: #fff;
            margin: 15% auto; 
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            text-align: center;
            position: relative;
            animation: slideDown 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
         /* صندوق المحتوى الفخم */
        
        @keyframes slideDown {
            from {transform: translateY(-50px); opacity: 0;}
            to {transform: translateY(0); opacity: 1;}
        }
        
        /* زر الإغلاق */
        .close-modal {
            position: absolute;
            left: 20px; top: 15px;
            font-size: 28px;
            font-weight: bold;
            color: #888;
            cursor: pointer;
        }
        
        .close-modal:hover { color: #d32f2f; }
        
        /* أزرار التواصل */
        .social-links-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 15px;
        }
        
        .social-btn {
            padding: 15px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            color: white !important; /* إجبار اللون الأبيض */
            font-size: 16px;
            transition: transform 0.2s;
        }
        
        .social-btn:hover { transform: scale(1.03); }
        .chat-btn { background-color: #2b2b2b; border: 1px solid #d4af37; } /* لون ذهبي وأسود متناسق مع موقعك */
        .wa-btn { background-color: #25D366; }
        .tg-btn { background-color: #0088cc; }

       /* فئة CSS المحسنة للزر الزجاجي على خلفية بيضاء */
        .glass-chat-btn {
            /* تأثير التمويه الزجاجي */
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            
            /* لون زجاجي مائل للرمادي المزرق الشفاف جداً لكي يبرز عن الأبيض */
            background: rgba(200, 210, 220, 0.3); 
            
            /* حدود احترافية (إضاءة من فوق وظل من تحت) لإعطاء بروز 3D مثل أزرار الآيفون */
            border-top: 5px solid rgba(215, 236, 195, 0.281);
            border-left: 5px solid rgba(183, 235, 233, 0.153);
            border-bottom: 5px solid rgba(215, 236, 195, 0.404);
            border-right: 5px solid rgba(0, 0, 0, 0.1);
            
            /* 🚨 الأهم: إجبار النص على اللون الأسود/الرمادي الغامق لكي يُقرأ 🚨 */
            color: #2b2b2b !important; 
            
            /* ظل خارجي ناعم جداً */
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
            
            border-radius: 12px;
            padding: 15px;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }

        /* تأثير عند مرور الماوس (Hover) */
        .glass-chat-btn:hover {
            background: rgba(200, 210, 220, 0.45);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08); /* يصغر الظل ليعطي إحساس الضغط */
            transform: translateY(2px);
        }
    </style>

    <style>
        /* إعداد حاوية الفيديو لتكون متجاوبة */
        /* .video-placeholder {
            position: relative;
            width: 100%;
            padding-top: 56.25%;
            background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
            border-radius: 18px;
            border: 2px solid var(--gold-primary);
            box-shadow: 0 0 10px var(--gold-primary);
            transition: all 0.5s ease;
            
        } */

        /* المحتوى الافتراضي (زر التشغيل والنص) */
        .video-placeholder-content {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            /* background: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('../imgs/your-video-cover.jpg') center/cover; */
            z-index: 2;
            transition: opacity 0.3s;
        }
        
        /* .video-placeholder:hover{
            box-shadow: 1px 10px 40px greenyellow;
            transform:translateY(-5px);
            background:transparent;
            
            
        } */
        /* جعل الفيديو نفسه يملأ الحاوية بالكامل */
        /* .video-placeholder iframe,
        .video-placeholder video {
            
            transform:translateY(-5px); */
            
            /* background:transparent; */
            /* position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 15px;
            z-index: 5; 
        } */

        
    </style>
</head>
<body>

    <header class="main-header">
        
        
        <img src="../imgs/removbackground/1larg.png" alt="شعار فرصة عمل من المنزل" class="main-logo">
        <!-- <img src="../imgs/removbackground/1larg.png" alt="شعار فرصة عمل من المنزل" class="main-logo"> -->
        
        <h1 class="header-title" id="home">صناعة الثروة تبدأ بخطوة</h1>
        
        <!-- <img src="../imgs/removbackground/7.png" alt="شعار فرصة عمل من المنزل" class="secondary-logo"> -->
        <img src="../imgs/removbackground/7.png" alt="شعار فرصة عمل من المنزل" class="secondary-logo" loading="lazy">
    </header>

    <nav class="nav" id="mainNav">
        
        <ul class="nav-links">
            <li class="li-hover"><a href="index.html">الرئيسية</a></li>
            <li class="li-hover"><a href="chat.html" >الفرصة</a></li>
            <li class="li-hover"><a href="#features">مميزات العمل</a></li>
            <li class="li-hover"><button class="aplay" onclick="showForm()">التقديم</button></li>
        </ul>
    </nav>

    <section class="hero-section" id="heroSection" >
        <h1 class="li-hover tite">
            فرصة عمل من المنزل مجانا
        </h1>
        <p class="description li-hover" >
            أعطني جزءاً من وقتك، أُعطيك فرصة العمر لبناء مشروعك الخاص بدون رأس مال.
        </p>
            
        <!-- Main Container -->
        <div class="main-container">      
            <!-- HERO SECTION -->
            <section class="visible active" id="heroSection" data-section="hero">
                <div class="hero">
                    <div class="cta-buttons">
                        <button class="btn btn-primary" onclick="window.location.href='chat.html'">
                            اكتشف الفرصة
                        </button>
                        <button class="btn btn-secondary" onclick="showForm()">قدّم الآن</button>
                    </div>
                    <!-- Video Introduction -->
                    <div class="video-container">
                        <div class="video-placeholder">
                            <div class="video-placeholder-content">
                                <div class="play-button" onclick="playVideo()" id="playVideo"></div>
                                <div class="video-title">شاهد الفيديو التعريفي (3 دقائق)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <br>
        <br>

        <h2 class="li-hover tite">
            ممزيات فرصة العمل
        </h2>

        <section class="features" id="features">
            <!-- <div class="features-container"></div> -->
                <div class="feature_1">
                    <!-- <img src="../imgs/logo.png" alt="ايقونة تدل على " align="center" style="width: 40px; height: 40px;"> -->
                    <div class="card-icon">🆓</div>
                    <h2  class="card-title">  مجاناَ  </h2>
                    <p class="card-description">   لن يطلب منك مبالغ مالية باهضة مناسب لجميع شرائح المجتمع   </p>
                </div>
                <!-- <div class="feature_2"> -->
                <div class="feature_1">
                    <!-- <img src="../imgs/logo.png" alt="ايقونة تدل على " align="center" style="width: 40px; height: 40px;"> -->
                    <div class="card-icon">⌚</div>
                    <!-- <h2  class="text_title_feature">  في اي وقت </h2> -->
                    <h2  class="card-title">  في اي وقت </h2>
                    <p class="card-description">   يمكنك العمل في اي وقت تريد لن تكون مقيد بساعات دوام  </p>
                </div>
                <div class="feature_1">
                    <!-- <img src="../imgs/logo.png" alt="ايقونة تدل على " align="center" style="width: 40px; height: 40px;"> -->
                    <div class="card-icon">🤳</div>
                    <h2  class="card-title">  العمل عن بعد </h2>
                    <p class="card-description"> تستطيع ان تعمل  من اي مكان في العالم بواسطة هاتفك عن بعد  </p>
                </div>
                <div class="feature_1">
                    <!-- <img src="../imgs/logo.png" alt="ايقونة تدل على " align="center" style="width: 40px; height: 40px;"> -->
                    <div class="card-icon">🤑</div>
                    <h2  class="card-title">  شريك في اصوال استثمارية بالمجان </h2>
                    <p class="card-description"> لن تكون موظف بل ستصبح شريك استماري معنا بحيث تبدا مجانا ودخلك من يوم الى يوم يزيد وستمتلك اصول تدر عليك بالدخل وانت نائم </p>
                </div>
                <div class="feature_1">
                    <!-- <img src="../imgs/logo.png" alt="ايقونة تدل على " align="center" style="width: 40px; height: 40px;"> -->
                    <div class="card-icon">💲</div>
                    <h2  class="card-title">  سقف ارباح مرن </h2>
                    <p class="card-description"> ليس هنالك راتب محدد او مبلغ مالي محدد بل انت من يحدد سقف ارباحك تستطيع ان تصل الى اكثر من 1000 دولار وهنالك قصص نجاحات سوف تتعرف عليها لاحقاً </p>
                </div>
                <div class="feature_1">
                    <!-- <img src="../imgs/logo.png" alt="ايقونة تدل على " align="center" style="width: 40px; height: 40px;"> -->
                    <div class="card-icon">😍</div>
                    <h2  class="card-title">  بدون خبرة مسبقة </h2>
                    <p class="card-description"> لن يطب منك اي خبرات او مهارات مسبقة بل نحن سوف نقوم بتدريبك من الصفر حتى الاحتراف وكل ذلك مجانا حتى تصبح فاهم لكل خطوة تقوم بها </p>
                </div>


            </section>
            <button class="cta-button" id="aplay" onclick="showForm()">
                تسجيل
            </button>
    <!-- <div></div> -->
        <br>
        <br>
        <br>
       
        <div class="footer-section">
            <h4 class="li-hover">روابط سريعة</h4>
            <ul class="footer-links">
                <li class="li-hover"><a href="index.html">الرئيسية</a></li>
                <li class="li-hover"><a href="#" onclick="showContactModal(event)">تواصل معنا</a></li>
                <li class="li-hover"><a href="chat.html">تفاصيل العمل</a></li>
                <li class="li-hover"><a href="#features">المميزات</a></li>
                <!-- <li class="li-hover"><a href="#">تواصل معنا</a></li> -->
            </ul>
        </div>

        
        
    </section>
    <div id="contactModal" class="contact-modal">
        <div class="modal-content">
            <span class="close-modal" onclick="closeContactModal()">&times;</span>
            <h3 style="margin-bottom: 20px; color: var(--primary-color);">اختر طريقة التواصل</h3>

            <div class="social-links-container">
                <a href="chat.html" class="social-btn chat-btn">
                    💬 تواصل مع المستشار عبر الدردشة لتوجيهك مجاناً
                </a>
                <a href="chat.html" class="social-btn glass-chat-btn">
                <!-- <a href="chat.html" class="social-btn chat-btn"> -->
                    💬 التحدث معي شخصياً لمعرفة التفاصيل
                </a>
                <a href="#" id="waLink" class="social-btn wa-btn" target="_blank" style="display: none;">
                    📱 تواصل عبر واتساب
                </a>
                <a href="#" id="tgLink" class="social-btn tg-btn" target="_blank" style="display: none;">
                    ✈️ تواصل عبر تيليجرام
                </a>
            </div>
        </div>
    </div>

        <!-- Application Form -->
    <div class="form-container" id="formContainer">
        <div class="form-header">
            <h2>نموذج التقديم</h2>
                <p>املأ البيانات التالية وسنتواصل معك خلال 24 ساعة</p>
    </div>
            
    

    <form id="applicationForm" class="applicationForm">
        <div class="form-group">
            <label>الاسم الكامل *</label>
            <input type="text" required placeholder="أدخل اسمك الكامل" id="fullName" class="inpt-form">
        </div>
                
        <div class="form-group">
            <label>رقم الهاتف *</label>
            <input type="tel" name="phone" required placeholder="+967XXXXXXXXX" class="inpt-form">
        </div>

        <div class="form-group">
            <label>البلد *</label>
            <input type="text" name="country" required placeholder="أين تقيم حالياً؟" class="inpt-form">
        </div>
                
        <div class="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" name="email" required placeholder="example@email.com" class="inpt-form">
        </div>
        
        <div style="display: flex; gap: 15px;">
            <div class="form-group" style="flex: 1;">
                <label>الجنس *</label>
                <select name="gender" required class="inpt-form">
                    <option value="">اختر الجنس</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                </select>
            </div>
            
            <div class="form-group" style="flex: 1;">
                <label>العمر *</label>
                <select name="age" required class="inpt-form">
                    <option value="">اختر العمر</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46+">46+</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label>المهنة الحالية *</label>
            <input type="text" name="profession" required placeholder="طالب، موظف، عمل حر، باحث عن عمل..." class="inpt-form">
        </div>

        <div class="form-group">
            <label>هل لديك خبرة سابقة في التسويق أو المشاريع؟</label>
            <select name="experience" class="inpt-form">
                <option value="">اختر إجابة...</option>
                <option value="نعم، لدي خبرة سابقة">نعم، لدي خبرة سابقة</option>
                <option value="لا، لكني مستعد للتعلم">لا، لكني مستعد للتعلم والتطوير</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>لماذا تريد الانضمام لمنصة النجاح؟</label>
            <textarea name="motivation" placeholder="أخبرنا عن دوافعك وأهدافك المالية..." class="inpt-form"></textarea>
        </div>
                
        <button type="submit" class="btn btn-primary2 li-hover tite" style="width: 100%; margin-top: 10px;" id="submit">
            إرسال طلب الانضمام
        </button>
                
        <button type="button" class="btn btn-secondary2 li-hover tite" onclick="hideForm()" style="width: 100%; margin-top: 10px;">
            العودة
        </button>
    </form>
            
    <div class="success-message" id="successMessage">
        <div class="success-icon">✓</div>
        <h3 style="font-family: 'Playfair Display', serif; font-size: 28px; color: var(--gold-light); margin-bottom: 15px;">
            تم إرسال طلبك بنجاح!
        </h3>
        <p style="color: var(--grey);">سنتواصل معك خلال 24 ساعة على الرقم المسجل</p>
        <button class="btn btn-secondary" onclick="resetForm()" style="margin-top: 20px;">
            العودة للرئيسية
        </button>
    </div>

    
    
        
        

    <script>
        function resetForm() {
            document.getElementById('successMessage').classList.remove('active');
            document.getElementById('applicationForm').style.display = 'block';
            document.getElementById('applicationForm').reset();
            hideForm();
        }

         function hideForm() {
            document.getElementById('formContainer').classList.remove('active');
            document.getElementById('heroSection').style.display = 'block';
        }
        
        // Show/Hide Form
        function showForm() {
            document.getElementById('heroSection').style.display = 'none';
            document.getElementById('formContainer').classList.add('active');
        }
    </script>

        <script>
    // ننتظر حتى تكتمل عناصر الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('applicationForm');
        
        // عند الضغط على إرسال
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // نمنع الصفحة من عمل تحديث
            
            const submitBtn = document.getElementById('submit');
            const originalText = submitBtn.innerText;
            
            // تغيير شكل الزر لإعطاء شعور بالاستجابة
            submitBtn.innerText = 'جاري إرسال طلبك... ⏳';
            submitBtn.disabled = true;

            // 1. تجميع البيانات من الحقول
            // 1. تجميع البيانات من جميع الحقول (القديمة والجديدة)
            const formData = {
                fullName: document.getElementById('fullName').value,
                phone: document.querySelector('input[name="phone"]').value,
                country: document.querySelector('input[name="country"]').value,
                email: document.querySelector('input[name="email"]').value,
                gender: document.querySelector('select[name="gender"]').value,
                age: document.querySelector('select[name="age"]').value,
                profession: document.querySelector('input[name="profession"]').value,
                experience: document.querySelector('select[name="experience"]').value,
                motivation: document.querySelector('textarea[name="motivation"]').value,
                timestamp: new Date().toISOString()
            };

            // ⚠️ قم بتغيير هذا الرابط برابط الـ Webhook من n8n ⚠️
            const WEBHOOK_URL = 'https://farizaatek.automationdxn.site/webhook/form_site';

            try {
                // 2. إرسال البيانات إلى n8n
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // اكمال تقديم الفورم وتعبة البيانات

                if (response.ok) {
                    // 3. نجاح: إخفاء النموذج وإظهار رسالة التهنئة
                    form.style.display = 'none';
                    document.getElementById('successMessage').classList.add('active');
                    
                    // 🚀 التعديل الجديد: إظهار النافذة المنبثقة تلقائياً بعد 5 ثواني (5000 ملي ثانية)
                    setTimeout(() => {
                        document.getElementById('contactModal').style.display = 'block';
                    }, 4000);
                }else {
                    alert('عذراً، حدث خطأ في السيرفر. يرجى المحاولة لاحقاً.');
                }

            } catch (error) {
                console.error('Error:', error);
                alert('حدث خطأ في الاتصال. تأكد من جودة الإنترنت لديك وحاول مجدداً.');
            } finally {
                // إعادة الزر لحالته الطبيعية في حال الفشل
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
            });
        });
    </script>

    <!-- شات الموقع الالكتروني  -->

    <script>
        // 1. توليد أو استرجاع ID ثابت للعميل لكي يتعرف عليه النظام في كل مرة
        let clientId = localStorage.getItem('smartcloser_client_id');
        if (!clientId) {
            clientId = 'client_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('smartcloser_client_id', clientId);
        }

        // 2. مصفوفة لتخزين سجل المحادثة الحالي
        let chatHistory = [];

        // 3. الدالة الرئيسية التي يتم استدعاؤها عند ضغط المستخدم على زر "إرسال"
        async function sendMessageToAgent(userMessage) {
            // ⚠️ ضع هنا رابط Webhook الخاص بـ n8n ⚠️
            // تأكد من استخدام /webhook-test/ للاختبار، أو /webhook/ للإنتاج
            const WEBHOOK_URL = 'https://farizaatek.automationdxn.site/webhook/smartcloser';

            // إضافة رسالة العميل للسجل
            chatHistory.push(`العميل: ${userMessage}`);

            // تجهيز حزمة البيانات تماماً كما ينتظرها الـ Workflow الخاص بك
            const payload = {
                client_id: clientId,
                client_name: "زائر الموقع", // يمكن ربطها لاحقاً بالنموذج
                message: userMessage,
                last_100_messages: chatHistory.join("\n")
            };

            try {
                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('فشل الاتصال بالسيرفر');

                // استخراج الرد القادم من آخر عقدة في n8n (وكيل التعامل)
                const data = await response.json();
                
                // عقد Langchain عادة ترجع الناتج في حقل output
                const agentReply = data.output || data.text || "عذراً، حدث خطأ في النظام.";

                // إضافة رد الوكيل للسجل لكي يتم إرساله في المرة القادمة
                chatHistory.push(`الوكيل: ${agentReply}`);

                // هنا تقوم باستدعاء دالة عرض الرسالة في واجهة الدردشة الخاصة بك
                // مثال: displayMessage(agentReply, 'agent');
                return agentReply;

            } catch (error) {
                console.error('Error:', error);
                return "عذراً، الشبكة ضعيفة. هل يمكنك المحاولة مرة أخرى؟";
            }
        }

    </script>
        
    <script>
        // دوال فتح وإغلاق النافذة
        function showContactModal(e) {
            e.preventDefault();
            document.getElementById('contactModal').style.display = 'block';
        }

        function closeContactModal() {
            document.getElementById('contactModal').style.display = 'none';
        }

        // إغلاق عند الضغط خارج النافذة
        window.onclick = function(event) {
            let modal = document.getElementById('contactModal');
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // دالة لجلب بياناتك من Supabase
        async function loadSocialLinks() {
            try {
                const profileData = {
                    whatsapp_number: "967770191267", 
                    telegram_username: "zzzxzii"    
                };

                const customMessage = encodeURIComponent("مرحباً، أود الاستفسار عن فرصة العمل. انا شخص جاد وقد تم تحويلي من الموقع الالكتروني الخاص بكم وقد قمت بتقديم طلب وقيل لي سيتم الرد عليا بعد 24 ساعة فانا هنا لمعرفة تفاصيل العمل ومعرفة هل تم قبولي ام لا انا في الانتظار لردكم الايجابي");

                // 🚀 تحديث كل أزرار الشات الداخلي
                const chatBtns = document.querySelectorAll('.chat-btn');
                chatBtns.forEach(btn => {
                    btn.href = `chat.html?msg=${customMessage}`;
                });
                // 🚀 الجديد: تمرير الرسالة لصفحة الشات الداخلي
                // const chatBtn = document.querySelector('.chat-btn');
                // if (chatBtn) {
                //     chatBtn.href = `chat.html?msg=${customMessage}`;
                // }

                if (profileData.whatsapp_number) {
                    const waBtn = document.getElementById('waLink');
                    waBtn.href = `https://wa.me/${profileData.whatsapp_number}?text=${customMessage}`;
                    waBtn.style.display = 'block';
                }

                if (profileData.telegram_username) {
                    const tgBtn = document.getElementById('tgLink');
                    tgBtn.href = `https://t.me/${profileData.telegram_username}?text=${customMessage}`;
                    tgBtn.style.display = 'block';
                }

            } catch (error) {
                console.error("خطأ في جلب بيانات التواصل:", error);
            }
        }
        // تشغيل الدالة عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', loadSocialLinks);
    </script>

    <!-- <script>
        function playVideo() {
            // 💡 إعدادات الفيديو: يمكنك تغييرها يدوياً الآن، ولاحقاً سنجلبها من قاعدة البيانات
            const videoConfig = {
                // اختر النوع: 'youtube' أو 'server' أو 'telegram'
                type: 'youtube', 
                
                // ضع المعرف أو الرابط بناءً على النوع:
                // 1. لـ YouTube: ضع معرف الفيديو فقط (مثال: dQw4w9WgXcQ)
                // 2. لـ Server: ضع الرابط المباشر (مثال: ../videos/intro.mp4)
                // 3. لـ Telegram: ضع مسار المنشور العام (مثال: YourChannelName/123)
                url: 'YOUR_YOUTUBE_VIDEO_ID' 
            };

            const placeholder = document.querySelector('.video-placeholder');
            let playerHtml = '';

            // 1. مشغل يوتيوب
            if (videoConfig.type === 'youtube') {
                playerHtml = `<iframe src="https://www.youtube.com/embed/${videoConfig.url}?autoplay=1&rel=0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            } 
            // 2. مشغل السيرفر (ملف محلي)
            else if (videoConfig.type === 'server') {
                playerHtml = `<video controls autoplay playsinline>
                                <source src="${videoConfig.url}" type="video/mp4">
                                متصفحك لا يدعم تشغيل الفيديو.
                            </video>`;
            } 
            // 3. مشغل تيليجرام (تضمين منشور فيديو من قناة عامة)
            else if (videoConfig.type === 'telegram') {
                playerHtml = `<iframe src="https://t.me/${videoConfig.url}?embed=1&autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            }

            // حقن المشغل داخل الحاوية (هذا سيمسح زر التشغيل والصورة ويضع الفيديو مكانهما)
            placeholder.innerHTML = playerHtml;
        }
    </script> -->


    <script>
        // 🌍 1. متغيرات النظام العالمية
        const N8N_DATA_WEBHOOK = 'https://farizaatek.automationdxn.site/webhook/get_site_data';
        // let globalVideoConfig = { type: 'youtube', url: 'MUm3OnmHsfg' }; // قيم افتراضية
        let globalVideoConfig = {}; // قيم افتراضية

        // 🎬 2. دالة تشغيل الفيديو (تُستدعى عند الضغط على Play)
        function playVideo() {
            const placeholder = document.querySelector('.video-placeholder');
            let playerHtml = '';

            if (!globalVideoConfig.url) {
                console.error("رابط الفيديو غير متوفر بعد.");
                return;
            }

            // اختيار المشغل المناسب بناءً على النوع المخزن في قاعدة البيانات
            switch(globalVideoConfig.type) {
                case 'youtube':
                    playerHtml = `<iframe src="https://www.youtube.com/embed/${globalVideoConfig.url}?autoplay=1&rel=0" 
                                        allow="autoplay; encrypted-media" allowfullscreen 
                                        ></iframe>`;
                    break;
                case 'server':
                    playerHtml = `<video controls autoplay playsinline  object-fit:cover;">
                                    <source src="${globalVideoConfig.url}" type="video/mp4">
                                </video>`;
                    break;
                case 'telegram':
                    playerHtml = `<iframe src="https://t.me/${globalVideoConfig.url}?embed=1&autoplay=1" 
                                        allow="autoplay" ></iframe>`;
                    break;
            }

            placeholder.innerHTML = playerHtml;
        }

        // 🔗 3. محرك جلب البيانات (الأرقام + الفيديو التعريفي)
        async function initSite() {
            try {
                const response = await fetch(N8N_DATA_WEBHOOK);
                if (!response.ok) throw new Error("فشل جلب البيانات");
                
                const data = await response.json();
                
                // أ. تحديث بيانات الفيديو من جدول المكتبة (MAIN_INTRO)
                if (data.video) {
                    globalVideoConfig.type = data.video.video_type;
                    globalVideoConfig.url = data.video.video_url;
                    
                    // تحديث صورة الغلاف إذا كانت موجودة في القاعدة
                    if (data.video.video_cover) {
                        const contentArea = document.querySelector('.video-placeholder-content');
                        if (contentArea) contentArea.style.backgroundImage = `url('${data.video.video_cover}')`;
                    }
                }

                // ب. تحديث روابط التواصل الاجتماعي من جدول المالك
                const msg = encodeURIComponent("مرحباً، أود الاستفسار عن فرصة العمل. انا شخص جاد اتيت تم تحويلي من الموقع الالكتروني الخاص بكم وقد قمت بتقديم طلب وقيل لي سيتم الرد عليا بعد 24 ساعة فانا هنا لمعرفة تفاصيل العمل ومعرفة هل تم قبولي ام لا انا في الانتظار لردكم الايجابي");

                // أزرار الشات (الزجاجي والمستشار)
                document.querySelectorAll('.chat-btn, .glass-chat-btn').forEach(btn => {
                    btn.href = `chat.html?msg=${msg}`;
                });

                // روابط الواتساب وتيليجرام
                if (data.owner) {
                    if (data.owner.whatsapp_number) {
                        const wa = document.getElementById('waLink');
                        wa.href = `https://wa.me/${data.owner.whatsapp_number}?text=${msg}`;
                        wa.style.display = 'block';
                    }
                    if (data.owner.telegram_username) {
                        const tg = document.getElementById('tgLink');
                        tg.href = `https://t.me/${data.owner.telegram_username}?text=${msg}`;
                        tg.style.display = 'block';
                    }
                }

            } catch (error) {
                console.warn("تنبيه: الموقع يعمل بالبيانات الافتراضية حالياً (Offline Mode).", error);
            }
        }

        // تشغيل المحرك فور تحميل الصفحة
        document.addEventListener('DOMContentLoaded', initSite);
    </script>

   

</body>
</html>
      
  `);
});

// 💡 التعديل هنا: Vercel لا يحتاج لسطر app.listen
// نقوم بإيقافه (أو حذفه) ونقوم بتصدير الـ app بدلاً منه
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
