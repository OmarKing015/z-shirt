import { fabric } from 'fabric';

const BASE_COST = 6.00; // $6.00 base price for a t-shirt
const COST_PER_CHAR = 0.10; // $0.10 per character
const COST_PER_LOGO = 5.00; // $5.00 per logo

interface CustomObject extends fabric.Object {
    cost?: number;
    type?: 'text' | 'logo';
}

class CostEngine {
    calculate(objects: fabric.Object[]): number {
        let totalCost = BASE_COST;
        
        // Defensive check
        if (!Array.isArray(objects)) {
            return totalCost;
        }

        objects.forEach(obj => {
            const customObj = obj as CustomObject;
            
            // Recalculate cost to ensure it's not stale
            if (customObj.type === 'text' && customObj instanceof fabric.IText) {
                const textLength = customObj.text?.length || 0;
                customObj.cost = textLength * COST_PER_CHAR;
            } else if (customObj.type === 'logo') {
                customObj.cost = COST_PER_LOGO;
            }
            
            totalCost += customObj.cost || 0;
        });

        return totalCost;
    }
}

export const costEngine = new CostEngine();
