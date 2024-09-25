import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">Blog Creator</h1>
            <p className="text-gray-400">Sharing ideas, insights, and inspiration with the world.</p>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-8 border-t border-gray-700 pt-6">
          <div className="flex space-x-6 mb-6 md:mb-0">
            <Link href="https://facebook.com" className="hover:text-white transition-colors">Facebook</Link>
            <Link href="https://twitter.com" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="https://linkedin.com" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="https://instagram.com" className="hover:text-white transition-colors">Instagram</Link>
          </div>
          <div className="text-sm text-center">
            <p>&copy; 2024 Blog Creator. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
