import os

def inject_script():
    script_tag = '<script src="catalog-modal.js"></script>'
    
    target_files = [
        'index.html',
        'montaz.html',
        'technicke-parametre.html',
        'kontakt.html',
        'realizacie.html',
        'proces-spoluprace.html',
        'produkty.html',
        'katalog.html' # ensure this one gets it too if it uses the modal
    ]
    
    for filename in target_files:
        if not os.path.exists(filename):
            continue
            
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'catalog-modal.js' in content:
            print(f"Script already in {filename}")
            continue
            
        # Insert before </body>
        if '</body>' in content:
            new_content = content.replace('</body>', f'{script_tag}\n</body>')
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Injected script into {filename}")
        else:
            print(f"Could not find </body> in {filename}")

if __name__ == "__main__":
    inject_script()
