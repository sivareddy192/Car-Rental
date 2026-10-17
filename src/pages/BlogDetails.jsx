import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SEOHead } from '../components/common/SEOHead';
import { CloudinaryImage } from '../components/common/CloudinaryImage';
import api from '../services/api';

export const BlogDetails = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setLoadError(false);
    api.get(`/blogs/${encodeURIComponent(slug)}`)
      .then((res) => setPost(res.data.post))
      .catch(() => setLoadError(true))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen pt-32"><LoadingSpinner text="Opening the story..." /></div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20 text-center text-zinc-900 dark:text-white">
        <h1 className="font-serif text-3xl font-bold">{loadError ? 'Story not found' : 'Story unavailable'}</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {loadError ? 'This article may have been removed or is not published.' : 'This article is not available.'}
        </p>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to the journal
        </Link>
      </div>
    );
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <article className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 pt-28 pb-20">
      <SEOHead
        title={`${post.title} — Car Rental Journal`}
        description={post.excerpt}
        canonicalUrl={`https://royaldrives.com/blog/${post.slug}`}
        ogImage={post.coverImage || undefined}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-950 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4" /> All stories
        </Link>
        <header className="mt-8">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">{post.category}</div>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl font-extrabold leading-tight text-zinc-950 dark:text-white">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            {publishedDate && <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{publishedDate}</span>}
            <span>By {post.author || 'Car Rental Editorial'}</span>
          </div>
        </header>
        {post.coverImage && (
          <CloudinaryImage
            src={post.coverImage}
            alt={post.title}
            className="mt-8 max-h-[520px] w-full rounded-2xl object-cover"
            sizes="(max-width: 768px) 100vw, 896px"
            loading="eager"
          />
        )}
        <div className="mt-10 whitespace-pre-wrap text-base leading-8 text-zinc-700 dark:text-zinc-300">
          {post.content}
        </div>
        <div className="mt-12 border-t border-zinc-200 dark:border-zinc-800 pt-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> More from the journal
          </Link>
        </div>
      </div>
    </article>
  );
};
