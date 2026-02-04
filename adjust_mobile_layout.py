import re

def adjust_mobile_layout():
    file_path = 'produkty.html'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Grid Container
    # Find <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    # Change to grid-cols-2 ... gap-3 md:gap-6
    content = re.sub(
        r'(id="product-grid"[^>]*class="[^"]*)grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6',
        r'\1grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6',
        content
    )
    
    # 2. Update Product Card Height
    # class="product-card group relative w-full h-[380px]"
    content = re.sub(
        r'class="product-card group relative w-full h-\[380px\]"',
        r'class="product-card group relative w-full h-56 md:h-[380px]"',
        content
    )
    
    # 3. Update Card Padding
    # class="relative flex flex-col justify-end h-full p-6 text-white"
    content = re.sub(
        r'class="relative flex flex-col justify-end h-full p-6 text-white"',
        r'class="relative flex flex-col justify-end h-full p-3 md:p-6 text-white"',
        content
    )
    
    # 4. Update Title Size
    # <h3 class="text-xl font-bold tracking-tight">
    content = re.sub(
        r'<h3 class="text-xl font-bold tracking-tight">',
        r'<h3 class="text-sm md:text-xl font-bold tracking-tight">',
        content
    )
    
    # 5. Update Subtitle/Price Size (paragraph)
    # <p class="text-sm text-white/80 mt-1 font-medium">
    content = re.sub(
        r'<p class="text-sm text-white/80 mt-1 font-medium">',
        r'<p class="text-[10px] md:text-sm text-white/80 mt-1 font-medium">',
        content
    )
    
    # 6. Update Button/Detail Section
    # <div class="mt-8 flex items-center justify-between ... px-4 py-3 ...">
    # This is trickier because of the long class string.
    # We can match the beginning structure.
    # "mt-8 flex items-center justify-between" -> "mt-3 md:mt-8 flex items-center justify-between"
    # "px-4 py-3" -> "px-2 py-1.5 md:px-4 md:py-3"
    
    # Find the div starting with mt-8 inside the cards logic (can assume standard across cards)
    content = re.sub(
        r'class="mt-8 flex items-center justify-between',
        r'class="mt-3 md:mt-8 flex items-center justify-between',
        content
    )
    
    # Update padding inside that div
    # Note: Regex might catch other things if not careful, but "px-4 py-3" is specific enough in this context combined with previous checks? 
    # Actually, let's look at the full string from the file view:
    # bg-[hsl(var(--theme-color)/0.2)] backdrop-blur-md border border-[hsl(var(--theme-color)/0.3)] rounded-lg px-4 py-3 transition-all duration-300 group-hover:bg-[hsl(var(--theme-color)/0.4)] group-hover:border-[hsl(var(--theme-color)/0.5)]
    
    # We can just replace "px-4 py-3" with "px-3 py-2 md:px-4 md:py-3" in the whole file? 
    # Or be more specific. Let's try to be specific to the card button context.
    # logic: replace 'px-4 py-3' with 'px-3 py-2 md:px-4 md:py-3' ONLY if preceding text contains 'rounded-lg' (which it does).
    content = re.sub(
        r'(rounded-lg )px-4 py-3',
        r'\1px-2 py-1.5 md:px-4 md:py-3',
        content
    )
    
    # 7. Update Text "Detail produktu" size
    # <span class="text-sm font-semibold tracking-wide">Detail produktu</span>
    content = re.sub(
        r'<span class="text-sm font-semibold tracking-wide">Detail produktu</span>',
        r'<span class="text-[10px] md:text-sm font-semibold tracking-wide">Detail produktu</span>',
        content
    )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Successfully adjusted produkt.html for mobile layout.")

if __name__ == "__main__":
    adjust_mobile_layout()
