### 🔄 Git Workflow (Zjednodušený)

Tvoj workflow pre bezproblémovú prácu:

1.  **Práca na Feature Branchi (`feature/workingsite`)**
    - Robíš zmeny, kódiš.
    - Keď chceš uložiť:
      ```bash
      git add .
      git commit -m "popis zmeny"
      git push origin feature/workingsite
      ```
    - _Tip: Ak ti to nejde pushnúť, skús najprv `git pull origin feature/workingsite`._

2.  **Testovanie Live**
    - Pre rýchle ukázanie klientovi alebo testovanie:
      ```bash
      npm run deploy
      ```
    - Stránka bude na: `https://xeranight.github.io/ArtStone-Stranka/`

3.  **Nasadenie do Produkcie (Netlify)**
    - Keď je všetko hotové a otestované:
      ```bash
      git checkout main
      git pull origin main      # pre istotu stiahni najnovšie zmeny
      git merge feature/workingsite
      git push origin main
      ```
    - Netlify sa automaticky aktualizuje.
    - Potom sa vráť spať: `git checkout feature/workingsite`

---

**Riešenie problémov:**
Ak ti vypíše "divergent branches" alebo "need to pull":
`git pull origin <nazov-branche> --rebase`
