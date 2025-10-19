import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="sticky bottom-0 z-50 backdrop-blur-sm bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <span className="text-slate-600 dark:text-slate-400 text-sm">
            &copy; 2025 Blog Creator. All rights reserved.
          </span>
          
          {/* Links */}
          <div className="flex gap-6">
            <Link 
              href="/about" 
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link 
              href="/blog" 
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/contact" 
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;