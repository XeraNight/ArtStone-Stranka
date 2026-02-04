import os
import re

def update_footer_text_size():
    # Loop through all files in the current directory
    for filename in os.listdir('.'):
        if filename.endswith(".html"):
            print(f"Processing {filename}...")
            
            with open(filename, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # We need to target the footer section specifically to avoid changing other parts.
            # However, since we want to change classes, and the classes are somewhat specific, 
            # we can try to use regex on the whole file but be careful with the context.
            # Best approach: Finds the footer block first.
            
            footer_match = re.search(r'(<footer.*</footer>)', content, re.DOTALL)
            if footer_match:
                footer_content = footer_match.group(1)
                original_footer_content = footer_content
                
                # 1. Update Description Text
                # <p class="text-white/40 max-w-sm mb-8 leading-relaxed"> -> Add text-lg
                footer_content = re.sub(
                    r'class="text-white/40 max-w-sm mb-8 leading-relaxed"',
                    r'class="text-white/40 max-w-sm mb-8 leading-relaxed text-lg"',
                    footer_content
                )
                
                # 2. Update Headers "Navigácia", "Služby"
                # <h4 class="text-white font-bold mb-6"> -> text-xl
                footer_content = re.sub(
                    r'<h4 class="text-white font-bold mb-6">',
                    r'<h4 class="text-white font-bold mb-6 text-xl">',
                    footer_content
                )
                
                # 3. Update Links
                # text-sm -> text-base
                # <li><a class="text-white/40 hover:text-primary transition-colors text-sm"
                # Matches generic patterns for links in footer list
                footer_content = re.sub(
                    r'(<a[^>]*class="[^"]*)text-sm([^"]*")',
                    r'\1text-base\2"',
                    footer_content
                )
                
                # 4. Update Copyright text
                # text-xs -> text-sm
                # <div class="pt-8 ... text-white/30 text-xs">
                footer_content = re.sub(
                    r'text-white/30 text-xs"',
                    r'text-white/30 text-sm"',
                    footer_content
                )
                
                # Replace the footer in the main content
                content = content.replace(original_footer_content, footer_content)
                
                with open(filename, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {filename}")
            else:
                print(f"No footer found in {filename}")

if __name__ == "__main__":
    update_footer_text_size()
