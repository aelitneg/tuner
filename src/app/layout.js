import './globals.css';

export const metadata = {
  title: 'tuner',
  description: 'A simple, free tuner.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
