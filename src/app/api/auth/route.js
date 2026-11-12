import { NextResponse } from 'next/server';

// In-memory mock user database for demonstration
let users = [
  {
    id: 'usr-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123',
    phone: '+91 98765 43210',
    address: 'Flat 402, Royal Palms, Green Glen Layout, Downtown Metro',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'usr-2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    phone: '+91 98123 45678',
    address: 'Villa 12, Palm Meadows, Whitefield',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'usr-3',
    name: 'Demo Foodie',
    email: 'demo@flavorfleet.com',
    password: 'demo123',
    phone: '+91 99999 88888',
    address: 'Penthouse 8B, Sky Tower, Metro Center',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date('2024-05-01').toISOString(),
  },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name, phone, address } = body;

    // 1. SIGN IN / LOGIN
    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Please enter both email and password.' },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'No account found with this email. Please sign up.' },
          { status: 404 }
        );
      }

      if (user.password !== password) {
        return NextResponse.json(
          { success: false, message: 'Incorrect password. Try again or click "Forgot Password".' },
          { status: 401 }
        );
      }

      // Safe user object without sensitive password
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
      };

      return NextResponse.json({
        success: true,
        message: `Welcome back, ${user.name}! 🍕`,
        user: safeUser,
        token: `jwt_mock_${user.id}_${Date.now()}`,
      });
    }

    // 2. SIGN UP / REGISTER
    if (action === 'signup') {
      if (!name || !email || !password) {
        return NextResponse.json(
          { success: false, message: 'Name, email, and password are required.' },
          { status: 400 }
        );
      }

      const cleanEmail = email.trim().toLowerCase();
      const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (existing) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists. Please log in.' },
          { status: 409 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: 'Password must be at least 6 characters long.' },
          { status: 400 }
        );
      }

      const defaultAvatars = [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
      ];
      const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

      const newUser = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone ? phone.trim() : '+91 98765 00000',
        address: address ? address.trim() : 'Downtown Metro, Central City',
        avatar: randomAvatar,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);

      const safeUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        avatar: newUser.avatar,
      };

      return NextResponse.json({
        success: true,
        message: `Account created successfully! Welcome to FlavorFleet, ${newUser.name}! 🎉`,
        user: safeUser,
        token: `jwt_mock_${newUser.id}_${Date.now()}`,
      }, { status: 201 });
    }

    // 3. FORGOT PASSWORD
    if (action === 'forgot-password') {
      if (!email) {
        return NextResponse.json(
          { success: false, message: 'Please provide your registered email address.' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Password reset instructions have been sent to ${email}. Please check your inbox! 📬`,
      });
    }

    // 4. DEMO / GUEST LOGIN
    if (action === 'demo') {
      const demoUser = users[0];
      const safeUser = {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
        address: demoUser.address,
        avatar: demoUser.avatar,
      };

      return NextResponse.json({
        success: true,
        message: `Logged in as demo user ${demoUser.name}! 🚀`,
        user: safeUser,
        token: `jwt_mock_demo_${Date.now()}`,
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action provided.' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Authentication failed: ' + error.message },
      { status: 500 }
    );
  }
}
