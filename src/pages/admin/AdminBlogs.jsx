import React, { useCallback, useEffect, useState } from 'react';
import { Edit2, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { CloudinaryImageUpload } from '../../components/admin/CloudinaryImageUpload';
import api from '../../services/api';
import toast from 'react-hot-toast';

const emptyPost = {
  title: '',
  excerpt: '',
  content: '',
  category: 'Lifestyle',
  coverImage: '',
  author: 'Car Rental Editorial',
  status: 'draft',
};

const inputClass = 'w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0f121d] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500';
const labelClass = 'mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300';

export const AdminBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState(emptyPost);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/blogs/admin/all');
      setPosts(res.data.posts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load blog posts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const openCreate = () => {
    setEditingPost(null);
    setForm(emptyPost);
    setIsModalOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      category: post.category || 'Lifestyle',
      coverImage: post.coverImage || '',
      author: post.author || 'Car Rental Editorial',
      status: post.status || 'draft',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const request = editingPost
        ? api.put(`/blogs/${editingPost._id}`, form)
        : api.post('/blogs', form);
      const res = await request;
      if (!res.data.success) {
        toast.error(res.data.message || 'Could not save blog post.');
        return;
      }
      toast.success(editingPost ? 'Blog post updated.' : 'Blog post created.');
      setIsModalOpen(false);
      await loadPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save blog post.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      const res = await api.delete(`/blogs/${post._id}`);
      if (res.data.success) {
        toast.success('Blog post deleted.');
        setPosts((current) => current.filter((item) => item._id !== post._id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete blog post.');
    }
  };

  const filteredPosts = posts.filter((post) =>
    `${post.title} ${post.category} ${post.status}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141724] p-6 shadow-xs sm:flex-row sm:items-end">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">Editorial</span>
          </div>
          <h1 className="font-serif text-3xl font-black tracking-tight text-slate-900 dark:text-white">Blog Management</h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{posts.length} total posts · Publish stories to show them on the website.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" /> New blog post
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search title, category, or status..."
          className={`${inputClass} pl-10`}
        />
      </div>

      {isLoading ? (
        <div className="flex min-h-[35vh] items-center justify-center"><LoadingSpinner text="Loading blog posts..." /></div>
      ) : filteredPosts.length ? (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <article key={post._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141724] p-4 shadow-xs sm:flex-row sm:items-center">
              {post.coverImage ? (
                <img src={post.coverImage} alt="" className="h-24 w-full rounded-xl object-cover sm:w-36" />
              ) : (
                <div className="flex h-24 w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-[#0f121d] sm:w-36"><FileText className="h-6 w-6" /></div>
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${post.status === 'published' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'}`}>
                    {post.status}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{post.category}</span>
                </div>
                <h2 className="truncate text-sm font-bold text-slate-900 dark:text-white">{post.title}</h2>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{post.excerpt}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={() => openEdit(post)} aria-label={`Edit ${post.title}`} className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-white/5">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleDelete(post)} aria-label={`Delete ${post.title}`} className="rounded-lg border border-rose-200 p-2.5 text-rose-600 hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141724] py-16 text-center">
          <FileText className="mx-auto mb-3 h-9 w-9 text-slate-300 dark:text-slate-600" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{search ? 'No matching posts.' : 'No blog posts yet.'}</p>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="blog-title">Title</label>
            <input id="blog-title" required maxLength={180} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="blog-excerpt">Short description</label>
            <textarea id="blog-excerpt" required maxLength={400} rows={2} value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="blog-category">Category</label>
              <input id="blog-category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="blog-author">Author</label>
              <input id="blog-author" value={form.author} onChange={(event) => setForm({ ...form, author: event.target.value })} className={inputClass} />
            </div>
          </div>
          <CloudinaryImageUpload
            label="Cover image"
            value={form.coverImage}
            onChange={(coverImage) => setForm({ ...form, coverImage })}
          />
          <div>
            <label className={labelClass} htmlFor="blog-content">Article content</label>
            <textarea id="blog-content" required rows={12} value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Write your article here. Separate paragraphs with a blank line." className={inputClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="blog-status">Publishing status</label>
            <select id="blog-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className={inputClass}>
              <option value="draft">Save as draft</option>
              <option value="published">Publish on website</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-white/[0.08]">
            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold dark:border-white/[0.1]">Cancel</button>
            <button type="submit" disabled={isSaving} className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:bg-amber-400 disabled:opacity-50">
              {isSaving ? 'Saving...' : editingPost ? 'Save changes' : 'Save post'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminBlogs;
