import glob
import re

html_files = glob.glob('*.html')

# We need to perform 3 updates per file:
# 1. Critical CSS: .logo-link { height: 6rem; => height: 5rem;
# 2. Link Tag: class="... h-24 ..." style="height: 6rem;" => class="... h-20 ..." style="height: 5rem;"
# 3. Img Tag: style="height: 6rem; ..." => style="height: 5rem; ..."

# Note: The img tag has intrinsic width/height (588/176) which we keep. 
# We only change the CSS constraint that scales it.

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update Critical CSS
    # Regex for safety since spacing might vary slightly in my previous string injection
    content = re.sub(r'header \.logo-link \{ height: 6rem;', 'header .logo-link { height: 5rem;', content)
    
    # 2. Update Link Tag
    # Look for the specific pattern created in inject_critical_css.py
    # class="logo-link h-24 ... " style="height: 6rem;"
    # We replace h-24 with h-20 and 6rem with 5rem
    content = re.sub(r'class="logo-link h-24', 'class="logo-link h-20', content)
    content = re.sub(r'style="height: 6rem;"', 'style="height: 5rem;"', content)
    
    # 3. Update Img Tag
    # The img tag has style="height: 6rem; width: auto; ..."
    # We need to change that 6rem to 5rem too.
    # Note: step 2's replace might have already caught this if the string matches 'style="height: 6rem;', 
    # but the img tag usually has 'style="height: 6rem; width: auto; clip-path...'
    # My regex in step 2 `style="height: 6rem;"` (with closing quote) might NOT match `style="height: 6rem; width...`
    
    # So let's explicity target the img style
    content = content.replace('style="height: 6rem; width: auto; clip-path: inset(0 0 0 2px);"', 'style="height: 5rem; width: auto; clip-path: inset(0 0 0 2px);"')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Shrunk logo in {file_path}")
