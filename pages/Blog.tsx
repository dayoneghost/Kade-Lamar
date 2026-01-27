
import React, { useEffect } from 'react';
import anime from 'animejs';
import { BLOG_POSTS } from '../constants.tsx';

const Blog: React.FC = () => {
  useEffect(() => {
    // Fix: Cast anime to any because the imported module type may not correctly reflect call signature in some environments
    (anime as any)({
      targets: '.blog-item',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(200),
      duration: 800,
      easing: 'easeOutQuart'
    });
  }, []);

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-black font-heading mb-6">Expert <span className="text-red-600">Guides</span> & Insights</h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            Helping you make informed decisions about your home entertainment and electronics in Kenya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="blog-item group cursor-pointer">
              <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-8 shadow-xl shadow-gray-200">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">Buying Guide</span>
                </div>
              </div>
              <div className="px-2">
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4 font-medium uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>By {post.author}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black font-heading mb-4 group-hover:text-red-600 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center space-x-2 text-red-600 font-bold group-hover:translate-x-2 transition-transform">
                  <span>Read Full Article</span>
                  <i className="fas fa-arrow-right text-sm"></i>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* SEO Keywords section - visually hidden or subtle for SEO bots */}
        <div className="mt-32 pt-20 border-t border-gray-100 text-center">
          <h3 className="text-gray-400 font-bold text-sm uppercase tracking-[0.2em] mb-8">Popular Search Tags</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Best 4K TV price in Nairobi', 
              'Hisense TV Kenya warranty', 
              'Genuine electronics shop Kenya', 
              'TV wall mounting service Nairobi',
              'Smart Duka Electronics prices',
              'Hisense 55 inch TV Kenya',
              'Cheap smart TVs Nairobi CBD'
            ].map(tag => (
              <span key={tag} className="px-6 py-3 bg-gray-50 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-default">
                #{tag.replace(/\s+/g, '')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
