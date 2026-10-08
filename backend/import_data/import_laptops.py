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

from store.models import Product

def run():
    # File json nằm cùng cấp trong thư mục import_data
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

        # Cập nhật nếu đã có hoặc tạo mới nếu chưa có sản phẩm
        product, created = Product.objects.update_or_create(
            name=name,
            defaults={
                'price': price,
                'image': image,
                'description': description
            }
        )

        if created:
            created_count += 1
        else:
            updated_count += 1

    print(f"Hoàn thành nạp dữ liệu: Tạo mới {created_count}, Cập nhật {updated_count} sản phẩm.")

if __name__ == '__main__':
    run()