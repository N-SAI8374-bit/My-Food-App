import { NextResponse } from 'next/server';
import { validCoupons } from '@/data/foodData';

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Please enter a coupon code' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = validCoupons[cleanCode];

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: `Invalid coupon code "${cleanCode}". Try FEAST20 or TASTY50.` },
        { status: 400 }
      );
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json(
        { success: false, message: `Add items worth ₹${coupon.minOrder - subtotal} more to use ${cleanCode}!` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountPercent) {
      discount = Math.round((subtotal * coupon.discountPercent) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    }

    return NextResponse.json({
      success: true,
      code: cleanCode,
      discount,
      freeDelivery: !!coupon.freeDelivery,
      message: `Coupon ${cleanCode} applied successfully! You saved ₹${discount}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Coupon validation failed' }, { status: 500 });
  }
}
