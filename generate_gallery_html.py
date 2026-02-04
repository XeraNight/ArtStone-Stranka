
import glob
import os

def generate_html():
    html_output = ""
    
    # Process Interier
    interier_files = glob.glob("public/Interier/*.jpg")
    for file_path in interier_files:
        filename = os.path.basename(file_path)
        # Web path should be relative to public, which is root in Vite
        web_path = f"Interier/{filename}"
        name = filename.replace(".jpg", "").replace("-", " ").title()
        
        html_output += f'''
                <div class="group cursor-pointer filter-item" data-category="interier">
                    <div class="aspect-[3/4] overflow-hidden bg-surface mb-6 relative">
                        <img loading="lazy" alt="{name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" src="{web_path}"/>
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                    <div class="flex justify-between items-end border-b border-border-muted pb-4 group-hover:border-primary transition-colors duration-300">
                        <div>
                            <span class="text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block">Interiér</span>
                            <h3 class="text-lg font-medium text-white font-display truncate w-40">{name}</h3>
                        </div>
                        <span class="material-symbols-outlined text-white/30 group-hover:text-primary transition-colors">arrow_outward</span>
                    </div>
                </div>'''

    # Process Exterier
    exterier_files = glob.glob("public/Exterier/*.jpg")
    for file_path in exterier_files:
        filename = os.path.basename(file_path)
        web_path = f"Exterier/{filename}"
        name = filename.replace(".jpg", "").replace("-", " ").title()
        
        html_output += f'''
                <div class="group cursor-pointer filter-item" data-category="exterier">
                    <div class="aspect-[3/4] overflow-hidden bg-surface mb-6 relative">
                        <img loading="lazy" alt="{name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" src="{web_path}"/>
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                    <div class="flex justify-between items-end border-b border-border-muted pb-4 group-hover:border-primary transition-colors duration-300">
                        <div>
                            <span class="text-primary text-[10px] uppercase tracking-[0.2em] font-bold mb-2 block">Exteriér</span>
                            <h3 class="text-lg font-medium text-white font-display truncate w-40">{name}</h3>
                        </div>
                        <span class="material-symbols-outlined text-white/30 group-hover:text-primary transition-colors">arrow_outward</span>
                    </div>
                </div>'''
                
    print(html_output)

if __name__ == "__main__":
    generate_html()
