import os
import sys
import json
from pathlib import Path

# Thêm thư mục backend (thư mục cha của import_data) vào sys.path để gọi Django
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
sys.path.append(str(BACKEND_DIR))

# Thiết lập môi trường Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
import django
django.setup()

from store.models import Product, Category

def run():
    json_path = CURRENT_DIR / 'laptops_20.json'

    if not json_path.exists():
        print(f"Lỗi: Không tìm thấy file tại {json_path}")
        return

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    created_count = 0
    updated_count = 0

    for item in data:
        name = item.get('name')
        price = item.get('price', 0)
        image = item.get('image', '')
        description = item.get('description', '')
        
        # Lấy số category từ JSON (ví dụ: 1, 2 hoặc 3)
        cat_id = item.get('category', 2)
        
        # Ánh xạ ID danh mục sang tên và slug tương ứng cho bảng Category
        cat_mapping = {
            1: {"name": "Gaming Laptop", "slug": "gaming-laptop"},
            2: {"name": "Thin and Light Laptop", "slug": "thin-and-light-laptop"},
            3: {"name": "Others Notebook", "slug": "others-notebook"}
        }
        
        cat_info = cat_mapping.get(cat_id, {"name": "Others Notebook", "slug": "others-notebook"})
        
        # Đảm bảo Category tồn tại trong database (nếu chưa có thì tự động tạo mới)
        category_obj, _ = Category.objects.get_or_create(
            id=cat_id, 
            defaults={"name": cat_info["name"], "slug": cat_info["slug"]}
        )

        # Cập nhật hoặc tạo mới sản phẩm, gán đối tượng category_obj vào
        product, created = Product.objects.update_or_create(
            name=name,
            defaults={
                'category': category_obj,  # Truyền đối tượng Category vào đây
                'price': price,
                'image': image,
                'description': description,
                'series': item.get('series', ''),
                'color': item.get('color', ''),
                'suitable_for': item.get('suitable_for', ''),
                'type': item.get('type', ''),
                'processor_brand': item.get('processor_brand', ''),
                'processor_name': item.get('processor_name', ''),
                'processor_variant': item.get('processor_variant', ''),
                'ram_type': item.get('ram_type', ''),
                'ram': item.get('ram', ''),
                'ssd_capacity': item.get('ssd_capacity', ''),
                'graphic_processor': item.get('graphic_processor', ''),
                'dedicated_graphic_memory': item.get('dedicated_graphic_memory', ''),
                'screen_size': item.get('screen_size', ''),
                'screen_resolution': item.get('screen_resolution', ''),
                'touchscreen': item.get('touchscreen', ''),
                'weight': item.get('weight', ''),
                'operating_system': item.get('operating_system', ''),
                'usb_port': item.get('usb_port', ''),
                'hdmi_port': item.get('hdmi_port', ''),
                'bluetooth': item.get('bluetooth', ''),
                'wireless_lan': item.get('wireless_lan', ''),
                'web_camera': item.get('web_camera', ''),
                'screen_type': item.get('screen_type', ''),
                'backlit_keyboard': item.get('backlit_keyboard', ''),
                'fingerprint_sensor': item.get('fingerprint_sensor', ''),
                'battery_cell': item.get('battery_cell', ''),
                'power_supply': item.get('power_supply', ''),
                'dimensions': item.get('dimensions', ''),
                'warranty_summary': item.get('warranty_summary', ''),
                'sales_package': item.get('sales_package', ''),
                'user_rating': item.get('user_rating'),
            }
        )

        if created:
            created_count += 1
        else:
            updated_count += 1

    print(f"Hoàn thành nạp dữ liệu: Tạo mới {created_count}, Cập nhật {updated_count} sản phẩm.")

if __name__ == '__main__':
    run()