
/* --- البداية ---
===================*/
import multer from 'multer';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import { CENTRAL_SUPABASE_KEY, CENTRAL_SUPABASE_URL, getTenantsFromSubapase, listTentans} from './module/users.js';


// ==========================================
// 🧠 الاتصال بقاعدة البيانات المركزية 
// ==========================================
// ( روابط قاعدة البيانات التي أنشأنا فيها جدول tenants)

const centralDb = createClient(CENTRAL_SUPABASE_URL || 'https://avtaqerpxytgcwvpseev.supabase.co' , CENTRAL_SUPABASE_KEY || 'sb_secret_HrM5x4_pPS0UZAubF0hXgg_1BnUR6V0');


// مخزن للاتصالات النشطة (Cache)

// 1. هيكل الكاش: يخزن العميل + وقت الإنشاء
const dbCache = new Map(); 

const CACHE_TTL = 24 * 60 * 60 * 1000; // وقت الحياة: يوم كامل 24 ساعة  دقيقة بالملي ثانية


/*--- دالة اتصال لكل عميل بقاعدة بياناته ---
=========================================== */
async function clientDb(url, key) {
    const now = Date.now();

    try{
        // التحقق من وجود الكاش وصلاحيته
        if (dbCache.has(url)) {
                const cached = dbCache.get(url);
                if (now - cached.timestamp < CACHE_TTL) {
                console.log("⚡ جلب الاتصال من الـ Cache (صالح)");
                return cached.client;
                } else {
                console.log("⏳ الاتصال انتهت صلاحيته، سيتم التجديد");
                dbCache.delete(url); // مسح المنتهي
                }
        }

        // إنشاء اتصال جديد
        console.log("🆕 إنشاء اتصال جديد");
        const client = createClient(url, key);
        
        // تخزين العميل مع طابع زمني
        dbCache.set(url, {
                client: client,
                timestamp: now
        });
    
        return await client;

    }catch(error){
        console.log('حدث خطا في الاتصال باقعدة بيانات العميل ❌');
    }
}

// 2. دالة المسح عند التحديث (يجب استدعاؤها عند تعديل بيانات العميل في المركزية)
function invalidateClientCache(url) {
    if (dbCache.has(url)) {
        dbCache.delete(url);
        console.log(`🧹 تم مسح الكاش للرابط: ${url}`);
    }
}


/*-- الحصول على البيانات من جدول المالكين --- */
async function setupSystem() {
    // 1. انتظر البيانات
    const data = await listTentans();
    
    // 2. إذا كنت تريد إرجاع كائن يحتوي على المصفوفة
    return {
        allTenants: data
    };
}

// 3. استدعاء الدالة بشكل صحيح باستخدام await
async function run() {
    const userslist = await setupSystem();
    console.log(userslist); // الآن ستظهر البيانات بشكل صحيح!
}

run();


const app = express();

// السماح للمواقع بالاتصال بهذا السيرفر
app.use(cors());
app.use(express.json());


// ==========================================
// 1️⃣ مسار جلب بيانات الموقع (الفيديو وأرقام التواصل)
// مسار يطابق: N8N_DATA_WEBHOOK في index.html
// ==========================================
app.get('/webhook/get_site_data', async (req, res) => {
    const domain = req.query.domain;
    if (!domain) return res.status(400).json({ error: "الدومين مطلوب" });

    try {
        // 1. جلب مفاتيح العميل من المركزية
        const { data: tenant, error: tenantErr } = await centralDb
            .from('tenants')
            .select('supabase_url, supabase_key')
            .eq('full_domain', domain)
            .single();

        if (tenantErr || !tenant) return res.status(404).json({ error: "الدومين غير مسجل" });

        // 2. الاتصال بقاعدة بيانات العميل
        const clientDbConnection = await clientDb(tenant.supabase_url, tenant.supabase_key);

        // 3. جلب بيانات الفيديو + بيانات المالك (في استعلام واحد إذا أردت أو استعلامين)
        // جلب الفيديو:
        const { data: videoData } = await clientDbConnection
            .from('system_video_library')
            .select('*')
            .eq('video_code', 'MAIN_INTRO')
            .single();

        // جلب بيانات المالك:
        const { data: ownerData } = await clientDbConnection
            .from('system_owner_profile')
            .select('whatsapp_number, telegram_username')
            .single();

        // 4. إرسال البيانات المجمعة للواجهة
        res.json({
            video: videoData || {},
            owner: ownerData || {}
        });

    } catch (err) {
        res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات الموقع" });
    }
});


// ==========================================
// 3️⃣ مسار ارسال الرسالة الى n8n بروفايل الشات (الصورة والاسم)
// مسار يطابق: PROFILE_WEBHOOK في chat.html
// ==========================================
app.post('/webhook/smartcloser', async (req, res) => {
    const clientData = req.body;
    const domain = req.headers['host']; 

    try {
        // 1+2 جلب بيانات الاتصال (URLs/Keys) من المركزية
        const { data: tenant, error: tenantErr } = await centralDb
            .from('tenants')
            .select('supabase_url, supabase_key')
            .eq('full_domain', domain)
            .single();

        // اذا كان النطق غير مسجل نرد خطا للصفحة 3
        if (tenantErr || !tenant) return res.status(404).json({ error: "عذرا لا يوجد صفحة بهذا الرابط" });

        // 4. بناء اتصال ديناميكي بقاعدة بيانات العميل الخاصة
        const getClientDb = await clientDb(tenant.supabase_url, tenant.supabase_key);

        // 5. جلب بيانات المالك من قاعدة بياناته الخاصة (وليس من المركزية)
        const { data: ownerProfile, error: profileErr } = await    getClientDb
            .from('system_owner_profile')
            .select('*')
            .single();

        if (profileErr) return res.status(500).json({ error: "تعذر الوصول لبيانات المالك الخاصة" });

        // 6. تكوين الطلب (Payload) الشامل
        const payloadToN8n = {
            ...clientData,
            owner_credentials: {
                url: tenant.supabase_url,
                key: tenant.supabase_key,
                profile: ownerProfile // البيانات الحقيقية من قاعدة العميل
            }
        };

        // 7. إرسال الطلب إلى n8n
        // const n8nResponse = await fetch('YOUR_N8N_WEBHOOK_URL', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(payloadToN8n)
        // });

        // في سيرفرك (server.js):
        const n8nResponse = await fetch('https://farizaatek.automationdxn.site/webhook/smartcloser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToN8n) // الحزمة الكاملة التي جهزناها
        });

        const result = await n8nResponse.json();
        res.json(result);

    } catch (err) {
        console.error("خطأ كارثي:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// ==========================================
// 2️⃣ مسار جلب بروفايل الشات (الصورة والاسم)
// مسار يطابق: PROFILE_WEBHOOK في chat.html
// ==========================================
app.get('/webhook/get_profile', async (req, res) => {
    const domain = req.query.domain;
    if (!domain) return res.status(400).json({ error: "الدومين مفقود" });

    try {
        // 1. نجلب مفاتيح العميل من المركزية
        const { data: tenant, error: tenantErr } = await centralDb
            .from('tenants').select('supabase_url, supabase_key').eq('full_domain', domain).single();

        if (tenantErr || !tenant) return res.status(404).json({ error: "هذا العميل غير مسجل" });

        // 2. نتصل بقاعدة العميل
        const connection = await clientDb(tenant.supabase_url, tenant.supabase_key);
        if(!connection) return res.status(500).json({ error: "فشل الاتصال بقاعدة العميل" });

        // 3. نجلب بروفايله من قاعدته الخاصة
        const { data, error } = await connection
            .from('system_owner_profile').select('full_name, avatar_url, gender').single();

        if (error || !data) return res.status(404).json({ error: "البروفايل غير مكتمل" });

        res.json({
            full_name: data.full_name, // ✅ تصحيح اسم العمود
            avatar_url: data.avatar_url,
            gender: data.gender
        });
        
    } catch (err) {
        res.status(500).json({ error: "حدث خطأ في النظام" });
    }
});


// ==========================================
//  مسار استقبال الفورم (طلبات الانضمام)
// ==========================================
app.post('/webhook/form_site', async (req, res) => {
    const formData = req.body;
    const domain = formData.tenant_domain;

    console.log(`📩 وصل طلب انضمام جديد لدومين: ${domain}`);

    try {
        // 1. جلب مفاتيح العميل من القاعدة المركزية
        const { data: tenant, error: tenantErr } = await centralDb
            .from('tenants')
            .select('supabase_url, supabase_key')
            .eq('full_domain', domain)
            .single();

        if (tenantErr || !tenant) {
            console.error("العميل غير مسجل:", domain);
            return res.status(404).json({ error: "النطاق غير مسجل" });
        }

        // 2. الاتصال بقاعدة بيانات العميل (لتخزين البيانات في جدوله الخاص)
        const connection = await clientDb(tenant.supabase_url, tenant.supabase_key);
        
        if(!connection) {
            return res.status(500).json({ error: "فشل الاتصال بقاعدة العميل" });
        }

        // 3. إدخال البيانات في جدول partners_leads مع مطابقة أسماء الأعمدة في الصور
        const { error: insertError } = await connection
            .from('partners_leads')
            .insert([
                {
                    full_name: formData.fullName,
                    phone: formData.phone,
                    country: formData.country,
                    email: formData.email,
                    gender: formData.gender,
                    age_group: formData.age, // تم ربط age من الفورم بـ age_group في القاعدة
                    profession: formData.profession,
                    experience: formData.experience,
                    motivation: formData.motivation,
                    status: 'جديد',               // قيم افتراضية مبدئية كما في القاعدة
                    contact_method: 'لم يتم بعد',   // قيم افتراضية مبدئية
                    client_response: 'في الانتظار'  // قيم افتراضية مبدئية
                }
            ]);

        if (insertError) {
            console.error("خطأ في إدخال البيانات:", insertError);
            return res.status(500).json({ error: "فشل حفظ البيانات في قاعدة العميل" });
        }

        // 4. نرد على الفورم بنجاح لكي تظهر للمستخدم رسالة (تم التقديم بنجاح)
        res.status(200).json({ success: true, message: "تم الاستلام والحفظ بنجاح" });

    } catch (err) {
        console.error("خطأ عام في مسار الفورم:", err);
        res.status(500).json({ error: "خطأ داخلي في السيرفر" });
    }
});


// ==========================================
// تشغيل السيرفر (متوافق مع Vercel و VPS)
// ==========================================
app.get('/', (req, res) => {
    res.send('🚀 سيرفر منصة النجاح (SaaS API) يعمل بكفاءة!');
});

// إذا كنت تستخدم Vercel فهذا السطر ضروري
// module.exports = app;

// إذا كنت تستخدم VPS، الغي التعليق عن السطرين بالأسفل
// const PORT = process.env.PORT || 3000;
// app.listen(3000 , () => console.log(`Server running on port ${3000}`));

export default app;



