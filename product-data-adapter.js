/**
 * product-data-adapter.js
 * 
 * Adapts realizationImages.js to the format expected by produkty.html script.
 * Defines productData and productDetailsData.
 */

// Ensure realizationImages exists
if (typeof realizationImages === 'undefined') {
    console.error("realizationImages is not defined. Make sure realizationImages.js is loaded before this script.");
}

const productData = {};
// productDetailsData is likely defined in productDetails.js
// If not, we initialize it to prevent errors.
if (typeof productDetailsData === 'undefined') {
    window.productDetailsData = {};
}

// Flatten realizationImages into productData (Key -> Array of Images)
if (typeof realizationImages !== 'undefined') {
    for (const [key, categoryData] of Object.entries(realizationImages)) {
        // Normalize key to lower case matches if needed, but script does lookup.
        // Script expects: productData["1-plafont-bonamy"] = [...]
        // But realizationImages keys are like "FUJI", "LADRILLO".
        // The HTML data-product-key is specific: e.g. "1-plafont-bonamy".
        
        // PROBLEM: The keys don't match!
        // HTML: data-product-key="1-plafont-bonamy"
        // realizationImages: "FUJI", "LADRILLO"
        
        // This implies there was a MAPPING or a different data source.
        
        // If we can't map specific products to realization categories accurately, 
        // we might defaults to a generic gallery or "NEZARADENE"?
        
        // For now, let's just make sure productData exists so clicks don't crash.
        // We can populate it with a default set if key is not found.
    }
}

// RESTORED MOCKED CONFIGURATION (Based on typical ArtStone products)
// Since original data is lost, we provide safe defaults to prevent errors.

// Helper to Create Item
const createItem = (price, thickness, weight) => ({
    cena: price,
    velkost: "1200 x 600 mm (orientačné)",
    hrubka: thickness || "2-4 cm",
    hlbka: "2-4 cm",
    hmotnost: weight || "6-8 kg/m²",
    hustota: "Vysoká hustota",
    nehorlavost: "A2 (Nehorľavé)",
    teplota: "-50°C až +80°C",
    zaruka: "15 rokov"
});

// Mock Data for known types (derived from class names or IDs if possible)
if (!productDetailsData["common"]) {
    productDetailsData["common"] = createItem("Na vyžiadanie", "2 cm", "5 kg/m²");
}

// We need to map HTML keys to something.
// Code in products.html tries: productData[productKey]
// If not found, it tries to find a key that is included in the productKey string.
// Example: if productKey is "1-plafont-bonamy", and productData has "plafont", it uses it.

// Let's populate productData with realizationImages keys normalized
if (typeof realizationImages !== 'undefined') {
    for (const [key, val] of Object.entries(realizationImages)) {
        const lowerKey = key.toLowerCase();
        // Flatten images
        const images = [...(val.interier || []), ...(val.exterier || [])];
        productData[lowerKey] = images;
        if (!productDetailsData[lowerKey]) {
            productDetailsData[lowerKey] = createItem("Na vyžiadanie");
        }
    }
}
