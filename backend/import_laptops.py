import os
import django
import pandas as pd

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from store.models import Product, Category

file_path = "./import_data/Laptop_Prices_VND_Excel_Windows.xlsx"

products_df = pd.read_excel(
    file_path,
    sheet_name="Sản phẩm"
)

specs_df = pd.read_excel(
    file_path,
    sheet_name="Thông số kỹ thuật"
)

df = products_df.merge(
    specs_df,
    on="Name",
    how="left"
)

category = Category.objects.get_or_create(
    slug="laptop"
)[0]

def clean(value):
    if pd.isna(value):
        return ""
    return str(value).strip()

count = 0

for _, row in df.iterrows():
    if(count >= 20):
        break
    count += 1
    Product.objects.create(
        category=category,

        name=clean(row["Name"]),
        price=row["Prices"],

        user_rating=(
            None
            if pd.isna(row["user rating"])
            else row["user rating"]
        ),

        series=clean(row["Series"]),
        color=clean(row["Color"]),
        suitable_for=clean(row["Suitable For"]),
        type=clean(row["Type"]),

        processor_brand=clean(row["Processor Brand"]),
        processor_name=clean(row["Processor Name"]),
        processor_variant=clean(row["Processor Variant"]),

        ram_type=clean(row["RAM Type"]),
        ram=clean(row["RAM"]),
        ssd_capacity=clean(row["SSD Capacity"]),

        graphic_processor=clean(row["Graphic Processor"]),
        dedicated_graphic_memory=clean(
            row["Dedicated Graphic Memory Capacity"]
        ),

        screen_size=clean(row["Screen Size"]),
        screen_resolution=clean(row["Screen Resolution"]),
        touchscreen=clean(row["Touchscreen"]),

        weight=clean(row["Weight"]),
        operating_system=clean(row["Operating System"]),

        usb_port=clean(row["USB Port"]),
        hdmi_port=clean(row["HDMI Port"]),
        bluetooth=clean(row["Bluetooth"]),
        wireless_lan=clean(row["Wireless LAN"]),
        web_camera=clean(row["Web Camera"]),
        screen_type=clean(row["Screen Type"]),

        backlit_keyboard=clean(row["Backlit Keyboard"]),
        fingerprint_sensor=clean(row["Finger Print Sensor"]),

        battery_cell=clean(row["Battery Cell"]),
        power_supply=clean(row["Power Supply"]),
        dimensions=clean(row["Dimensions"]),
        warranty_summary=clean(row["Warranty Summary"]),
        sales_package=clean(row["Sales Package"]),
    )

print("Import thành công!")
