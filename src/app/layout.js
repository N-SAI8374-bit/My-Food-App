import './globals.css';
import { FoodProvider } from '@/context/FoodContext';

export const metadata = {
  title: 'FlavorFleet | Gourmet Food Delivered Fast',
  description: 'Order artisan pizzas, gourmet burgers, hyderabadi biryanis, desserts and drinks with live order tracking.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <FoodProvider>
          {children}
        </FoodProvider>
      </body>
    </html>
  );
}
