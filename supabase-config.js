// تهيئة Supabase
const SUPABASE_URL = 'https://pzmwdrqgcwwugacezjev.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_JfD0ktwYbNcXU6tXSZvV4w_o_5xjsIv';

// إنشاء عميل Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// اختبار الاتصال
async function testConnection() {
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1);
        if (error) throw error;
        console.log('✅ الاتصال بـ Supabase ناجح!');
        return true;
    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
        return false;
    }
}

// دالة لجلب جميع المنتجات
async function getAllProducts() {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        return [];
    }
}

// دالة لجلب منتجات قسم معين
async function getProductsByCategory(category) {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category);
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('خطأ في جلب منتجات القسم:', error);
        return [];
    }
}

// دالة لإضافة منتج جديد
async function addNewProduct(productData) {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                category: productData.category,
                name: productData.name,
                description: productData.description,
                price: productData.price || 0,
                product_link: productData.link || '',
                images: productData.images || [],
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('خطأ في إضافة المنتج:', error);
        return { success: false, error: error.message };
    }
}

// دالة لتحديث منتج
async function updateProduct(productId, updates) {
    try {
        const { data, error } = await supabase
            .from('products')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', productId)
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('خطأ في تحديث المنتج:', error);
        return { success: false, error: error.message };
    }
}

// دالة لحذف منتج
async function deleteProduct(productId) {
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('خطأ في حذف المنتج:', error);
        return { success: false, error: error.message };
    }
}

// دالة لجلب الإعلانات
async function getActiveAd() {
    try {
        const { data, error } = await supabase
            .from('ads')
            .select('ad_code')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1);
        
        if (error) throw error;
        return data[0]?.ad_code || '';
    } catch (error) {
        console.error('خطأ في جلب الإعلان:', error);
        return '';
    }
}

// دالة لتحديث/إضافة إعلان
async function updateAd(adCode) {
    try {
        // أولاً، نعطل جميع الإعلانات القديمة
        await supabase
            .from('ads')
            .update({ is_active: false })
            .eq('is_active', true);
        
        // ثم نضيف الإعلان الجديد
        const { data, error } = await supabase
            .from('ads')
            .insert([{
                ad_code: adCode,
                ad_type: 'banner',
                is_active: true
            }])
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('خطأ في تحديث الإعلان:', error);
        return { success: false, error: error.message };
    }
}

// دالة لجلب إعدادات الموقع
async function getSiteSettings() {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .eq('id', 1)
            .single();
        
        if (error) throw error;
        return data || { admin_email: '', admin_phone: '' };
    } catch (error) {
        console.error('خطأ في جلب الإعدادات:', error);
        return { admin_email: '', admin_phone: '' };
    }
}

// دالة لتحديث إعدادات الموقع
async function updateSiteSettings(email, phone) {
    try {
        const { data, error } = await supabase
            .from('settings')
            .update({
                admin_email: email,
                admin_phone: phone,
                updated_at: new Date().toISOString()
            })
            .eq('id', 1)
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('خطأ في تحديث الإعدادات:', error);
        return { success: false, error: error.message };
    }
}

// دالة للتحقق من كلمة مرور المسؤول
async function verifyAdminPassword(password) {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('admin_password')
            .eq('id', 1)
            .single();
        
        if (error) throw error;
        return password === data.admin_password;
    } catch (error) {
        console.error('خطأ في التحقق من كلمة المرور:', error);
        return false;
    }
}

// دالة لتغيير كلمة مرور المسؤول
async function changeAdminPassword(newPassword) {
    try {
        const { data, error } = await supabase
            .from('settings')
            .update({
                admin_password: newPassword,
                updated_at: new Date().toISOString()
            })
            .eq('id', 1)
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('خطأ في تغيير كلمة المرور:', error);
        return { success: false, error: error.message };
    }
}

// دالة لإنشاء طلب جديد
async function createNewOrder(orderData) {
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([{
                product_id: orderData.productId,
                customer_email: orderData.email,
                customer_phone: orderData.phone,
                amount: orderData.amount,
                status: 'pending',
                payment_id: orderData.paymentId || '',
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('خطأ في إنشاء الطلب:', error);
        return { success: false, error: error.message };
    }
}

// تصدير الدوال للاستخدام في الملفات الأخرى
window.supabaseFunctions = {
    testConnection,
    getAllProducts,
    getProductsByCategory,
    addNewProduct,
    updateProduct,
    deleteProduct,
    getActiveAd,
    updateAd,
    getSiteSettings,
    updateSiteSettings,
    verifyAdminPassword,
    changeAdminPassword,
    createNewOrder,
    supabase // العميل نفسه للاستخدام المباشر إذا لزم
};
