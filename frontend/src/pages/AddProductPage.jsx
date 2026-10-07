import React, { useState, useMemo } from 'react';
import {
  Laptop,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Search,
  Code,
  Eye,
  Star,
  Cpu,
  Monitor,
  HardDrive,
  Zap,
  Plug,
  Shield,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: '1',
    category: 'Laptop Gaming',
    name: 'ASUS ROG Strix SCAR 15 Core i9 12th Gen',
    description: 'Máy tính xách tay chơi game Asus ROG Strix SCAR 15 sở hữu chip Intel Core i9-12900H và đồ họa RTX 3080Ti siêu khủng.',
    price: 54990000,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    user_rating: 4.9,
    series: 'ROG Strix SCAR 15',
    color: 'Off Black',
    suitable_for: 'Gaming chuyên nghiệp, Streamer',
    type: 'Gaming Laptop',
    processor_brand: 'Intel',
    processor_name: 'Core i9',
    processor_variant: '12900H',
    ram_type: 'DDR5',
    ram: '32 GB',
    ssd_capacity: '1 TB SSD',
    graphic_processor: 'NVIDIA GeForce RTX 3080 Ti',
    dedicated_graphic_memory: '16 GB GDDR6',
    screen_size: '15.6 inch',
    screen_resolution: '2560 x 1440',
    touchscreen: 'Không',
    weight: '2.30 kg',
    operating_system: 'Windows 11 Home',
    usb_port: '1x Thunderbolt 4, 3x USB 3.2 Gen 1',
    hdmi_port: '1x HDMI 2.1',
    bluetooth: 'v5.2',
    wireless_lan: 'Wi-Fi 6E (802.11ax)',
    web_camera: 'HD 720p',
    screen_type: 'IPS 240Hz 3ms, DCI-P3 100%',
    backlit_keyboard: 'Per-Key RGB',
    fingerprint_sensor: 'Không',
    battery_cell: '90WHrs, 4-cell Li-ion',
    power_supply: '280W AC Adapter',
    dimensions: '354 x 259 x 22.6 mm',
    warranty_summary: '24 tháng chính hãng',
    sales_package: 'Sạc 280W, Balo ROG SCAR, Sách HDSD'
  },
  {
    id: '2',
    category: 'Laptop Gaming',
    name: 'HP Victus Ryzen 7 Octa Core 5800H',
    description: 'Laptop HP Victus cân bằng hiệu năng và giá thành tốt cho học sinh sinh viên với chip Ryzen 7 và RTX 3050Ti.',
    price: 21490000,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    user_rating: 4.6,
    series: 'Victus 16',
    color: 'Performance Blue',
    suitable_for: 'Chơi game, Thiết kế 2D/3D nhẹ',
    type: 'Gaming Laptop',
    processor_brand: 'AMD',
    processor_name: 'Ryzen 7',
    processor_variant: '5800H',
    ram_type: 'DDR4',
    ram: '16 GB',
    ssd_capacity: '512 GB SSD',
    graphic_processor: 'NVIDIA GeForce RTX 3050 Ti',
    dedicated_graphic_memory: '4 GB GDDR6',
    screen_size: '16.1 inch',
    screen_resolution: '1920 x 1080',
    touchscreen: 'Không',
    weight: '2.48 kg',
    operating_system: 'Windows 11 Home',
    usb_port: '1x USB Type-C, 3x USB Type-A',
    hdmi_port: '1x HDMI 2.1',
    bluetooth: 'v5.2',
    wireless_lan: 'Wi-Fi 6 (802.11ax)',
    web_camera: '720p HD',
    screen_type: 'FHD 144Hz IPS micro-edge',
    backlit_keyboard: 'Đơn sắc trắng',
    fingerprint_sensor: 'Không',
    battery_cell: '70Wh Li-ion polymer',
    power_supply: '200W Smart AC adapter',
    dimensions: '370 x 260 x 23.5 mm',
    warranty_summary: '12 tháng chính hãng',
    sales_package: 'Sạc HP 200W, Sách hướng dẫn'
  }
];

const INITIAL_FORM_STATE = {
  category: 'Laptop Gaming',
  name: '',
  description: '',
  price: '',
  image: '',
  user_rating: '',
  series: '',
  color: '',
  suitable_for: '',
  type: '',
  processor_brand: '',
  processor_name: '',
  processor_variant: '',
  ram_type: '',
  ram: '',
  ssd_capacity: '',
  graphic_processor: '',
  dedicated_graphic_memory: '',
  screen_size: '',
  screen_resolution: '',
  touchscreen: '',
  screen_type: '',
  weight: '',
  operating_system: '',
  usb_port: '',
  hdmi_port: '',
  bluetooth: '',
  wireless_lan: '',
  web_camera: '',
  backlit_keyboard: '',
  fingerprint_sensor: '',
  battery_cell: '',
  power_supply: '',
  dimensions: '',
  warranty_summary: '',
  sales_package: ''
};

export default function AddProductPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [previewTab, setPreviewTab] = useState('card'); // 'card' or 'code'
  const [codeType, setCodeType] = useState('json'); // 'json' or 'django'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
    setActiveFormTab('basic');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      showToast('Vui lòng điền các thông tin bắt buộc (Tên, Danh mục, Giá)');
      return;
    }

    const formattedPrice = parseFloat(formData.price) || 0;
    const formattedRating = formData.user_rating ? parseFloat(formData.user_rating) : null;

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...formData, id: editingId, price: formattedPrice, user_rating: formattedRating } : p))
      );
      showToast('Cập nhật sản phẩm thành công!');
    } else {
      const newProduct = {
        ...formData,
        id: Date.now().toString(),
        price: formattedPrice,
        user_rating: formattedRating
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast('Thêm sản phẩm mới thành công!');
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      ...product,
      price: product.price ? product.price.toString() : '',
      user_rating: product.user_rating ? product.user_rating.toString() : ''
    });
    showToast(`Đang chỉnh sửa: ${product.name}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Đã xóa sản phẩm khỏi hệ thống');
    if (editingId === id) {
      resetForm();
    }
  };

  const loadSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    showToast('Đã khôi phục dữ liệu sản phẩm mẫu');
  };

  const generatedCode = useMemo(() => {
    if (codeType === 'json') {
      const exportObj = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        user_rating: formData.user_rating ? parseFloat(formData.user_rating) : null
      };
      return JSON.stringify(exportObj, null, 2);
    } else {
      // Django Orm Python code string
      return `from myapp.models import Product, Category

# Tim hoac tao Category
category_obj, _ = Category.objects.get_or_create(name="${formData.category || 'Laptop Gaming'}")

# Tao Instance Product
product = Product.objects.create(
    category=category_obj,
    name="${formData.name || 'ASUS ROG Strix SCAR 15'}",
    description="""${formData.description || ''}""",
    price=${formData.price ? parseFloat(formData.price) : 0.0},
    image="${formData.image || ''}",
    user_rating=${formData.user_rating ? parseFloat(formData.user_rating) : 'None'},
    series="${formData.series || ''}",
    color="${formData.color || ''}",
    suitable_for="${formData.suitable_for || ''}",
    type="${formData.type || ''}",
    processor_brand="${formData.processor_brand || ''}",
    processor_name="${formData.processor_name || ''}",
    processor_variant="${formData.processor_variant || ''}",
    ram_type="${formData.ram_type || ''}",
    ram="${formData.ram || ''}",
    ssd_capacity="${formData.ssd_capacity || ''}",
    graphic_processor="${formData.graphic_processor || ''}",
    dedicated_graphic_memory="${formData.dedicated_graphic_memory || ''}",
    screen_size="${formData.screen_size || ''}",
    screen_resolution="${formData.screen_resolution || ''}",
    touchscreen="${formData.touchscreen || ''}",
    screen_type="""${formData.screen_type || ''}""",
    weight="${formData.weight || ''}",
    operating_system="${formData.operating_system || ''}",
    usb_port="""${formData.usb_port || ''}""",
    hdmi_port="${formData.hdmi_port || ''}",
    bluetooth="${formData.bluetooth || ''}",
    wireless_lan="${formData.wireless_lan || ''}",
    web_camera="${formData.web_camera || ''}",
    backlit_keyboard="${formData.backlit_keyboard || ''}",
    fingerprint_sensor="${formData.fingerprint_sensor || ''}",
    battery_cell="${formData.battery_cell || ''}",
    power_supply="${formData.power_supply || ''}",
    dimensions="${formData.dimensions || ''}",
    warranty_summary="""${formData.warranty_summary || ''}""",
    sales_package="""${formData.sales_package || ''}"""
)`;
    }
  }, [formData, codeType]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    showToast('Đã sao chép mã thành công!');
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.processor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.series?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = !categoryFilter || p.category === categoryFilter;
      return matchQuery && matchCat;
    });
  }, [products, searchQuery, categoryFilter]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased pb-12">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Info size={16} className="text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
              <Laptop size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Product Manager Pro</h1>
              <p className="text-xs text-slate-500">Giao diện quản lý & Sinh mã cho Django Product Model</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadSampleData}
              className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-200 flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Nạp dữ liệu mẫu
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT FORM SECTION (7 Cols) */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {editingId ? <Edit2 className="text-blue-600" size={20} /> : <Plus className="text-blue-600" size={20} />}
                    {editingId ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Cập nhật đầy đủ các thông số kĩ thuật sản phẩm</p>
                </div>
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="px-3 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Hủy sửa
                  </button>
                )}
              </div>

              {/* Form Navigation Tabs */}
              <div className="flex overflow-x-auto gap-1 border-b border-slate-200 mb-6 text-xs font-medium scrollbar-none">
                {[
                  { id: 'basic', label: 'Cơ Bản', icon: Layers },
                  { id: 'cpu-mem', label: 'CPU & RAM', icon: Cpu },
                  { id: 'display-gpu', label: 'Màn Hình & GPU', icon: Monitor },
                  { id: 'connectivity', label: 'Cổng & Kết Nối', icon: Plug },
                  { id: 'power-other', label: 'Pin & Khác', icon: Zap }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeFormTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFormTab(tab.id)}
                      className={`px-3.5 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                        isActive
                          ? 'border-blue-600 text-blue-600 font-semibold bg-blue-50/50'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon size={14} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* TAB 1: BASIC INFO */}
                {activeFormTab === 'basic' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Danh mục (category) <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="Laptop Gaming">Laptop Gaming</option>
                          <option value="Laptop Văn Phòng">Laptop Văn Phòng</option>
                          <option value="MacBook">MacBook / Apple</option>
                          <option value="Đồ Họa Workstation">Đồ Họa Workstation</option>
                          <option value="Mỏng Nhẹ Cao Cấp">Mỏng Nhẹ Cao Cấp</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Tên sản phẩm (name) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="VD: ASUS ROG Strix SCAR 15 Core i9..."
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Giá bán VNĐ (price) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          placeholder="VD: 35990000"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Đánh giá (user_rating)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          name="user_rating"
                          value={formData.user_rating}
                          onChange={handleInputChange}
                          placeholder="VD: 4.8"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        URL Hình ảnh sản phẩm (image)
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/laptop.jpg"
                        className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Dòng máy (series)</label>
                        <input
                          type="text"
                          name="series"
                          value={formData.series}
                          onChange={handleInputChange}
                          placeholder="VD: ROG Strix"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Màu sắc (color)</label>
                        <input
                          type="text"
                          name="color"
                          value={formData.color}
                          onChange={handleInputChange}
                          placeholder="VD: Eclipse Gray"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nhu cầu (suitable_for)</label>
                        <input
                          type="text"
                          name="suitable_for"
                          value={formData.suitable_for}
                          onChange={handleInputChange}
                          placeholder="VD: Gaming, Đồ họa"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phân loại (type)</label>
                      <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        placeholder="VD: Gaming Laptop"
                        className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả (description)</label>
                      <textarea
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Mô tả tổng quan sản phẩm..."
                        className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* TAB 2: CPU & MEMORY */}
                {activeFormTab === 'cpu-mem' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Thương hiệu CPU</label>
                        <input
                          type="text"
                          name="processor_brand"
                          value={formData.processor_brand}
                          onChange={handleInputChange}
                          placeholder="VD: Intel / AMD"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên CPU</label>
                        <input
                          type="text"
                          name="processor_name"
                          value={formData.processor_name}
                          onChange={handleInputChange}
                          placeholder="VD: Core i9 / Ryzen 7"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mã CPU</label>
                        <input
                          type="text"
                          name="processor_variant"
                          value={formData.processor_variant}
                          onChange={handleInputChange}
                          placeholder="VD: 12900H"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Dung lượng RAM</label>
                        <input
                          type="text"
                          name="ram"
                          value={formData.ram}
                          onChange={handleInputChange}
                          placeholder="VD: 16 GB / 32 GB"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Loại RAM</label>
                        <input
                          type="text"
                          name="ram_type"
                          value={formData.ram_type}
                          onChange={handleInputChange}
                          placeholder="VD: DDR5"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Ổ cứng SSD</label>
                        <input
                          type="text"
                          name="ssd_capacity"
                          value={formData.ssd_capacity}
                          onChange={handleInputChange}
                          placeholder="VD: 1 TB SSD"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: DISPLAY & GPU */}
                {activeFormTab === 'display-gpu' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Card đồ họa (GPU)</label>
                        <input
                          type="text"
                          name="graphic_processor"
                          value={formData.graphic_processor}
                          onChange={handleInputChange}
                          placeholder="VD: NVIDIA GeForce RTX 3080 Ti"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Dung lượng VRAM</label>
                        <input
                          type="text"
                          name="dedicated_graphic_memory"
                          value={formData.dedicated_graphic_memory}
                          onChange={handleInputChange}
                          placeholder="VD: 16 GB GDDR6"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Kích thước màn hình</label>
                        <input
                          type="text"
                          name="screen_size"
                          value={formData.screen_size}
                          onChange={handleInputChange}
                          placeholder="VD: 15.6 inch"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Độ phân giải</label>
                        <input
                          type="text"
                          name="screen_resolution"
                          value={formData.screen_resolution}
                          onChange={handleInputChange}
                          placeholder="VD: 2560 x 1440"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Màn hình cảm ứng</label>
                        <input
                          type="text"
                          name="touchscreen"
                          value={formData.touchscreen}
                          onChange={handleInputChange}
                          placeholder="VD: Không / Có"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Công nghệ màn hình</label>
                      <textarea
                        name="screen_type"
                        rows="2"
                        value={formData.screen_type}
                        onChange={handleInputChange}
                        placeholder="VD: IPS 240Hz 3ms, DCI-P3 100%"
                        className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* TAB 4: CONNECTIVITY & PORTS */}
                {activeFormTab === 'connectivity' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Cổng USB</label>
                        <input
                          type="text"
                          name="usb_port"
                          value={formData.usb_port}
                          onChange={handleInputChange}
                          placeholder="VD: 1x Thunderbolt 4, 3x USB 3.2"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Cổng HDMI</label>
                        <input
                          type="text"
                          name="hdmi_port"
                          value={formData.hdmi_port}
                          onChange={handleInputChange}
                          placeholder="VD: 1x HDMI 2.1"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Bluetooth</label>
                        <input
                          type="text"
                          name="bluetooth"
                          value={formData.bluetooth}
                          onChange={handleInputChange}
                          placeholder="VD: v5.2"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Wi-Fi</label>
                        <input
                          type="text"
                          name="wireless_lan"
                          value={formData.wireless_lan}
                          onChange={handleInputChange}
                          placeholder="VD: Wi-Fi 6E (802.11ax)"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Webcam</label>
                        <input
                          type="text"
                          name="web_camera"
                          value={formData.web_camera}
                          onChange={handleInputChange}
                          placeholder="VD: HD 720p"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Đèn bàn phím</label>
                        <input
                          type="text"
                          name="backlit_keyboard"
                          value={formData.backlit_keyboard}
                          onChange={handleInputChange}
                          placeholder="VD: Per-Key RGB Light"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Cảm biến vân tay</label>
                        <input
                          type="text"
                          name="fingerprint_sensor"
                          value={formData.fingerprint_sensor}
                          onChange={handleInputChange}
                          placeholder="VD: Có / Không"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: POWER & PHYSICAL */}
                {activeFormTab === 'power-other' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Trọng lượng</label>
                        <input
                          type="text"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          placeholder="VD: 2.30 kg"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Hệ điều hành</label>
                        <input
                          type="text"
                          name="operating_system"
                          value={formData.operating_system}
                          onChange={handleInputChange}
                          placeholder="VD: Windows 11 Home"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Kích thước</label>
                        <input
                          type="text"
                          name="dimensions"
                          value={formData.dimensions}
                          onChange={handleInputChange}
                          placeholder="VD: 354 x 259 x 22.6 mm"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Dung lượng Pin</label>
                        <input
                          type="text"
                          name="battery_cell"
                          value={formData.battery_cell}
                          onChange={handleInputChange}
                          placeholder="VD: 90WHrs, 4-cell"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nguồn sạc</label>
                        <input
                          type="text"
                          name="power_supply"
                          value={formData.power_supply}
                          onChange={handleInputChange}
                          placeholder="VD: 280W AC Adapter"
                          className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Chế độ bảo hành</label>
                      <textarea
                        name="warranty_summary"
                        rows="2"
                        value={formData.warranty_summary}
                        onChange={handleInputChange}
                        placeholder="VD: Bảo hành 24 tháng chính hãng Onsite"
                        className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phụ kiện đi kèm</label>
                      <textarea
                        name="sales_package"
                        rows="2"
                        value={formData.sales_package}
                        onChange={handleInputChange}
                        placeholder="VD: Sạc, Balo ROG, Chuột gaming"
                        className="w-full text-sm rounded-xl border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      ></textarea>
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    Làm mới
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-2"
                  >
                    {editingId ? <Check size={14} /> : <Plus size={14} />}
                    {editingId ? 'Cập Nhật Sản Phẩm' : 'Lưu Sản Phẩm'}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* RIGHT PREVIEW & CODE SECTION (5 Cols) */}
          <section className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 sticky top-20">
              
              {/* Preview Toggle Tabs */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setPreviewTab('card')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      previewTab === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    <Eye size={13} /> Xem Trước Card
                  </button>
                  <button
                    onClick={() => setPreviewTab('code')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      previewTab === 'code' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    <Code size={13} /> Mã Dữ Liệu
                  </button>
                </div>

                {previewTab === 'code' && (
                  <div className="flex items-center gap-2">
                    <select
                      value={codeType}
                      onChange={(e) => setCodeType(e.target.value)}
                      className="text-[11px] font-medium border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 text-slate-700 outline-none"
                    >
                      <option value="json">JSON Format</option>
                      <option value="django">Django Orm Python</option>
                    </select>
                    <button
                      onClick={copyToClipboard}
                      className="p-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                      title="Copy Code"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                )}
              </div>

              {/* TAB PREVIEW 1: EXACT MATCH CARD UI */}
              {previewTab === 'card' && (
                <div className="py-2 flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Khung thẻ giao diện thực tế
                  </span>

                  {/* Card Container - White & Blue Theme as image prompt */}
                  <div className="w-full max-w-[280px]">
                    <div className="bg-white border-2 border-blue-600 rounded-2xl p-4 flex flex-col justify-between h-[360px] relative shadow-lg shadow-blue-100/50 transition-transform duration-300 hover:-translate-y-1">
                      
                      {/* Product Image */}
                      <div className="w-full h-44 flex items-center justify-center p-2 mb-2 bg-white rounded-xl relative">
                        <img
                          src={formData.image || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'}
                          alt="Product"
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/400x300/ffffff/2563eb?text=No+Image';
                          }}
                        />

                        {/* Rating Badge */}
                        {formData.user_rating && (
                          <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <Star size={10} fill="white" /> {formData.user_rating}
                          </div>
                        )}
                      </div>

                      {/* Product Metadata (Exact prompt style) */}
                      <div className="mt-auto">
                        <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mb-1">
                          {formData.name || 'ASUS ROG Strix SCAR 15 Core i9...'}
                        </h4>
                        <p className="text-[11px] text-slate-400 mb-2">
                          {formData.category || 'Laptop Gaming'}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-base font-bold text-blue-600">
                            {formData.price
                              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(formData.price)
                              : '0 ₫'}
                          </span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                            {formData.ram || 'RAM'} {formData.ssd_capacity ? `/ ${formData.ssd_capacity}` : ''}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* TAB PREVIEW 2: CODE PREVIEW */}
              {previewTab === 'code' && (
                <div className="relative">
                  <pre className="bg-slate-900 text-blue-300 font-mono text-[11px] p-4 rounded-xl overflow-x-auto max-h-[380px] leading-relaxed custom-scrollbar border border-slate-800">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              )}

            </div>
          </section>

        </div>

        {/* BOTTOM SECTION: REGISTERED PRODUCTS LIST */}
        <section className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Laptop className="text-blue-600" size={20} />
                Danh Sách Sản Phẩm Đã Tạo ({filteredProducts.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Thẻ sản phẩm hiển thị chuẩn phông nền trắng viền xanh</p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên, CPU..."
                  className="text-xs rounded-xl border border-slate-200 pl-8 pr-3 py-2 w-48 sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Tất cả danh mục</option>
                <option value="Laptop Gaming">Laptop Gaming</option>
                <option value="Laptop Văn Phòng">Laptop Văn Phòng</option>
                <option value="MacBook">MacBook / Apple</option>
              </select>
            </div>
          </div>

          {/* Grid Layout of Cards */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white border-2 border-blue-600 rounded-2xl p-4 flex flex-col justify-between h-[360px] relative group hover:shadow-xl hover:shadow-blue-100 transition-all duration-300"
                >
                  {/* Card Image */}
                  <div className="w-full h-44 flex items-center justify-center p-2 mb-2 bg-white rounded-xl relative">
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x300/ffffff/2563eb?text=No+Image';
                      }}
                    />

                    {p.user_rating && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Star size={10} fill="white" /> {p.user_rating}
                      </div>
                    )}

                    {/* Quick Hover Actions */}
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="w-9 h-9 rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-md flex items-center justify-center transition-colors"
                        title="Sửa sản phẩm"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="w-9 h-9 rounded-full bg-white text-red-600 hover:bg-red-600 hover:text-white shadow-md flex items-center justify-center transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-auto">
                    <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 mb-1" title={p.name}>
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mb-2">{p.category || 'Laptop'}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-base font-bold text-blue-600">
                        {p.price
                          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)
                          : 'Liên hệ'}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded">
                        {p.ram || ''} {p.ram && p.ssd_capacity ? '/' : ''} {p.ssd_capacity || ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Laptop className="mx-auto text-slate-300 mb-2" size={40} />
              <p className="text-sm font-medium text-slate-500">Không tìm thấy sản phẩm nào</p>
              <button
                onClick={loadSampleData}
                className="mt-3 text-xs text-blue-600 hover:underline font-semibold"
              >
                Tải lại danh sách mặc định
              </button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}