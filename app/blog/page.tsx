"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase, type BlogPost } from '@/lib/supabase';
import { BookOpen, Mic, ChefHat, TrendingUp, ArrowRight, Newspaper, Download } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';

const CATEGORIES = ['success_story', 'business_tip', 'recipe', 'podcast', 'blog'] as const;
type Category = typeof CATEGORIES[number];

const categoryMeta: Record<Category, { label: string; icon: React.ElementType; color: string }> = {
  success_story: { label: 'Success Story', icon: TrendingUp,  color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  business_tip:  { label: 'Business Tip',  icon: BookOpen,    color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  recipe:        { label: 'Recipe',         icon: ChefHat,     color: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  podcast:       { label: 'Podcast',        icon: Mic,         color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  blog:          { label: 'Blog',           icon: Newspaper,   color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Category | null>(null);

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (selected) query = query.eq('category', selected);

    query.then(({ data }) => {
      setPosts(data ?? []);
      setLoading(false);
    });
  }, [selected]);

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 bg-black overflow-hidden">
        <AnimatedBackground variant="default" />
        <div className="container mx-auto px-4 relative z-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Resources & Stories</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Success stories, business insights, cultural heritage, and inspiring conversations from our community
            </p>

            {/* Filter tabs */}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setSelected(null)}
                className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                  ${selected === null
                    ? 'bg-emerald-500 text-black border-emerald-500'
                    : 'border-border text-muted-foreground hover:border-emerald-500/50 hover:text-foreground'
                  }`}
              >
                All Posts
              </button>
              {CATEGORIES.map(cat => {
                const { label, icon: Icon } = categoryMeta[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setSelected(cat)}
                    className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                      ${selected === cat
                        ? 'bg-emerald-500 text-black border-emerald-500'
                        : 'border-border text-muted-foreground hover:border-emerald-500/50 hover:text-foreground'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                );
              })}
              <a
                href="/wevysya-logo.png"
                download="wevysya-logo.png"
                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold border border-border text-muted-foreground hover:border-emerald-500/50 hover:text-foreground transition-all duration-200"
              >
                <Download className="w-3.5 h-3.5" />
                Download Logo
              </a>
            </div>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-muted-foreground text-lg">No posts found in this category.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {posts.map((post, index) => {
                const cat = post.category as Category | undefined;
                const meta = cat ? categoryMeta[cat] : null;
                const Icon = meta?.icon ?? BookOpen;
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.07 }}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 flex flex-col"
                  >
                    {/* Cover image */}
                    {post.image_url && (
                      <div className="relative h-48 overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-1">
                      {/* Category badge */}
                      {meta && (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border w-fit mb-3 ${meta.color}`}>
                          <Icon className="w-3 h-3" />
                          {meta.label}
                        </span>
                      )}

                      <h2 className="font-bold text-foreground text-lg leading-snug line-clamp-2 mb-2 group-hover:text-emerald-400 transition-colors">
                        {post.title}
                      </h2>

                      {post.published_at && (
                        <p className="text-xs text-muted-foreground mb-3">
                          {format(new Date(post.published_at), 'MMMM d, yyyy')}
                        </p>
                      )}

                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">
                          {post.excerpt}
                        </p>
                      )}

                      <Button variant="ghost" size="sm" className="w-full mt-auto border border-border hover:border-emerald-500/50 hover:text-emerald-400">
                        Read More <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
