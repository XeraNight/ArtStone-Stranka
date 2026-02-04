
import re

# 1. Append CSS to src/index.css
css_content = """
/* --- Aether Search Bar Design --- */
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes spin-reverse {
  to { transform: rotate(-360deg); }
}

#poda {
  position: relative;
  width: 333px;
  max-width: 100%; /* Responsive fix */
  height: 64px;
  background: linear-gradient(145deg, #a77b5a, #825e41);
  border: 4px solid #2d241d;
  border-radius: 4px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.6), 6px 6px 0px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  padding: 4px;
}

#main {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background: #2d241d;
  border-radius: 2px;
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.8);
}

.aether-input {
  width: 100%;
  height: 100%;
  padding: 0 45px 0 50px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 18px;
  color: #e4d5c7;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

.aether-input:focus {
  outline: none;
  color: #fff;
}

.aether-input::placeholder {
  color: #9c8c7e;
  opacity: 1;
}

.aether-border {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.aether-border::before,
.aether-border::after {
  content: "";
  position: absolute;
  border: 4px dashed #2d241d;
  width: calc(100% + 24px); /* Adjusted size */
  height: calc(100% + 24px);
  border-radius: 4px; /* Matches container roughly */
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s;
}

.aether-border::before {
  top: -12px;
  left: -12px;
}

.aether-border::after {
  bottom: -12px;
  right: -12px;
}

#poda:focus-within > .aether-border::before,
#poda:focus-within > .aether-border::after {
  opacity: 1; /* Make visible on focus */
  border-color: #d4ac8e;
}

#poda:focus-within > .aether-border::before {
  animation: spin 6s linear infinite; /* Slower spin for elegance */
}

#poda:focus-within > .aether-border::after {
  animation: spin-reverse 6s linear infinite;
}

#search-icon,
#filter-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  display: grid;
  place-items: center;
}

#search-icon {
  left: 12px;
  pointer-events: none;
}

#filter-icon {
  right: 0;
  height: 100%;
  width: 42px;
  background: linear-gradient(145deg, #6c5441, #574334);
  cursor: pointer;
  border-left: 2px solid #2d241d;
}

#filter-icon:active {
  background: linear-gradient(145deg, #574334, #6c5441);
}

#search-icon svg circle,
#search-icon svg line {
  stroke: #d4ac8e;
  stroke-width: 2.5;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.7));
}

#filter-icon svg path {
  stroke: #d4ac8e;
  stroke-width: 1.5;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.7));
}
"""

with open('src/index.css', 'a') as f:
    f.write(css_content)
print("Appended CSS to src/index.css")


# 2. Update Produkte.html
# Need to find the existing search bar div and replace it.
# Existing pattern: <div class="relative w-full md:w-80"> ... <input ... id="searchInput"/> </div>

with open('produkty.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Using regex to find the div. It starts with <div class="relative w-full md:w-80"> and ends with </div> after the input.
# The content inside has <svg ...> </svg> <input ... >
# Since HTML parsing with regex is fragile, I'll rely on the specific classes provided in previous steps.

pattern = r'<div class="relative w-full md:w-80">.*?<input.*?id="searchInput"/>\s*</div>'
# Note: .*? is non-greedy.
# The previous view_file showed:
# <div class="relative w-full md:w-80"> <svg ...> ... </svg> <input ... id="searchInput"/> </div>

new_html = """
<div id="poda">
    <div class="aether-border"></div>
    <div id="main">
      <input placeholder="Hľadať dekory..." type="text" id="searchInput" class="aether-input" name="text" />
      <div id="search-icon">
        <svg xmlns="http://www.w.org/2000/svg" width="22" viewBox="0 0 24 24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" height="22" fill="none">
          <circle r="8" cy="11" cx="11"></circle>
          <line y2="16.65" y1="22" x2="16.65" x1="22"></line>
        </svg>
      </div>
      <div id="filter-icon">
        <svg preserveAspectRatio="none" height="24" width="24" viewBox="4.8 4.56 14.832 15.408" fill="none">
          <path d="M8.16 6.65002H15.83C16.47 6.65002 16.99 7.17002 16.99 7.81002V9.09002C16.99 9.56002 16.7 10.14 16.41 10.43L13.91 12.64C13.56 12.93 13.33 13.51 13.33 13.98V16.48C13.33 16.83 13.1 17.29 12.81 17.47L12 17.98C11.24 18.45 10.2 17.92 10.2 16.99V13.91C10.2 13.5 9.97 12.98 9.73 12.69L7.52 10.36C7.23 10.08 7 9.55002 7 9.20002V7.87002C7 7.17002 7.52 6.65002 8.16 6.65002Z"></path>
        </svg>
      </div>
    </div>
</div>
"""

# We need to use re.DOTALL to match newlines
match = re.search(pattern, content, re.DOTALL)
if match:
    # Replace
    new_content = content.replace(match.group(0), new_html)
    with open('produkty.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced search bar in produkty.html")
else:
    print("Could not find search bar pattern in produkty.html")
    # Debugging: print a snippet where it should be
    start_idx = content.find('id="catalog-filter"')
    if start_idx != -1:
        print("Context around catalog-filter:")
        print(content[start_idx:start_idx+1000])

