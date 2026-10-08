import os
import sys
from pathlib import Path

# Thêm thư mục 'backend' (thư mục cha của import_data) vào sys.path để nạp Django
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
sys.path.append(str(BACKEND_DIR))

import django

# Khởi tạo Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from store.models import Product

# Danh sách 20 máy laptop
IMAGE_MAP = {
    # 1. ASUS ROG Strix SCAR 17
    "ASUS ROG Strix SCAR 17 Core i9 12th Gen - (32 GB/1 TB SSD/Windows 11 Home/8 GB Graphics/NVIDIA GeForce RTX 3070 Ti) G733ZW-LL139WS Gaming Laptop  (17.3 inch, Off Black, 2.90 kg, With MS Office)": "https://th.bing.com/th/id/OIP.G4Qtckw9ngXcjMj8NBs1iQHaHa?w=600&h=600&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 2. ASUS ROG Strix SCAR 15
    "ASUS ROG Strix SCAR 15 Core i9 12th Gen - (32 GB/1 TB SSD/Windows 11 Home/8 GB Graphics/NVIDIA GeForce RTX 3070 Ti) G533ZW-LN136WS Gaming Laptop  (15.6 inch, Off Black, 2.30 kg, With MS Office)": "https://th.bing.com/th/id/OIP.RRJ4FCBMWyyGyCD2M13vtwHaHa?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 3. HP Victus Ryzen 7
    "HP Victus Ryzen 7 Octa Core 5800H - (16 GB/512 GB SSD/Windows 11 Home/4 GB Graphics/NVIDIA GeForce RTX 3050) 16-e0351AX Gaming Laptop  (16.1 inch, Mica Silver, 2.48 kg, With MS Office)": "https://th.bing.com/th/id/OIP.acWZPpQXxIuZef1ozCfmZgHaFj?w=350&h=350&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 4. Lenovo IdeaPad Gaming 3i
    "Lenovo IdeaPad Gaming 3i Ryzen 7 Octa Core R7-5800H 5th Gen - (16 GB/512 GB SSD/Windows 11 Home/4 GB Graphics/NVIDIA GeForce RTX 3050) 15ACH6 Gaming Laptop  (15.6 inch, Shadow Black, 2.25 kg, With MS Office)": "https://th.bing.com/th/id/OIP.C23QlAgTyEmEE87l6OhSjAHaFj?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 5. Lenovo Yoga Slim 7 Core i5
    "Lenovo Yoga Slim 7 Core i5 11th Gen - (16 GB/512 GB SSD/Windows 11 Home) 82A300MBIN Thin and Light Laptop  (14 inch, Slate Grey, With MS Office)": "https://th.bing.com/th/id/OIP.eOdj4HUUu7kxwqdWwkPsQwHaE8?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 6. Lenovo Yoga Slim 7 Core i7
    "Lenovo Yoga Slim 7 Core i7 11th Gen - (16 GB/512 GB SSD/Windows 11 Home) 14ITL05 Thin and Light Laptop  (14 inch, Slate Grey, 1.36 kg, With MS Office)": "https://th.bing.com/th/id/OIP.JUTovBA9a7kv78xQjrAq8QHaHa?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 7. Lenovo V15 Celeron Dual Core
    "Lenovo Lenovo V15 Celeron Dual Core - (4 GB/256 GB SSD/Windows 10) 82C30053IH Thin and Light Laptop  (15.6 inch, Iron Grey)": "https://th.bing.com/th/id/OIP.zOPOl9h4Uktn_8HZD2IBEgHaGj?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 8. Lenovo Yoga 6 Ryzen 7
    "Lenovo Yoga 6 Ryzen 7 Octa Core R7-5700U 5th Gen - (16 GB/1 TB SSD/Windows 11 Home) 13ALC6 2 in 1 Laptop  (13.3 inch, Abyss Blue, 1.31 kg, With MS Office)": "https://th.bing.com/th/id/OIP.sVXKPDTPEAveVZffYaA2UAHaF5?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 9. ASUS TUF Gaming F15
    "ASUS TUF Gaming F15 Core i5 10th Gen - (8 GB/1 TB SSD/Windows 11 Home/4 GB Graphics/NVIDIA GeForce GTX 1650/144 Hz) FX506LH-HN310W Gaming Laptop  (15.6 inch, Black, 2.30 kg)": "https://th.bing.com/th/id/OIP.lYEX05YONM18fQey81eqEAHaHa?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 10. DELL Inspiron Pentium Silver
    "DELL Inspiron Pentium Silver - (8 GB/256 GB SSD/Windows 11 Home) Inspiron 3521 Notebook  (15.6 Inch, Carbon Black, 1.61 Kg, With MS Office)": "https://th.bing.com/th/id/OIP.NhdOw2I6kHvsJs1h5H76-wHaFj?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 11. DELL Inspiron Athlon Dual Core
    "DELL Inspiron Athlon Dual Core 3050U - (8 GB/256 GB SSD/Windows 11 Home) Inspiron 3525 Notebook  (15.6 Inch, Carbon Black, 1.68 Kg, With MS Office)": "https://th.bing.com/th/id/OIP.5N_3BhgybTFvP_mqnonUogHaGk?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 12. DELL Core i5 XPS 9305
    "DELL Core i5 11th Gen - (16 GB/512 GB SSD/Windows 11 Home) XPS 9305 Thin and Light Laptop  (13.4 inch, Platinum Silver, 1.16 kg, With MS Office)": "https://th.bing.com/th/id/OIP.cO1UyBTP4DZCRPumj84tIwHaHa?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 13. Lenovo Yoga 7i Ryzen 7
    "Lenovo Yoga 7i Ryzen 7 Octa Core R7-5800U 5th Gen - (16 GB/512 GB SSD/Windows 10 Home) 14ITL5 2 in 1 Laptop  (14 inch, Slate Grey, 1.43 kg, With MS Office)": "https://th.bing.com/th/id/OIP.hUqgCruLes0_d2QHGRrSbAHaE8?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 14. ASUS Ryzen 7 Gaming
    "ASUS Ryzen 7 Dual Core 7th Gen - (16 GB/512 GB HDD/512 GB SSD/Windows 11 Home/4 GB Graphics/NVIDIA GeForce RTX3050- 4GB) FA506IC-HN075W Gaming Laptop  (15.6 inch, Black)": "https://th.bing.com/th/id/OIP.udWd_4lbE1L2CeArxn3h7wAAAA?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 15. ASUS Ryzen 3 Quad Core
    "ASUS Ryzen 3 Quad Core 3rd Gen - (8 GB/256 GB SSD/Windows 11 Home) M515DA-BR322WS Laptop  (15.6 inch, Silver, With MS Office)": "https://th.bing.com/th/id/OIP.fsnUmX8WwhRg24BQkA1WFwHaE9?w=150&h=150&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 16. ASUS ROG Flow X13
    "ASUS ROG Flow X13 (2021) Ryzen 9 Octa Core Ryzen 9 5900HS 5th Gen - (32 GB/1 TB SSD/Windows 10 Home/4 GB Graphics/NVIDIA GeForce GTX 1650/120 Hz) GV301QH-K6461TS 2 in 1 Gaming Laptop  (13.4 Inch, Black, 1.3 KG, With MS Office)": "https://th.bing.com/th/id/OIP.M0b5VnWCtVw7CsIBObK6rgHaE5?w=150&h=150&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 17. MSI GP66 Leopard
    "MSI GP66 Leopard Core i7 11th Gen - (16 GB/1 TB SSD/Windows 10 Home/8 GB Graphics/NVIDIA GeForce RTX 3070/240 Hz) GP66 Leopard 11UG Gaming Laptop  (15.6 inches, Black, 2.9 kg)": "https://th.bing.com/th/id/OIP.EZwRIfI4hyh3OYaiGpccuQHaFj?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 18. ASUS Vivobook 15 OLED
    "ASUS Vivobook 15 OLED Core i3 11th Gen - (8 GB/256 GB SSD/Windows 11 Home) K513EA-L301WS Laptop  (15.6 inch, Hearty Gold, 1.80 kg kg, With MS Office)": "https://th.bing.com/th/id/OIP.RQvEoW5bhY8ZCxc5SjvxvgHaFh?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 19. realme Book Prime (Grey)
    "realme Book Prime Core i5 11th Gen - (16 GB/512 GB SSD/Windows 11 Home) CloudPro002 Thin and Light Laptop  (14 inch, Grey, 1.37 kg, With MS Office)": "https://th.bing.com/th/id/OIP.eVqj29VPEoZrUw0Onq3hNQHaHa?w=155&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",

    # 20. realme Book Prime (Green)
    "realme Book Prime Core i5 11th Gen - (16 GB/512 GB SSD/Windows 11 Home) CloudPro002 Thin and Light Laptop  (14 inch, Green, 1.37 kg, With MS Office)": "https://th.bing.com/th/id/OIP.7LIP1mMaQxyFV_J2XUP5NQHaHa?w=300&h=300&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
}

print("Bắt đầu cập nhật URL hình ảnh cho sản phẩm...")
updated_count = 0

for name, img_url in IMAGE_MAP.items():
    if img_url == "...":
        print(f"[-] Bỏ qua (chưa dán link): {name[:40]}...")
        continue

    # Cập nhật link ảnh vào database
    products = Product.objects.filter(name=name)
    if products.exists():
        products.update(image=img_url)
        updated_count += 1
        print(f"[+] Cập nhật thành công: {name[:40]}...")
    else:
        print(f"[!] Không tìm thấy trong DB: {name[:40]}...")

print(f"\nHoàn tất! Đã cập nhật ảnh cho {updated_count}/20 sản phẩm.")