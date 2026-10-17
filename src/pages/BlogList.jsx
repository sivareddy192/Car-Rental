import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SEOHead } from '../components/common/SEOHead';
import { CloudinaryImage } from '../components/common/CloudinaryImage';
import api from '../services/api';

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recently';

export const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    api.get('/blogs')
      .then((res) => setPosts(res.data.posts || []))
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20">
      <SEOHead
        title="Stories & Guides — Car Rental Blog"
        description="Luxury travel inspiration, driving guides, and stories from Car Rental."
        canonicalUrl="https://royaldrives.com/blog"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 dark:text-zinc-300">
            <BookOpen className="w-3.5 h-3.5" />
            The Car Rental Journal
          </div>
          <h1 className="mt-5 font-serif text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-zinc-950 dark:text-white">
            Stories & Guides
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Ideas, destinations, and advice for making every journey exceptional.
          </p>
        </header>

        {isLoading ? (
          <LoadingSpinner text="Loading the journal..." />
        ) : loadError ? (
          <p role="alert" className="py-16 text-center text-sm text-zinc-600 dark:text-zinc-400">
            The journal could not be loaded. Please try again.
          </p>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 py-16 text-center">
            <BookOpen className="w-9 h-9 mx-auto mb-3 text-zinc-400" />
            <p className="font-semibold">New stories are on the way.</p>
            <p className="mt-1 text-sm text-zinc-500">Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {post.coverImage ? (
                      <CloudinaryImage
                        src={post.coverImage}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-800 to-black text-amber-300">
                        <BookOpen className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                      <span>{post.category || 'Lifestyle'}</span>
                      <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h2 className="mt-3 font-serif text-xl font-bold text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      Read story <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
