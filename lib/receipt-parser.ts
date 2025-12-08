/**
 * Receipt Parser - Extracts structured data from OCR text
 */

interface ParsedReceipt {
  items: Array<{ name: string; quantity?: string; price?: number; category?: string }>;
  store?: string;
  date?: Date;
  total?: number;
}

/**
 * Parse OCR text to extract receipt information
 */
export function parseReceiptText(ocrText: string): ParsedReceipt {
  // Clean up OCR text - remove extra whitespace, normalize
  const cleanedText = ocrText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n'); // Normalize multiple newlines
  
  const lines = cleanedText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const result: ParsedReceipt = {
    items: [],
  };
  
  // Debug: log OCR text (helpful for troubleshooting)
  console.log('OCR Text:', ocrText);
  console.log('Parsed lines:', lines.length);

  // Common store name patterns (usually at the top)
  const storePatterns = [
    /^(WALMART|TARGET|WHOLE\s*FOODS|KROGER|SAFEWAY|COSTCO|TRADER\s*JOE\'?S?|ALDI|PUBLIX)/i,
    /^([A-Z\s&]+)\s*(STORE|MARKET|FOODS|SUPERMARKET)/i,
  ];

  // Date patterns
  const datePatterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{2,4}/i,
  ];

  // Price patterns - handle both US (.) and European (,) decimal separators
  // Also handle trailing characters like "8B", "B", "C", "¢C"
  const pricePattern = /(\d+[.,]\d{1,3})/;
  const priceWithDollarPattern = /[€$¢]?\s*(\d+[.,]\d{1,3})\s*[A-Z¢]*/i;
  
  // Helper to normalize price (convert comma to dot)
  const normalizePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(',', '.'));
  };

  // Total patterns - handle both . and , decimal separators
  const totalPatterns = [
    /TOTAL[:\s]*[€$]?\s*(\d+[.,]\d{2,3})/i,
    /AMOUNT[:\s]*[€$]?\s*(\d+[.,]\d{2,3})/i,
    /SUBTOTAL[:\s]*[€$]?\s*(\d+[.,]\d{2,3})/i,
    /^TOTAL\s+[€$]?\s*(\d+[.,]\d{2,3})/i,
  ];

  // Item line patterns (name, optional quantity, price)
  // More flexible patterns to catch various receipt formats
  // Handle both . and , as decimal separators
  const itemPatterns = [
    /^(.+?)\s+(\d+[.,]\d{2,3})$/m,                    // "Item Name 4.99" or "Item Name 4,99"
    /^(.+?)\s+(\d+)\s+x\s+(\d+[.,]\d{2,3})/m,        // "Item Name 2 x 4.99"
    /^(.+?)\s+@\s+(\d+[.,]\d{2,3})/m,                // "Item Name @ 4.99"
    /^(.+?)\s+(\d+[.,]\d{2,3})\s*$/m,                // "Item Name 4.99 " (with trailing space)
    /^(.+?)\s+[€$](\d+[.,]\d{2,3})$/m,               // "Item Name $4.99" or "Item Name €4,99"
    /^(.+?)\s+(\d+)\s+(\d+[.,]\d{2,3})/m,            // "Item Name 2 4.99" (quantity without x)
    /^(.+?)\s+(\d+[.,]\d{2,3})\s+(\d+[.,]\d{2,3})/m, // "Item Name 2.50 4.99" (unit price total)
  ];

  let foundStore = false;
  let foundDate = false;
  let foundTotal = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    // Extract store name (usually in first few lines)
    if (!foundStore && i < 5) {
      for (const pattern of storePatterns) {
        const match = line.match(pattern);
        if (match) {
          result.store = match[0].trim();
          foundStore = true;
          break;
        }
      }
    }

    // Extract date
    if (!foundDate) {
      for (const pattern of datePatterns) {
        const match = line.match(pattern);
        if (match) {
          try {
            result.date = new Date(match[0]);
            if (!isNaN(result.date.getTime())) {
              foundDate = true;
              break;
            }
          } catch (e) {
            // Invalid date, continue
          }
        }
      }
    }

    // Extract total (usually near the end)
    if (!foundTotal && i > lines.length - 5) {
      for (const pattern of totalPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          result.total = normalizePrice(match[1]);
          foundTotal = true;
          break;
        }
      }
    }

    // Extract items
    // Skip header lines and footer lines
    if (i > 2 && i < lines.length - 3) {
      // Skip lines that look like headers or totals
      if (
        upperLine.includes('ITEM') ||
        upperLine.includes('DESCRIPTION') ||
        upperLine.includes('PRICE') ||
        upperLine.includes('QTY') ||
        (upperLine.includes('TOTAL') && !upperLine.match(/^\d/)) || // Skip "TOTAL" but not lines starting with numbers
        upperLine.includes('SUBTOTAL') ||
        (upperLine.includes('TAX') && !upperLine.match(/^\d/)) ||
        upperLine.includes('AMOUNT DUE') ||
        upperLine.includes('CASH') ||
        upperLine.includes('CHANGE') ||
        upperLine.includes('CARD')
      ) {
        continue;
      }

      let itemAdded = false;

      // Try to match item patterns
      for (const pattern of itemPatterns) {
        const match = line.match(pattern);
        if (match) {
          const itemName = match[1].trim();
          let price: number | undefined;
          let quantity: string | undefined;

          // Skip if it looks like a total or tax line
          if (itemName.toUpperCase().includes('TOTAL') || 
              itemName.toUpperCase().includes('TAX') ||
              itemName.toUpperCase().includes('SUBTOTAL') ||
              itemName.length < 2) {
            continue;
          }

          if (match.length === 3) {
            // Pattern: name price
            price = normalizePrice(match[2]);
          } else if (match.length === 4) {
            // Pattern: name quantity x price
            quantity = match[2];
            price = normalizePrice(match[3]);
          }

          // Only add if we have a valid price
          if (price && !isNaN(price) && price > 0 && price < 10000) {
            // Infer category from item name
            const category = inferCategory(itemName);

            result.items.push({
              name: itemName,
              quantity: quantity,
              price: price,
              category: category,
            });
            itemAdded = true;
          }
          break;
        }
      }

      // Fallback: if line has a price at the end and we didn't already add it, treat as item
      if (!itemAdded) {
        // Try to find price anywhere in the line (not just at the end)
        // Look for patterns like "ITEM NAME 1,99" or "ITEM NAME 1.99"
        const priceMatch = line.match(/(.+?)\s+(\d+[.,]\d{1,3})\s*[A-Z¢€$]*$/i);
        if (priceMatch && priceMatch.length >= 3) {
          const itemName = priceMatch[1].trim();
          const price = normalizePrice(priceMatch[2]);
          
          // Skip if it's clearly not an item
          if (price && !isNaN(price) && price > 0 && price < 10000 &&
              itemName.length > 1 && 
              itemName.length < 100 &&
              !itemName.toUpperCase().includes('TOTAL') &&
              !itemName.toUpperCase().includes('TAX') &&
              !itemName.toUpperCase().includes('SUBTOTAL') &&
              !itemName.toUpperCase().includes('DINHEIRO') &&
              !itemName.toUpperCase().includes('TROCO') &&
              !itemName.toUpperCase().includes('CASH') &&
              !itemName.toUpperCase().includes('CHANGE') &&
              !itemName.toUpperCase().includes('CONTRIBUINTE') &&
              !itemName.toUpperCase().includes('PRODUTOR') &&
              !itemName.match(/^[\d\s\.,€$¢]+$/)) { // Skip lines that are just numbers/prices
              
            result.items.push({
              name: itemName,
              price: price,
              category: inferCategory(itemName),
            });
            itemAdded = true;
          }
        }
      }
      
      // Handle multi-line items: if current line is just a price/quantity and previous line was an item
      // This handles cases like:
      // "TOMATE DE CACHO 0,808"
      // "0,540 kg x 1,49 EUR/Kg"
      if (!itemAdded && i > 0) {
        const prevLine = lines[i - 1];
        const prevLineHasPrice = prevLine.match(priceWithDollarPattern);
        
        // If previous line has a price and current line has quantity/unit info, 
        // the item was already captured in previous iteration
        // But if current line is just a price without item name, check if it's a continuation
        if (prevLineHasPrice && line.match(/^\d+[.,]\d+\s*(kg|g|lb|oz|l|ml)/i)) {
          // This is a quantity line, item was already captured
          continue;
        }
      }
    }
  }

  // If no total found, sum up items
  if (!result.total && result.items.length > 0) {
    result.total = result.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  // If no date found, use current date
  if (!result.date) {
    result.date = new Date();
  }

  // Debug: log parsed results
  console.log('Parsed receipt:', {
    store: result.store,
    itemsCount: result.items.length,
    items: result.items,
    total: result.total,
  });

  return result;
}

/**
 * Infer category from item name
 */
function inferCategory(itemName: string): string {
  const name = itemName.toLowerCase();

  const categoryKeywords: Record<string, string[]> = {
    'Produce': ['banana', 'apple', 'orange', 'lettuce', 'tomato', 'carrot', 'onion', 'potato', 'vegetable', 'fruit', 'berry', 'grape', 'pepper', 'cucumber', 'broccoli', 'spinach'],
    'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'sour cream', 'cottage cheese'],
    'Meat': ['chicken', 'beef', 'pork', 'turkey', 'fish', 'salmon', 'steak', 'bacon', 'sausage', 'ham'],
    'Staples': ['bread', 'rice', 'pasta', 'flour', 'sugar', 'salt', 'oil', 'oats', 'cereal', 'crackers'],
    'Snacks': ['chip', 'cookie', 'cracker', 'pretzel', 'popcorn', 'nuts', 'candy', 'chocolate'],
    'Drinks': ['soda', 'juice', 'water', 'coffee', 'tea', 'beer', 'wine', 'drink', 'beverage'],
    'Frozen': ['frozen', 'ice cream', 'pizza', 'frozen food'],
    'Cleaning': ['soap', 'detergent', 'cleaner', 'paper towel', 'tissue', 'toilet paper', 'shampoo', 'toothpaste'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => name.includes(keyword))) {
      return category;
    }
  }

  return 'Other';
}

