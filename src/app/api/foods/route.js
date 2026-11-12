import { NextResponse } from 'next/server';
import { foodItems } from '@/data/foodData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const diet = searchParams.get('diet'); // 'veg', 'non-veg', 'all'
    const sort = searchParams.get('sort'); // 'popular', 'price-low', 'price-high', 'rating'

    let filtered = [...foodItems];

    if (category && category !== 'all') {
      filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (diet && diet !== 'all') {
      if (diet === 'veg') {
        filtered = filtered.filter(item => item.isVeg === true);
      } else if (diet === 'non-veg') {
        filtered = filtered.filter(item => item.isVeg === false);
      }
    }

    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    if (sort) {
      switch (sort) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'popular':
        default:
          filtered.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
          break;
      }
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve food items', error: error.message },
      { status: 500 }
    );
  }
}
