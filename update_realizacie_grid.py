
import os

def update_file():
    # Read generated items
    with open('gallery_items.html', 'r', encoding='utf-8') as f:
        new_items = f.read()

    # Read target file
    with open('realizacie.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the block to replace
    # We look for the start of the first added item and the end of the second added item
    start_marker = '<div class="group cursor-pointer filter-item" data-category="interier">'
    end_marker = 'Exteriér / Artstone® Outdoor</p>\n                </div>'
    
    # Locate start
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("Start marker not found!")
        # Try a more unique substring if the first one is too generic (though it should be fine as it was the first item)
        # actually "interier" category is generic.
        # Let's search for the specific image source which is unique to the placeholder
        start_marker = 'src="interier_sample.png"'
        idx = content.find(start_marker)
        if idx == -1:
            print("Placeholder not found.")
            return
        # Find the start of the div wrapping this image
        # It is <div class="group cursor-pointer filter-item" data-category="interier">
        # We can search backwards from the image src
        start_idx = content.rfind('<div class="group cursor-pointer filter-item" data-category="interier">', 0, idx)
    
    # Locate end
    # The end marker should be after the start_idx
    # We look for the closing div of the EXTERIER item
    # The exteriér item contains 'src="exterier_sample.png"'
    ext_img_idx = content.find('src="exterier_sample.png"', start_idx)
    if ext_img_idx == -1:
        print("Exterier placeholder not found.")
        return
    
    # Find the end of this div. It ends with </p>... </div>
    # We can search for the next </div> closes.
    # But strictly, I copy pasted the block earlier.
    # Let's find the text "Exteriér / Artstone® Outdoor</p>" and then the closing </div>
    footer_text = "Exteriér / Artstone® Outdoor</p>"
    footer_idx = content.find(footer_text, ext_img_idx)
    if footer_idx == -1:
        print("Footer text not found.")
        return
        
    term_idx = content.find("</div>", footer_idx) + 6 # Include </div>
    
    # Perform replacement
    # We replace everything from start_idx to term_idx with new_items
    updated_content = content[:start_idx] + new_items + content[term_idx:]
    
    with open('realizacie.html', 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print("Successfully updated realizacie.html")

if __name__ == "__main__":
    update_file()
