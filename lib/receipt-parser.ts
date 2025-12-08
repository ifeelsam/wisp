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
  const lines = ocrText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const result: ParsedReceipt = {
    items: [],
  };

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

  // Price patterns
  const pricePattern = /(\d+\.\d{2})/;
  const priceWithDollarPattern = /\$?\s*(\d+\.\d{2})/;

  // Total patterns
  const totalPatterns = [
    /TOTAL[:\s]*\$?\s*(\d+\.\d{2})/i,
    /AMOUNT[:\s]*\$?\s*(\d+\.\d{2})/i,
    /SUBTOTAL[:\s]*\$?\s*(\d+\.\d{2})/i,
    /^TOTAL\s+\$?\s*(\d+\.\d{2})/i,
  ];

  // Item line patterns (name, optional quantity, price)
  const itemPatterns = [
    /^(.+?)\s+(\d+\.\d{2})$/,
    /^(.+?)\s+(\d+)\s+x\s+(\d+\.\d{2})/,
    /^(.+?)\s+@\s+(\d+\.\d{2})/,
    /^(.+?)\s+(\d+\.\d{2})\s*$/,
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
          result.total = parseFloat(match[1]);
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
        upperLine.includes('TOTAL') ||
        upperLine.includes('SUBTOTAL') ||
        upperLine.includes('TAX') ||
        upperLine.includes('AMOUNT DUE')
      ) {
        continue;
      }

      // Try to match item patterns
      for (const pattern of itemPatterns) {
        const match = line.match(pattern);
        if (match) {
          const itemName = match[1].trim();
          let price: number | undefined;
          let quantity: string | undefined;

          // Skip if it looks like a total or tax line
          if (itemName.toUpperCase().includes('TOTAL') || itemName.toUpperCase().includes('TAX')) {
            continue;
          }

          if (match.length === 3) {
            // Pattern: name price
            price = parseFloat(match[2]);
          } else if (match.length === 4) {
            // Pattern: name quantity x price
            quantity = match[2];
            price = parseFloat(match[3]);
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
          }
          break;
        }
      }

      // Fallback: if line has a price at the end, treat as item
      if (result.items.length === 0 || !line.match(pricePattern)) {
        const priceMatch = line.match(priceWithDollarPattern);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1]);
          if (price && !isNaN(price) && price > 0 && price < 10000) {
            const itemName = line.substring(0, priceMatch.index).trim();
            if (itemName.length > 0 && itemName.length < 100) {
              result.items.push({
                name: itemName,
                price: price,
                category: inferCategory(itemName),
              });
            }
          }
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

