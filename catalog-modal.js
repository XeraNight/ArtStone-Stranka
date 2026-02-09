/**
 * catalog-modal.js
 * 
 * Standardizes the Catalog Flipbook functionality across the website.
 * - Injects Modal HTML if missing.
 * - Loads PDF.js and PageFlip.js dependencies.
 * - Handles Open/Close logic.
 * - Renders the PDF Flipbook.
 */

(function() {
    // --- 1. CONFIGURATION ---
    const PDF_PATH = 'Katalog-Artstone.pdf';
    const COVER_IMAGE = '/images/catalog-preview.jpg';
    const JS_DEPENDENCIES = [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdn.jsdelivr.net/npm/page-flip/dist/js/page-flip.browser.js'
    ];

    // --- 2. HTML STRUCTURE ---
    const MODAL_HTML = `
    <div id="catalog-modal" class="fixed inset-0 z-[100] hidden bg-black/90 backdrop-blur-sm flex items-center justify-center">
        <button onclick="closeCatalogModal()" class="absolute top-6 right-6 z-50 text-white hover:text-primary transition-colors bg-black/50 rounded-full p-2">
            <span class="material-symbols-outlined text-3xl">close</span>
        </button>
        
        <!-- Flipbook Container -->
        <div class="relative w-full h-full flex items-center justify-center">
            <!-- The Book -->
            <div id="book" class="relative shadow-2xl transition-transform duration-500 ease-in-out"></div>
            
            <!-- Loading Indicator -->
            <div id="loading-indicator" class="absolute inset-0 flex items-center justify-center text-white flex-col gap-4 pointer-events-none">
                <span class="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
                <p>Načítavam katalóg...</p>
            </div>
        </div>
    </div>
    `;

    // --- 3. STATE ---
    let scriptsLoaded = false;
    let pdfDoc = null;
    let pageFlip = null;
    const canvasMap = new Map();

    // --- 4. INITIALIZATION ---
    function init() {
        // Prepare scripts immediately
        loadScripts().catch(err => console.error("Script load error:", err));
    }

    function injectModalHTML() {
        if (!document.getElementById('catalog-modal')) {
            console.log("Injecting Catalog Modal HTML...");
            const div = document.createElement('div');
            div.innerHTML = MODAL_HTML.trim();
            document.body.appendChild(div.firstChild);
        }
    }

    function loadScripts() {
        if (scriptsLoaded) return Promise.resolve();
        
        console.log("Loading Catalog dependencies...");
        const promises = JS_DEPENDENCIES.map(src => {
            return new Promise((resolve, reject) => {
                // Check if already script tag exists
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        });

        return Promise.all(promises).then(() => {
            scriptsLoaded = true;
            console.log("Catalog dependencies loaded.");
            // PDF.js worker setup
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }
        }).catch(err => {
            console.error("Failed to load catalog scripts:", err);
            alert("Nepodarilo sa načítať knižnice pre katalóg. Obnovte stránku.");
        });
    }

    // --- 5. LOGIC ---
    
    // Global function to be called from buttons
    window.openCatalogModal = async function() {
        console.log("Opening Catalog Modal...");
        
        // Ensure Modal exists
        let modal = document.getElementById('catalog-modal');
        
        // Fix for Gateway Modal legacy
        if (modal && !modal.querySelector('#book')) {
            console.log("Replacing legacy Gateway Modal...");
            modal.remove();
            modal = null;
        }

        if (!modal) {
            injectModalHTML();
            modal = document.getElementById('catalog-modal');
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Load scripts if not yet ready
        if (!scriptsLoaded) {
             await loadScripts();
        }

        // Initialize Flipbook logic if not already done
        if (!pageFlip) {
            await initFlipbook();
        }
    };

    window.closeCatalogModal = function() {
        const modal = document.getElementById('catalog-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    };

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') window.closeCatalogModal();
    });

    // --- FLIPBOOK RENDER LOGIC ---
    async function initFlipbook() {
        const loading = document.getElementById('loading-indicator');
        const bookEl = document.getElementById('book');
        loading.style.display = 'flex';
        
        if (!window.pdfjsLib || !window.St) {
            console.error("Dependencies not ready for Flipbook.");
            alert("Chyba: Knižnice nie sú načítané.");
            return;
        }

        try {
            console.log("Initializing Flipbook...", PDF_PATH);
            
            // 1. Load PDF
            const loadingTask = pdfjsLib.getDocument(PDF_PATH);
            pdfDoc = await loadingTask.promise;
            console.log("PDF Loaded. Pages:", pdfDoc.numPages);
            
            // 2. Get logic for orientation (using Page 2 as reference for inner pages)
            const targetPageNum = pdfDoc.numPages > 1 ? 2 : 1;
            const measurePage = await pdfDoc.getPage(targetPageNum);
            const viewport = measurePage.getViewport({ scale: 1 });
            // Assume 2 pages per spread
            const pdfAspectRatio = (viewport.width / 2) / viewport.height;

            // 3. Clear DOM
            bookEl.innerHTML = '';
            canvasMap.clear();

            // 4. Create Pages
            // Structure:
            // 0: Cover (Static)
            // 1: Inside Front (White)
            // 2,3: PDF Page 2 (Left, Right)
            // ...
            
            // 4. Create Pages
            // Structure:
            // 0: Cover (Static)
            // 1: Inside Front (White)
            // 2,3: PDF Page 2 (Left, Right)
            // ...
            
            // 4. Create Pages (Manual Cover Strategy for Curl)
            // Structure:
            // 0: Dummy (Invisible Left)
            // 1: Cover (Visible Right - Soft)
            // 2: PDF Page 2 Left (Back of Cover)
            // 3: PDF Page 2 Right
            // ...
            
            // 0 - Dummy (Left)
            const dummyDiv = document.createElement('div');
            dummyDiv.className = "page p-0 bg-black flex items-center justify-center overflow-hidden";
            dummyDiv.dataset.density = "hard"; // Hard backing
            dummyDiv.innerHTML = "";
            bookEl.appendChild(dummyDiv);

            // 1 - Cover (Right)
            const coverDiv = document.createElement('div');
            coverDiv.className = "page p-0 bg-black flex items-center justify-center overflow-hidden";
            coverDiv.dataset.density = "soft"; // SOFT for Curl Effect!
            coverDiv.innerHTML = `<img src="${COVER_IMAGE}" class="w-full h-full object-fill" alt="Cover" />`;
            bookEl.appendChild(coverDiv);
            
            // Inner Pages Steps
            // PDF Page 2 -> Divs 2, 3
            // PDF Page K -> Divs 2 + (K-2)*2, 2 + (K-2)*2 + 1
            
            for (let i = 2; i <= pdfDoc.numPages; i++) {
                const isBackCover = (i === pdfDoc.numPages);
                
                // Left Side (Always content/white)
                const pLeft = document.createElement('div');
                pLeft.className = "page p-0 bg-white flex items-center justify-center overflow-hidden";
                pLeft.dataset.density = "soft"; 
                pLeft.innerHTML = `<div class="text-gray-200 text-[10px] hidden">PDF ${i} L</div>`;
                bookEl.appendChild(pLeft);
                
                // Right Side
                const pRight = document.createElement('div');
                // If Back Cover, Right side is Dummy Transparent
                if (isBackCover) {
                    pRight.className = "page p-0 bg-transparent flex items-center justify-center overflow-hidden";
                    pRight.dataset.density = "soft";
                    pRight.innerHTML = ""; // Empty
                } else {
                    pRight.className = "page p-0 bg-white flex items-center justify-center overflow-hidden";
                    pRight.dataset.density = "soft"; 
                    pRight.innerHTML = `<div class="text-gray-200 text-[10px] hidden">PDF ${i} R</div>`;
                }
                bookEl.appendChild(pRight);
            }

            // 5. Dimensions
            const isMobile = window.innerWidth < 768;
            const maxH = window.innerHeight * 0.85; 
            const maxW = window.innerWidth * 0.85;
            
            let pageWidth, pageHeight;

            if (isMobile) {
                pageWidth = Math.min(maxW, maxH * pdfAspectRatio);
                pageHeight = pageWidth / pdfAspectRatio;
            } else {
                pageHeight = Math.min(maxH, (maxW / 2) / pdfAspectRatio);
                pageWidth = pageHeight * pdfAspectRatio;
            }
            
            catalogPageWidth = pageWidth;

            // 6. PageFlip
            pageFlip = new St.PageFlip(bookEl, {
                width: pageWidth,
                height: pageHeight,
                size: 'fixed',
                minWidth: 100,
                maxWidth: 3000,
                minHeight: 100,
                maxHeight: 3000,
                maxShadowOpacity: 0.5,
                showCover: false, // Manual Cover
                mobileScrollSupport: false 
            });

            console.log("Loading pages into PageFlip...");
            pageFlip.loadFromHTML(document.querySelectorAll('.page'));
            
            // 7. Events
            pageFlip.on('flip', (e) => {
                const currentPageIndex = e.data; 
                renderVisiblePages(currentPageIndex);
                updateBookPosition();
            });

            // Done
            loading.style.display = 'none';
            // Render initial state
            renderVisiblePages(1); 
            updateBookPosition();
            
        } catch (err) {
            console.error("PageFlip init error:", err);
            loading.innerHTML = `<p class="text-red-500 text-center px-4">Chyba načítania katalógu.<br><span class="text-sm opacity-70">${err.message}</span></p>`;
        }
    }
    
    function updateBookPosition() {
        if (!pageFlip) return;
        const bookEl = document.getElementById('book');
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            bookEl.style.transform = 'translate(0, 0)';
            return;
        }

        const currentIndex = pageFlip.getCurrentPageIndex();
        const totalPages = pageFlip.getPageCount();
        
        // Center logic for Manual Cover:
        
        // FRONT: Closed Cover (Index 0/1). Shift LEFT to center Index 1.
        if (currentIndex <= 1) {
            bookEl.style.transform = `translateX(-${catalogPageWidth / 2}px)`;
        } 
        // BACK: Closed Back Cover (Last Spread). Shift RIGHT to center Left Page.
        else if (currentIndex >= totalPages - 2) {
             bookEl.style.transform = `translateX(${catalogPageWidth / 2}px)`;
        }
        else {
            bookEl.style.transform = 'translate(0, 0)';
        }
    }

    async function renderVisiblePages(currentIndex) {
        if (!pageFlip || !pdfDoc) return;
        
        const totalPdf = pdfDoc.numPages;
        
        for (let pdfP = 2; pdfP <= totalPdf; pdfP++) {
            // Formula:
            // leftIdx = 2 + (pdfP - 2) * 2
            const leftIdx = 2 + (pdfP - 2) * 2;
            const rightIdx = leftIdx + 1;
            
            // Check proximity
            if (Math.abs(leftIdx - currentIndex) <= 4 || Math.abs(rightIdx - currentIndex) <= 4) {
                 if (!canvasMap.get(pdfP)) {
                     await renderPdfPageToCanvas(pdfP, leftIdx, rightIdx);
                 }
            }
        }
    }
    
    async function renderPdfPageToCanvas(pageNumber, targetLeftIndex, targetRightIndex) {
        if (canvasMap.get(pageNumber)) return;
        canvasMap.set(pageNumber, true); // Mark as processing/done

        try {
            const page = await pdfDoc.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 2.5 }); // High res
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            // Split
            const pages = document.querySelectorAll('.page');
            const containerLeft = pages[targetLeftIndex];
            // SPECIAL: If Back Cover (Last PDF Page), Ignore Right Container (It's Dummy)
            const isBackCover = (pageNumber === pdfDoc.numPages);
            const containerRight = isBackCover ? null : pages[targetRightIndex];
            
            const w = canvas.width;
            const h = canvas.height;
            const halfW = w / 2;

            if (containerLeft) {
                const cL = document.createElement('canvas');
                cL.width = halfW; cL.height = h;
                cL.getContext('2d').drawImage(canvas, 0, 0, halfW, h, 0, 0, halfW, h);
                const img = document.createElement('img');
                img.src = cL.toDataURL('image/jpeg', 0.8);
                img.className = "w-full h-full object-fill";
                containerLeft.innerHTML = '';
                containerLeft.appendChild(img);
            }
            
            if (containerRight) {
                const cR = document.createElement('canvas');
                cR.width = halfW; cR.height = h;
                cR.getContext('2d').drawImage(canvas, halfW, 0, halfW, h, 0, 0, halfW, h);
                const img = document.createElement('img');
                img.src = cR.toDataURL('image/jpeg', 0.8);
                img.className = "w-full h-full object-fill";
                containerRight.innerHTML = '';
                containerRight.appendChild(img);
            }
            
        } catch (e) {
            console.error("Render error page " + pageNumber, e);
            canvasMap.delete(pageNumber); // Retry later if failed?
        }
    }

    // Initialize
    init();

})();
