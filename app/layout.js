import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Blockchain PoS Explorer',
  description: 'Interactive Proof of Stake Blockchain Demo',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {children}
        </main>
      </body>
    </html>
  );
}
