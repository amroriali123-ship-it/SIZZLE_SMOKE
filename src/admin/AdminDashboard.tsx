import React, { useState, useEffect } from 'react';
import { api, ApiMenuItem, ApiCategory, ApiSiteSettings, ApiStats, AdminUser } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Flame,
  LayoutDashboard,
  Utensils,
  FolderTree,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  Upload,
  RefreshCw,
  AlertCircle,
  Save,
  Languages,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onViewSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout, onViewSite }) => {
  const { language, toggleLanguage, isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'categories' | 'settings'>('menu');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ApiStats | null>(null);
  const [menuItems, setMenuItems] = useState<ApiMenuItem[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [settings, setSettings] = useState<ApiSiteSettings | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter state for menu
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');

  // Modals state
  const [editingItem, setEditingItem] = useState<Partial<ApiMenuItem> | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ApiMenuItem | null>(null);

  // Category Modal state
  const [editingCategory, setEditingCategory] = useState<Partial<ApiCategory> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ApiCategory | null>(null);

  // Form uploading state
  const [uploadingImage, setUploadingImage] = useState(false);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes, setRes, statsRes] = await Promise.all([
        api.getAdminMenu(),
        api.getAdminCategories(),
        api.getAdminSettings(),
        api.getStats(),
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
      setSettings(setRes.data);
      setStats(statsRes);
    } catch (err: any) {
      showNotification(err.message || 'Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Menu item handlers
  const handleOpenAddModal = () => {
    setEditingItem({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      price_sar: 35,
      price_usd: 9.35,
      category: categories[0]?.id || 'cat-burgers',
      imageUrl: '/src/assets/images/hero_gourmet_smash_burger_1791416652236.jpg',
      ingredients_en: ['Fresh Brioche', 'Angus Beef', 'Cheese'],
      ingredients_ar: ['خبز بريوش', 'لحم أنجوس', 'جبنة'],
      isAvailable: true,
      isFeatured: false,
      calories: 650,
      prepTime: '6-8',
      spiceLevel: 1,
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item: ApiMenuItem) => {
    setEditingItem({ ...item });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      if (editingItem.id) {
        await api.updateMenuItem(editingItem.id, editingItem);
        showNotification(language === 'ar' ? 'تم تحديث الوجبة بنجاح!' : 'Menu item updated successfully!');
      } else {
        await api.createMenuItem(editingItem);
        showNotification(language === 'ar' ? 'تمت إضافة الوجبة الجديدة!' : 'New menu item created successfully!');
      }
      setIsItemModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error saving item', 'error');
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    try {
      await api.deleteMenuItem(itemToDelete.id);
      showNotification(language === 'ar' ? 'تم حذف الوجبة بنجاح.' : 'Menu item deleted.');
      setItemToDelete(null);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete item', 'error');
    }
  };

  const handleToggleAvailable = async (item: ApiMenuItem) => {
    try {
      await api.toggleAvailable(item.id);
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i))
      );
      showNotification(
        language === 'ar'
          ? `تم تحديث توفر ${item.name_ar}`
          : `Availability updated for ${item.name_en}`
      );
    } catch (err: any) {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleToggleFeatured = async (item: ApiMenuItem) => {
    try {
      await api.toggleFeatured(item.id);
      setMenuItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, isFeatured: !i.isFeatured } : i))
      );
      showNotification(
        language === 'ar'
          ? `تم تحديث تمييز ${item.name_ar}`
          : `Featured status updated for ${item.name_en}`
      );
    } catch (err: any) {
      showNotification('Failed to update status', 'error');
    }
  };

  // Image upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setEditingItem((prev) => (prev ? { ...prev, imageUrl: res.imageUrl } : null));
      showNotification(language === 'ar' ? 'تم رفع الصورة بنجاح!' : 'Image uploaded successfully!');
    } catch (err: any) {
      showNotification(err.message || 'Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Category handlers
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      if (editingCategory.id) {
        await api.updateCategory(editingCategory.id, editingCategory);
        showNotification(language === 'ar' ? 'تم تحديث التصنيف!' : 'Category updated!');
      } else {
        await api.createCategory(editingCategory);
        showNotification(language === 'ar' ? 'تمت إضافة التصنيف الجديد!' : 'Category created!');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Error saving category', 'error');
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await api.deleteCategory(categoryToDelete.id);
      showNotification(language === 'ar' ? 'تم حذف التصنيف.' : 'Category deleted.');
      setCategoryToDelete(null);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete category', 'error');
    }
  };

  // Settings handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await api.updateAdminSettings(settings);
      showNotification(language === 'ar' ? 'تم حفظ إعدادات الموقع!' : 'Site settings updated!');
    } catch (err: any) {
      showNotification(err.message || 'Failed to update settings', 'error');
    }
  };

  // Reset database to seed
  const handleResetSeed = async () => {
    if (!window.confirm(language === 'ar' ? 'هل تريد استعادة البيانات الافتراضية؟ سيتم مسح التغييرات.' : 'Reset database to default seed data? All custom edits will be reverted.')) {
      return;
    }
    try {
      await api.resetSeedData();
      showNotification(language === 'ar' ? 'تمت استعادة البيانات الافتراضية!' : 'Seed data restored!');
      loadData();
    } catch (err: any) {
      showNotification('Failed to reset', 'error');
    }
  };

  // Filtered menu items
  const filteredItems = menuItems.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterAvailability === 'available' && !item.isAvailable) return false;
    if (filterAvailability === 'unavailable' && item.isAvailable) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.name_en.toLowerCase().includes(q) ||
        item.name_ar.toLowerCase().includes(q) ||
        item.description_en.toLowerCase().includes(q) ||
        item.description_ar.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight uppercase leading-none block">
                  SIZZLE & SMOKE
                </span>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                  {language === 'ar' ? 'لوحة تحكم المشرف' : 'ADMIN CONTROL PANEL'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
              >
                <Languages className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              <button
                type="button"
                onClick={onViewSite}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">{language === 'ar' ? 'الموقع العام' : 'Public Site'}</span>
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-red-50 hover:text-red-600 text-stone-700 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ar' ? 'خروج' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {message && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-medium flex items-center gap-2.5 ${
              message.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-4 mb-6 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{language === 'ar' ? 'نظرة عامة وإحصائيات' : 'Overview & Stats'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>{language === 'ar' ? 'إدارة وجبات القائمة' : 'Menu Items'}</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-mono">
              {menuItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>{language === 'ar' ? 'التصنيفات' : 'Categories'}</span>
            <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded-full font-mono">
              {categories.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>{language === 'ar' ? 'إعدادات الموقع والتواصل' : 'Site Settings'}</span>
          </button>

          <div className="mr-auto rtl:mr-0 rtl:ml-auto">
            <button
              type="button"
              onClick={handleResetSeed}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 cursor-pointer"
              title="Reset to default seed data"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden md:inline">{language === 'ar' ? 'استعادة البيانات التجريبية' : 'Reset Seed Data'}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'إجمالي الوجبات' : 'Total Items'}
                </span>
                <span className="text-3xl font-black text-stone-900 font-display tabular-nums">
                  {menuItems.length}
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'الوجبات المتاحة للطلب' : 'Available Items'}
                </span>
                <span className="text-3xl font-black text-emerald-600 font-display tabular-nums">
                  {menuItems.filter((i) => i.isAvailable).length}
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'الوجبات المميزة / العروض' : 'Featured Items'}
                </span>
                <span className="text-3xl font-black text-amber-600 font-display tabular-nums">
                  {menuItems.filter((i) => i.isFeatured).length}
                </span>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                  {language === 'ar' ? 'التصنيفات' : 'Categories'}
                </span>
                <span className="text-3xl font-black text-stone-900 font-display tabular-nums">
                  {categories.length}
                </span>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                {language === 'ar' ? 'معلومات الخادم والاتصال' : 'Backend & Connectivity Status'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {language === 'ar'
                  ? 'الخادم يعمل حالياً بتقنية Node.js + Express REST API. يمكنك إدارة كافة الوجبات والتصنيفات ديناميكياً من هذه اللوحة، ويتم تحديث الموقع فورياً.'
                  : 'Backend is active with Express REST API. All menu items and categories are dynamically managed here and immediately reflected on the public site.'}
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-medium border border-emerald-200">
                  REST API: /api/menu
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 font-mono font-medium border border-stone-200">
                  Auth: JWT (Bearer)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 font-mono font-medium border border-amber-200">
                  Admin: {currentUser.email}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU ITEMS (CRUD) */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث بالاسم العربي أو الإنجليزي...' : 'Search by English or Arabic name...'}
                  className="w-full pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Filters & Add Button */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">{language === 'ar' ? 'كل التصنيفات' : 'All Categories'}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'ar' ? c.name_ar : c.name_en}
                    </option>
                  ))}
                </select>

                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value as any)}
                  className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">{language === 'ar' ? 'الحالة: الكل' : 'Status: All'}</option>
                  <option value="available">{language === 'ar' ? 'المتوفر فقط' : 'Available Only'}</option>
                  <option value="unavailable">{language === 'ar' ? 'غير المتوفر' : 'Unavailable'}</option>
                </select>

                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-sm shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إضافة وجبة جديدة' : 'Add New Item'}</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table / Grid */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs text-stone-700">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3.5 text-start">{language === 'ar' ? 'الوجبة والصورة' : 'Item & Image'}</th>
                      <th className="px-4 py-3.5 text-start">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                      <th className="px-4 py-3.5 text-start">{language === 'ar' ? 'السعر (ر.س / $)' : 'Price'}</th>
                      <th className="px-4 py-3.5 text-center">{language === 'ar' ? 'التوفر' : 'Availability'}</th>
                      <th className="px-4 py-3.5 text-center">{language === 'ar' ? 'مميز' : 'Featured'}</th>
                      <th className="px-4 py-3.5 text-end">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-stone-400">
                          {language === 'ar' ? 'لا توجد وجبات مطابقة للبحث' : 'No menu items found'}
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => {
                        const cat = categories.find((c) => c.id === item.category);
                        return (
                          <tr key={item.id} className="hover:bg-stone-50/60 transition-colors">
                            {/* Title & Image */}
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.imageUrl}
                                  alt={item.name_en}
                                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                                />
                                <div>
                                  <div className="font-bold text-stone-900 text-sm">
                                    {language === 'ar' ? item.name_ar : item.name_en}
                                  </div>
                                  <div className="text-[11px] text-stone-500">
                                    {language === 'ar' ? item.name_en : item.name_ar}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-4 py-3.5">
                              <span className="font-medium text-stone-700">
                                {cat ? (language === 'ar' ? cat.name_ar : cat.name_en) : item.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="px-4 py-3.5 font-mono tabular-nums">
                              <div className="font-bold text-amber-600">{item.price_sar} SAR</div>
                              <div className="text-[10px] text-stone-400">${item.price_usd}</div>
                            </td>

                            {/* Availability Toggle */}
                            <td className="px-4 py-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleAvailable(item)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                                  item.isAvailable
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200'
                                }`}
                              >
                                {item.isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                <span>{item.isAvailable ? (language === 'ar' ? 'متوفر' : 'Active') : (language === 'ar' ? 'غير متوفر' : 'Hidden')}</span>
                              </button>
                            </td>

                            {/* Featured Toggle */}
                            <td className="px-4 py-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleFeatured(item)}
                                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                  item.isFeatured
                                    ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                    : 'text-stone-300 hover:text-stone-500'
                                }`}
                                title="Toggle Featured"
                              >
                                <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-amber-400' : ''}`} />
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3.5 text-end">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(item)}
                                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-800 text-stone-600 transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setItemToDelete(item)}
                                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-100 hover:text-red-700 text-stone-600 transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {language === 'ar' ? 'تصنيفات قائمة الطعام' : 'Menu Categories'}
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'ar' ? 'أضف وعدل تصنيفات الوجبات وترتيب ظهورها' : 'Manage categories and custom display order'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCategory({ name_en: '', name_ar: '', sortOrder: categories.length + 1 });
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'ar' ? 'إضافة تصنيف' : 'Add Category'}</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
              <table className="w-full text-start text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3.5 text-start">{language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}</th>
                    <th className="px-4 py-3.5 text-start">{language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}</th>
                    <th className="px-4 py-3.5 text-center">{language === 'ar' ? 'الترتيب' : 'Sort Order'}</th>
                    <th className="px-4 py-3.5 text-end">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-stone-50/60">
                      <td className="px-4 py-3.5 font-bold text-stone-900">{cat.name_en}</td>
                      <td className="px-4 py-3.5 font-bold text-stone-900">{cat.name_ar}</td>
                      <td className="px-4 py-3.5 text-center font-mono">{cat.sortOrder}</td>
                      <td className="px-4 py-3.5 text-end">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCategory(cat);
                              setIsCategoryModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-800 text-stone-600 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-red-100 hover:text-red-700 text-stone-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SITE SETTINGS */}
        {activeTab === 'settings' && settings && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs max-w-3xl">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              {language === 'ar' ? 'إعدادات المطعم وبيانات التواصل' : 'Restaurant & Contact Settings'}
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              {language === 'ar' ? 'تعديل أرقام الهواتف، العناوين الثنائية، وساعات العمل وروابط التواصل' : 'Edit phone, bilingual addresses, opening hours, and social media'}
            </p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'رقم الهاتف المباشر' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'البريد الإلكتروني الرسمي' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ar' ? 'العنوان بالعربية' : 'Address (Arabic)'}
                </label>
                <input
                  type="text"
                  value={settings.address_ar}
                  onChange={(e) => setSettings({ ...settings, address_ar: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ar' ? 'العنوان بالإنجليزية' : 'Address (English)'}
                </label>
                <input
                  type="text"
                  value={settings.address_en}
                  onChange={(e) => setSettings({ ...settings, address_en: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'ساعات العمل بالعربية' : 'Opening Hours (Arabic)'}
                  </label>
                  <input
                    type="text"
                    value={settings.openingHours_ar}
                    onChange={(e) => setSettings({ ...settings, openingHours_ar: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'ساعات العمل بالإنجليزية' : 'Opening Hours (English)'}
                  </label>
                  <input
                    type="text"
                    value={settings.openingHours_en}
                    onChange={(e) => setSettings({ ...settings, openingHours_en: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حفظ التعديلات' : 'Save Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {isItemModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <h3 className="text-xl font-bold text-stone-900">
                {editingItem.id
                  ? (language === 'ar' ? 'تعديل بيانات الوجبة' : 'Edit Menu Item')
                  : (language === 'ar' ? 'إضافة وجبة جديدة' : 'Add New Menu Item')}
              </h3>
              <button
                type="button"
                onClick={() => setIsItemModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Bilingual Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'الاسم بالإنجليزية (Name EN)' : 'Name (English)'} *
                  </label>
                  <input
                    type="text"
                    value={editingItem.name_en || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name_en: e.target.value })}
                    required
                    placeholder="e.g. Double Lava Smash"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'الاسم بالعربية (Name AR)' : 'Name (Arabic)'} *
                  </label>
                  <input
                    type="text"
                    value={editingItem.name_ar || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name_ar: e.target.value })}
                    required
                    placeholder="مثال: برجر لافا سماش المزدوج"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Bilingual Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.description_en || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description_en: e.target.value })}
                    placeholder="Crispy smashed beef with molten cheddar..."
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'الوصف بالعربية' : 'Description (Arabic)'}
                  </label>
                  <textarea
                    rows={2}
                    value={editingItem.description_ar || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description_ar: e.target.value })}
                    placeholder="لحم أنجوس مشوي على اللهب مع جبنة شيدر ذائبة..."
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Prices & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'السعر (ر.س - SAR)' : 'Price (SAR)'} *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingItem.price_sar || 0}
                    onChange={(e) => {
                      const sar = parseFloat(e.target.value) || 0;
                      setEditingItem({
                        ...editingItem,
                        price_sar: sar,
                        price_usd: Math.round((sar / 3.75) * 100) / 100,
                      });
                    }}
                    required
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'السعر ($ - USD)' : 'Price (USD)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingItem.price_usd || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, price_usd: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'التصنيف' : 'Category'} *
                  </label>
                  <select
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {language === 'ar' ? c.name_ar : c.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URL & File Upload */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ar' ? 'رابط الصورة أو رفع ملف' : 'Image URL or Upload File'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                    placeholder="https://... or /src/assets/..."
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <label className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-stone-200 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? '...' : (language === 'ar' ? 'رفع' : 'Upload')}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Nutrition & Spice */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'السعرات الحرارية' : 'Calories (kcal)'}
                  </label>
                  <input
                    type="number"
                    value={editingItem.calories || 650}
                    onChange={(e) => setEditingItem({ ...editingItem, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'وقت التحضير (دقيقة)' : 'Prep Time (mins)'}
                  </label>
                  <input
                    type="text"
                    value={editingItem.prepTime || '6-8'}
                    onChange={(e) => setEditingItem({ ...editingItem, prepTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {language === 'ar' ? 'مستوى الحرارة (0-3)' : 'Spice Level (0-3)'}
                  </label>
                  <select
                    value={editingItem.spiceLevel ?? 0}
                    onChange={(e) => setEditingItem({ ...editingItem, spiceLevel: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value={0}>{language === 'ar' ? '0 - عادي بدون حار' : '0 - Mild'}</option>
                    <option value={1}>{language === 'ar' ? '1 - حار خفيف' : '1 - Low Heat'}</option>
                    <option value={2}>{language === 'ar' ? '2 - حار متوسط' : '2 - Medium'}</option>
                    <option value={3}>{language === 'ar' ? '3 - ناري شديد' : '3 - Fiery Hot'}</option>
                  </select>
                </div>
              </div>

              {/* Availability & Featured Checkboxes */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-stone-300 focus:ring-amber-500"
                  />
                  <span>{language === 'ar' ? 'الوجبة متوفرة للطلب (isAvailable)' : 'Available to public (isAvailable)'}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured ?? false}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded border-stone-300 focus:ring-amber-500"
                  />
                  <span>{language === 'ar' ? 'وجبة مميزة / الأكثر طلباً (isFeatured)' : 'Featured / Chef Special (isFeatured)'}</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  {language === 'ar' ? 'حفظ الوجبة' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-stone-900 mb-4">
              {editingCategory.id
                ? (language === 'ar' ? 'تعديل التصنيف' : 'Edit Category')
                : (language === 'ar' ? 'إضافة تصنيف جديد' : 'New Category')}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'} *
                </label>
                <input
                  type="text"
                  value={editingCategory.name_en || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                  required
                  placeholder="e.g. Loaded Sides"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'} *
                </label>
                <input
                  type="text"
                  value={editingCategory.name_ar || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_ar: e.target.value })}
                  required
                  placeholder="مثال: مقبلات وبطاطس"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {language === 'ar' ? 'ترتيب الظهور' : 'Sort Order'}
                </label>
                <input
                  type="number"
                  value={editingCategory.sortOrder || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, sortOrder: parseInt(e.target.value) || 1 })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {language === 'ar' ? 'حفظ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {language === 'ar' ? 'تأكيد حذف الوجبة' : 'Confirm Delete Item'}
            </h3>
            <p className="text-xs text-stone-600">
              {language === 'ar'
                ? `هل أنت متأكد من رغبتك في حذف "${itemToDelete.name_ar}" نهائياً؟`
                : `Are you sure you want to permanently delete "${itemToDelete.name_en}"?`}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                {language === 'ar' ? 'نعم، حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900">
              {language === 'ar' ? 'تأكيد حذف التصنيف' : 'Confirm Delete Category'}
            </h3>
            <p className="text-xs text-stone-600">
              {language === 'ar'
                ? `هل أنت متأكد من حذف تصنيف "${categoryToDelete.name_ar}"؟`
                : `Are you sure you want to delete category "${categoryToDelete.name_en}"?`}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteCategory}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                {language === 'ar' ? 'نعم، حذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
