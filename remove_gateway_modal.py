import os
import re

def remove_gateway_modal():
    target_files = [
        'montaz.html',
        'technicke-parametre.html',
        'kontakt.html',
        'realizacie.html',
        'proces-spoluprace.html',
        'katalog.html'
    ]
    
    # Matches <div id="catalog-modal" ... </div> ... </div> ... </div>
    # It's tricky to match nested divs with regex.
    # However, we know the structure starts with <div id="catalog-modal" and contains "KATALÓG Trends 2024" or similar distinctive text, and ends before <script> or </body>.
    
    # Safer approach: Read the file, find the lines from <div id="catalog-modal" to the closing </div> of that block.
    # Since we can't easily parse DOM in python without beautifulsoup (which might not be installed), 
    # we will rely on the fact that this block is distinct and likely identical to what was in index.html.
    
    # We can use the start marker and end marker strategies if indenting is consistent.
    
    for filename in target_files:
        if not os.path.exists(filename):
            continue
            
        with open(filename, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        new_lines = []
        skip = False
        div_count = 0
        started = False
        
        for line in lines:
            if '<div id="catalog-modal"' in line:
                skip = True
                started = True
                div_count += line.count('<div') - line.count('</div>')
                # If single line block (unlikely), handle it
                if div_count == 0:
                    skip = False
                continue
                
            if skip:
                div_count += line.count('<div') - line.count('</div>')
                if div_count <= 0:
                    skip = False
                continue
            
            # Remove the old script tag for inline modal logic if present (simple inline scripts)
            if 'function openCatalogModal()' in line and '<script>' in line:
                 # This might be the inline script we want to remove too
                 # But let's be careful. The user only asked to remove the modal.
                 # The javascript catalog-modal.js handles logic.
                 # If there remains an old script defining openCatalogModal, it might conflict?
                 # catalog-modal.js assigns window.openCatalogModal. If a subsequent script overwrites it...
                 pass

            new_lines.append(line)
            
        if started:
            with open(filename, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            print(f"Removed Gateway Modal from {filename}")
        else:
            print(f"Gateway Modal not found in {filename} (or already removed)")

if __name__ == "__main__":
    remove_gateway_modal()
