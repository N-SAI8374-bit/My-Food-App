import { NextResponse } from 'next/server';

// Server-side order cache in memory
let orders = [
  {
    orderId: 'ORD-7821',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    status: 'on_the_way',
    statusStep: 3,
    items: [
      { id: 'pizza-1', name: 'Truffle Burrata & Wild Mushroom Pizza', quantity: 1, price: 389, size: 'Regular (8")' },
      { id: 'drinks-1', name: 'Signature Belgian Chocolate Shake', quantity: 1, price: 199, size: 'Regular (350ml)' }
    ],
    customer: {
      name: 'Alex Johnson',
      phone: '+91 98765 43210',
      address: 'Apt 402, Sunshine Heights, Main Avenue',
      city: 'Downtown',
      deliveryInstructions: 'Ring doorbell twice'
    },
    paymentMethod: 'UPI / Online',
    pricing: {
      subtotal: 588,
      discount: 117,
      deliveryFee: 0,
      taxes: 29,
      tip: 30,
      total: 530
    },
    rider: {
      name: 'Rahul Sharma',
      phone: '+91 91234 56780',
      rating: 4.9,
      vehicle: 'TVS Jupiter (DL 04 AB 1234)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    },
    etaMinutes: 12
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      const found = orders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase());
      if (!found) {
        return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, order: found });
    }

    // Return list of all orders sorted newest first
    return NextResponse.json({
      success: true,
      orders: [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, paymentMethod, pricing } = body;

    if (!items || !items.length) {
      return NextResponse.json({ success: false, message: 'Cart items cannot be empty' }, { status: 400 });
    }

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json({ success: false, message: 'Name, phone, and delivery address are required' }, { status: 400 });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `ORD-${randomSuffix}`;

    const newOrder = {
      orderId: newOrderId,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      statusStep: 1, // 1: Confirmed, 2: Kitchen, 3: On The Way, 4: Delivered
      items,
      customer,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      pricing: pricing || {
        subtotal: items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        discount: 0,
        deliveryFee: 40,
        taxes: 25,
        tip: 0,
        total: items.reduce((acc, i) => acc + i.price * i.quantity, 0) + 65
      },
      rider: {
        name: 'Arjun Verma',
        phone: '+91 98112 34567',
        rating: 4.95,
        vehicle: 'Honda Activa (MH 02 CK 8821)',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
      },
      etaMinutes: 28
    };

    orders.unshift(newOrder);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully!',
      order: newOrder
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Order submission failed: ' + error.message }, { status: 500 });
  }
}
