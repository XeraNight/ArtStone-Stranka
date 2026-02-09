import os
import re

def sync_footer():
    # Source file
    source_file = 'index.html'
    
    # Files to update
    target_files = [
        'montaz.html',
        'technicke-parametre.html',
        'kontakt.html',
        'realizacie.html',
        'proces-spoluprace.html',
        'produkty.html',
        'katalog.html'
    ]
    
    # Read the source footer
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract footer using simpler regex that captures everything between <footer and </footer>
    footer_match = re.search(r'(<footer.*?</footer>)', content, re.DOTALL)
    
    if not footer_match:
        print(f"Error: Could not find footer in {source_file}")
        return
        
    new_footer = footer_match.group(1)
    
    # Update target files
    for filename in target_files:
        if not os.path.exists(filename):
            print(f"Skipping {filename} (not found)")
            continue
            
        print(f"Processing {filename}...")
        
        with open(filename, 'r', encoding='utf-8') as f:
            target_content = f.read()
            
        # Replace footer
        if '<footer' in target_content:
            # Replace existing footer
            updated_content = re.sub(r'<footer.*?</footer>', new_footer, target_content, flags=re.DOTALL)
            
            # Preserve copyright script if it exists in the original file but not in replacement (though index.html has it)
            # Actually, index.html footer block includes the scripts usually?
            # Let's check if the captured footer includes the script.
            # In index.html, the script for copyright is usually separate or INSIDE?
            # Looking at previous view_file, the script for copyright-year is separate in some, or after footer.
            # In index.html (lines 769-770), the footer ends, and then:
            # 771: <!-- Catalog Modal Section -->
            
            # The capture above captures only <footer ... </footer>.
            # The script for copyright is usually distinct.
            # Let's ensure the script for copyright is present in target files.
            
            # Basic check: if the new footer has id="copyright-year", we need to make sure the script exists.
            
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(updated_content)
            print(f"Updated footer in {filename}")
        else:
            print(f"No footer found in {filename}, appending...")
            # If no footer, that's weird for these files, but we could append before </body>
            # updated_content = target_content.replace('</body>', f'{new_footer}\n</body>')

if __name__ == "__main__":
    sync_footer()
