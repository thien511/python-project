import os
import json
import django

# Khởi tạo Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth.models import User
from store.models import Product, Category

# 1. Đường dẫn file JSON
file_path = "./import_data/laptops_20.json"

# 2. Tạo hoặc lấy Category và Seller
category, _ = Category.objects.get_or_create(slug="laptop", defaults={"name": "Laptop"})
seller, _ = User.objects.get_or_create(username="admin", defaults={"email": "admin@example.com"})

print("Đang đọc dữ liệu từ file JSON...")

with open(file_path, "r", encoding="utf-8") as f:
    laptop_list = json.load(f)

count = 0
for item in laptop_list:
    name = item.pop("name")
    
    # Nạp dữ liệu vào database
    product, created = Product.objects.get_or_create(
        name=name,
        defaults={
            "category": category,
            "seller": seller,
            **item
        }
    )
    if created:
        count += 1
        print(f" -> [{count}/20] Đã thêm: {name[:45]}...")
    else:
        print(f" -> Đã có sẵn: {name[:45]}...")

print(f"\nThành công! Đã nạp {count} máy laptop vào database.")