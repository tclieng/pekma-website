import pypdfium2 as pdfium
from PIL import Image
import os

pdf_path = r"C:\Users\MK-User\OneDrive - MK Tron\Desktop\PEKMA Constitution.pdf"
output_dir = r"C:\Users\MK-User\Desktop\PEKMA_Project"
os.makedirs(output_dir, exist_ok=True)

pdf = pdfium.PdfDocument(pdf_path)

for page_num in range(len(pdf)):
    page = pdf[page_num]
    # Render page at high resolution
    bitmap = page.render(scale=3)
    pil_image = bitmap.to_pil()

    # Check if this page has the logo (page 11 = Fasal 18)
    if page_num == 10:
        # Crop the logo area (approximate coordinates)
        width, height = pil_image.size
        # Logo is roughly in the middle-left area
        logo_region = pil_image.crop((100, 240, 350, 490))
        logo_region.save(os.path.join(output_dir, "pekma_logo.png"))
        print(f"Extracted logo from page {page_num + 1}")
        print(f"Logo size: {logo_region.size}")

print("Done!")