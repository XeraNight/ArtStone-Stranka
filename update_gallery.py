import os
import shutil
import random
import glob

# Paths
SOURCE_ROOT = "images/panely-ArtStone"
DEST_INTERIER = "public/Interier"
DEST_EXTERIER = "public/Exterier"
GALLERY_HTML = "gallery_items.html"

# Ensure destinations exist and are clean
def clean_and_create(path):
    if os.path.exists(path):
        shutil.rmtree(path)
    os.makedirs(path)

clean_and_create(DEST_INTERIER)
clean_and_create(DEST_EXTERIER)

# Gather all images
all_images = []
for root, dirs, files in os.walk(SOURCE_ROOT):
    for file in files:
        if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            # Filter out logos and small items if possible, though user said "I will filter"
            if "logo" in file.lower():
                continue
            all_images.append(os.path.join(root, file))

# Shuffle and select 60 images
random.shuffle(all_images)
selected_images = all_images[:60]

# Split into Interier (30) and Exterier (30)
interier_imgs = selected_images[:30]
exterier_imgs = selected_images[30:]

items_html = ""

def process_images(image_list, dest_folder, category_name):
    html_chunk = ""
    for src in image_list:
        filename = os.path.basename(src)
        dst = os.path.join(dest_folder, filename)
        shutil.copy2(src, dst)
        
        # Create HTML Item
        # Proper path for HTML (relative to where it's included, usually root or nothing if using base)
        # Assuming gallery items are loaded into index.html/realizacie.html which are in root.
        # Images are in public/Interier, so src should be 'Interier/filename'
        
        web_path = f"{os.path.basename(dest_folder)}/{filename}"
        title = filename.rsplit('.', 1)[0].replace('-', ' ').replace('_', ' ').title()
        
        html_chunk += f"""
                <div class="group cursor-pointer filter-item" data-category="{category_name}">
                    <div class="aspect-[3/4] overflow-hidden bg-surface mb-6 relative">
                        <img loading="lazy" alt="{title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" src="{web_path}"/>
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                    <div class="flex justify-between items-end border-b border-border-muted pb-4 group-hover:border-primary transition-colors duration-300">
                        <div>
                            <span class="text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block">{category_name.capitalize()}</span>
                            <h3 class="text-lg font-medium text-white font-display truncate w-40">{title}</h3>
                        </div>
                        <span class="material-symbols-outlined text-white/30 group-hover:text-primary transition-colors">arrow_outward</span>
                    </div>
                </div>"""
    return html_chunk

items_html += process_images(interier_imgs, DEST_INTERIER, "interier")
items_html += process_images(exterier_imgs, DEST_EXTERIER, "exterier")

with open(GALLERY_HTML, "w", encoding="utf-8") as f:
    f.write(items_html)

print(f"Successfully updated gallery with {len(selected_images)} new images.")
