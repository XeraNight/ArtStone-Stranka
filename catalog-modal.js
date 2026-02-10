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
    const COVER_IMAGE = 'images/catalog-preview.jpg';
    const JS_DEPENDENCIES = [
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
        'https://cdn.jsdelivr.net/npm/page-flip/dist/js/page-flip.browser.js'
    ];

    // --- 2. HTML STRUCTURE ---
    const MODAL_HTML = `
    <style>
        /* Prevent visual "tearing" during page flips */
        .stf__wrapper,
        .stf__block,
        .stf__item {
            overflow: hidden !important;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
        }
        
        .page {
            overflow: hidden !important;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
        }
        
        .page img,
        .page canvas {
            display: block;
            max-width: 100%;
            max-height: 100%;
        }
    </style>
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
            document.body.insertAdjacentHTML('beforeend', MODAL_HTML.trim());
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

            // 4. Create Pages (Manual Cover Strategy)
            const isMobile = window.innerWidth < 768;

            // 0 - Dummy (Left) - Only for Desktop
            if (!isMobile) {
                const dummyDiv = document.createElement('div');
                dummyDiv.className = "page p-0 bg-black flex items-center justify-center overflow-hidden";
                dummyDiv.dataset.density = "soft";
                dummyDiv.dataset.type = "dummy-start"; // Mark type
                bookEl.appendChild(dummyDiv);
            }

            // 1 - Cover (Right in Desktop, 1st in Mobile)
            const coverDiv = document.createElement('div');
            coverDiv.className = "page p-0 bg-black flex items-center justify-center overflow-hidden";
            coverDiv.dataset.density = "soft";
            coverDiv.dataset.type = "cover";
            coverDiv.innerHTML = `<img src="${COVER_IMAGE}" class="w-full h-full object-fill" alt="Cover" />`;
            bookEl.appendChild(coverDiv);
            
            // Inner Pages Steps
            for (let i = 2; i <= pdfDoc.numPages; i++) {
                const isBackCover = (i === pdfDoc.numPages);
                
                // Left Side
                // FIX: Skip Page 2 Left on Mobile (The unwanted white page)
                const skipLeft = isMobile && i === 2;

                if (!skipLeft) {
                    const pLeft = document.createElement('div');
                    pLeft.className = "page p-0 bg-white flex items-center justify-center overflow-hidden";
                    pLeft.dataset.density = "soft"; 
                    pLeft.dataset.pdf = i; 
                    pLeft.dataset.side = "L";
                    pLeft.innerHTML = `<div class="text-gray-200 text-[10px] hidden">PDF ${i} L</div>`;
                    bookEl.appendChild(pLeft);
                }
                
                // Right Side
                const pRight = document.createElement('div');
                if (isBackCover && !isMobile) {
                    pRight.className = "page p-0 bg-transparent flex items-center justify-center overflow-hidden";
                    pRight.dataset.density = "soft";
                    pRight.dataset.type = "dummy-end";
                } else {
                    pRight.className = "page p-0 bg-white flex items-center justify-center overflow-hidden";
                    pRight.dataset.density = "soft";
                    pRight.dataset.pdf = i;
                    pRight.dataset.side = "R";
                    pRight.innerHTML = `<div class="text-gray-200 text-[10px] hidden">PDF ${i} R</div>`;
                }
                bookEl.appendChild(pRight);
            }

            // 5. Dimensions
            const maxH = window.innerHeight * 0.85; 
            const maxW = window.innerWidth * 0.85;
            
            let pageWidth, pageHeight;

            if (isMobile) {
                // Mobile: Fit width, keeping aspect ratio of ONE split page (half of wider spread)
                // pdfAspectRatio is Width/Height of ONE split page.
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
                showCover: false, 
                mobileScrollSupport: false,
                drawShadow: false 
            });

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
            renderVisiblePages(0); // Check 0 for mobile start
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
        const currentIndex = pageFlip.getCurrentPageIndex();
        
        if (isMobile) {
            // FIX: Center on Mobile (User Request)
            // Previously shifted right 15%, now centered.
            bookEl.style.transform = 'translate(0, 0)';
            return;
        }

        const totalPages = pageFlip.getPageCount();
        
        // Desktop Center Logic
        if (currentIndex <= 1) {
            bookEl.style.transform = `translateX(-${catalogPageWidth / 2}px)`;
        } 
        else if (currentIndex >= totalPages - 2) {
             bookEl.style.transform = `translateX(${catalogPageWidth / 2}px)`;
        }
        else {
            bookEl.style.transform = 'translate(0, 0)';
        }
    }

    async function renderVisiblePages(currentIndex) {
        if (!pageFlip || !pdfDoc) return;
        
        // Naive Proximity: Render everything +/- 2 PDF pages from "guess"
        
        const totalPdf = pdfDoc.numPages;
        
        for (let pdfP = 2; pdfP <= totalPdf; pdfP++) {
            // Check if containers exist
            const domL = document.querySelector(`.page[data-pdf="${pdfP}"][data-side="L"]`);
            const domR = document.querySelector(`.page[data-pdf="${pdfP}"][data-side="R"]`);
             
            if (!canvasMap.get(pdfP)) {
                 await renderPdfPageToCanvas(pdfP);
            }
        }
    }
    
    async function renderPdfPageToCanvas(pageNumber) {
        if (canvasMap.get(pageNumber)) return;
        
        // Check if we even need this page (are containers present?)
        const containerLeft = document.querySelector(`.page[data-pdf="${pageNumber}"][data-side="L"]`);
        const containerRight = document.querySelector(`.page[data-pdf="${pageNumber}"][data-side="R"]`);
        
        if (!containerLeft && !containerRight) {
             // Neither exists (e.g. skipped), mark done
             canvasMap.set(pageNumber, true);
             return;
        }

        canvasMap.set(pageNumber, true); // Mark processing

        try {
            const page = await pdfDoc.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 2.5 }); 
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;
            
            const w = canvas.width;
            const h = canvas.height;
            const halfW = w / 2;

            // FIX: Lookup using Data Attributes
            
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
            canvasMap.delete(pageNumber); 
        }
    }

    // Initialize
    init();

})();
