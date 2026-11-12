import { NextResponse } from 'next/server';
import { categories, foodItems } from '@/data/foodData';

export async function GET() {
  try {
    // Dynamic counts
    const categoriesWithRealCount = categories.map(cat => {
      if (cat.id === 'all') {
        return { ...cat, count: foodItems.length };
      }
      const count = foodItems.filter(item => item.category === cat.id).length;
      return { ...cat, count };
    });

    return NextResponse.json({
      success: true,
      data: categoriesWithRealCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
