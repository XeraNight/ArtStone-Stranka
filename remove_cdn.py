import re

file_path = '/Users/jakub/Documents/ArtStone_stranka/produkty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove Tailwind CDN script
content = content.replace('<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>', '')

# Remove Tailwind Config script (using regex for safety across lines or spacing)
# Pattern matches <script id="tailwind-config"> ... </script>
# Using dotall to match across newlines if any (though viewing suggested one line)
content = re.sub(r'<script id="tailwind-config">.*?</script>', '', content, flags=re.DOTALL)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully removed Tailwind CDN and Config scripts.")
