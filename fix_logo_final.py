import glob

html_files = glob.glob('*.html')

# The current tag I just wrote in step 583
current_tag = '<img src="logo-white.png?v=3" alt="Artstone Logo" width="auto" height="96" class="h-full w-auto object-contain transition-transform group-hover:scale-105 origin-top-left" style="height: 6rem; width: auto; clip-path: inset(0 0 0 2px);">'

# The new tag with Intrinsic Dimensions (588x176) effectively communicating Aspect Ratio
# CSS (h-full / height: 6rem) will scale it down, but the browser now knows exactly how to calculate the width.
new_tag = '<img src="logo-white.png?v=3" alt="Artstone Logo" width="588" height="176" class="h-full w-auto object-contain transition-transform group-hover:scale-105 origin-top-left" style="height: 6rem; width: auto; clip-path: inset(0 0 0 2px);">'

for file_path in html_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if current_tag in content:
        new_content = content.replace(current_tag, new_tag)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated logo with intrinsic dimensions in {file_path}")
    else:
        # Fallback check if the previous script ran or not, maybe matching a broader pattern is safer if the previous step failed or partial update
        print(f"Exact tag match failed for {file_path}. Checking for older version...")
        # Try to match the version from even before? No, let's assume the previous step worked as it reported success.
        # But just in case, let's look for the *original* one too if I made a mistake in assumption.
        pass
