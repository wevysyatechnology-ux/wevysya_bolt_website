"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { LeadershipVideo, TestimonialVideo, EventVideo, BlogPost, LeadershipTeamMember } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { Users, Video, Star, Clapperboard, LogOut, Plus, Trash2, Save, LayoutDashboard, X, Menu, Upload, Image as ImageIcon, Loader as Loader2, CircleHelp as HelpCircle, GripVertical, Building2, CalendarDays, Newspaper, FileVideo } from 'lucide-react';
import { HouseManagement } from '@/components/admin/house-management';

type MembershipFaq = {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
};

type UpcomingEvent = {
  id: string;
  title: string;
  event_date: string;
  image_url: string;
  description: string;
  is_active: boolean;
  order_index: number;
};

type GlobalLeader = {
  id: string;
  role: string;
  name: string;
  image_url: string;
  is_active: boolean;
};

const GLOBAL_LEADER_ROLES = [
  'Global President',
  'Past President',
  'President Elect',
  'Council President',
] as const;

type Section = 'leaders' | 'leadership_team' | 'blog_posts' | 'leadership_videos' | 'testimonial_videos' | 'event_videos' | 'membership_faqs' | 'house_management' | 'upcoming_events';

const NAV_ITEMS: { key: Section; label: string; icon: React.ElementType; group?: string }[] = [
  { key: 'leaders', label: 'Global Leaders Network', icon: Users, group: 'Content' },
  { key: 'leadership_team', label: 'Leadership Team', icon: Users, group: 'Content' },
  { key: 'blog_posts', label: 'Blog Posts', icon: Newspaper, group: 'Content' },
  { key: 'leadership_videos', label: 'Meet Our Leaders', icon: Video, group: 'Content' },
  { key: 'testimonial_videos', label: 'Success Stories', icon: Star, group: 'Content' },
  { key: 'event_videos', label: 'Event Highlights', icon: Clapperboard, group: 'Content' },
  { key: 'upcoming_events', label: 'Upcoming Events', icon: CalendarDays, group: 'Content' },
  { key: 'membership_faqs', label: 'Membership FAQs', icon: HelpCircle, group: 'Content' },
  { key: 'house_management', label: 'House Management', icon: Building2, group: 'Organization' },
];

function emptyFaq(): Omit<MembershipFaq, 'id'> {
  return { question: '', answer: '', order_index: 0, is_active: true };
}

function emptyUpcomingEvent(): Omit<UpcomingEvent, 'id'> {
  return { title: '', event_date: new Date().toISOString().slice(0, 10), image_url: '', description: '', is_active: true, order_index: 0 };
}

function emptyLeadershipVideo(): Omit<LeadershipVideo, 'id'> {
  return { name: '', role: '', video_url: '', thumbnail_url: '', duration: 0, order_index: 0, is_active: true };
}
function emptyTestimonialVideo(): Omit<TestimonialVideo, 'id'> {
  return { member_name: '', business_name: '', city: '', video_url: '', thumbnail_url: '', duration: 0, order_index: 0, is_active: true };
}
function emptyEventVideo(): Omit<EventVideo, 'id'> {
  return { title: '', video_url: '', thumbnail_url: '', duration: 0, order_index: 0, is_active: true };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('leaders');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [faqs, setFaqs] = useState<MembershipFaq[]>([]);
  const [globalLeaders, setGlobalLeaders] = useState<GlobalLeader[]>([]);
  const [leadershipTeam, setLeadershipTeam] = useState<LeadershipTeamMember[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [leadershipVideos, setLeadershipVideos] = useState<LeadershipVideo[]>([]);
  const [testimonialVideos, setTestimonialVideos] = useState<TestimonialVideo[]>([]);
  const [eventVideos, setEventVideos] = useState<EventVideo[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchAll = useCallback(async () => {
    const [fq, gl, lt, bp, lv, tv, ev, ue] = await Promise.all([
      supabase.from('membership_faqs').select('*').order('order_index'),
      supabase.from('global_leaders').select('*'),
      supabase.from('leadership_team').select('*').order('order_index'),
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('leadership_videos').select('*').order('order_index'),
      supabase.from('testimonial_videos').select('*').order('order_index'),
      supabase.from('event_videos').select('*').order('order_index'),
      supabase.from('upcoming_events').select('*').order('order_index'),
    ]);
    if (fq.data) setFaqs(fq.data);
    if (gl.data) setGlobalLeaders(gl.data);
    if (lt.data) setLeadershipTeam(lt.data);
    if (bp.data) setBlogPosts(bp.data);
    if (lv.data) setLeadershipVideos(lv.data);
    if (tv.data) setTestimonialVideos(tv.data);
    if (ev.data) setEventVideos(ev.data);
    if (ue.data) setUpcomingEvents(ue.data);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  // ---- Generic CRUD helpers ----
  async function saveItem(table: string, item: Record<string, unknown>) {
    setSaving(true);
    const { id, created_at, updated_at, ...payload } = item as Record<string, unknown>;
    let error;
    if (id) {
      ({ error } = await supabase.from(table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id));
    } else if (table === 'global_leaders' && typeof payload.role === 'string') {
      ({ error } = await supabase
        .from(table)
        .upsert({ ...payload, updated_at: new Date().toISOString() }, { onConflict: 'role' }));
    } else {
      ({ error } = await supabase.from(table).insert(payload));
    }
    setSaving(false);
    if (error) { showToast('Error: ' + error.message); return; }
    showToast('Saved successfully!');
    fetchAll();
  }

  async function deleteItem(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message); return; }
    showToast('Deleted.');
    fetchAll();
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 bg-card border-r border-border flex flex-col shrink-0`}>
        <div className="p-5 border-b border-border">
          <Logo size="sm" showText />
        </div>
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {['Content', 'Organization'].map(group => {
            const groupItems = NAV_ITEMS.filter(n => n.group === group);
            return (
              <div key={group}>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-3 mb-2">{group}</p>
                <div className="space-y-1">
                  {groupItems.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left
                        ${activeSection === key
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center gap-3 px-4 bg-card shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <LayoutDashboard className="w-4 h-4 text-emerald-500" />
          <span className="font-semibold text-foreground text-sm">
            {NAV_ITEMS.find(n => n.key === activeSection)?.label}
          </span>
          {saving && <span className="ml-auto text-xs text-muted-foreground animate-pulse">Saving...</span>}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'leaders' && (
            <GlobalLeadersSection
              items={globalLeaders}
              onSave={(item) => saveItem('global_leaders', item as unknown as Record<string, unknown>)}
            />
          )}
          {activeSection === 'leadership_team' && (
            <LeadershipTeamSection
              items={leadershipTeam}
              onSave={(item) => saveItem('leadership_team', item as unknown as Record<string, unknown>)}
              onDelete={(id) => deleteItem('leadership_team', id)}
              onReorder={async (reordered) => {
                setSaving(true);
                await Promise.all(
                  reordered.map(m =>
                    supabase.from('leadership_team').update({
                      order_index: m.order_index,
                      team_section: m.team_section,
                      updated_at: new Date().toISOString(),
                    }).eq('id', m.id)
                  )
                );
                setSaving(false);
                showToast('Order saved!');
                fetchAll();
              }}
            />
          )}
          {activeSection === 'blog_posts' && (
            <BlogPostsSection
              items={blogPosts}
              onSave={(item) => saveItem('blog_posts', item as unknown as Record<string, unknown>)}
              onDelete={(id) => deleteItem('blog_posts', id)}
            />
          )}
          {activeSection === 'leadership_videos' && (
            <LeadershipVideosSection
              items={leadershipVideos}
              onSave={(item) => saveItem('leadership_videos', item as unknown as Record<string, unknown>)}
              onDelete={(id) => deleteItem('leadership_videos', id)}
            />
          )}
          {activeSection === 'testimonial_videos' && (
            <TestimonialVideosSection
              items={testimonialVideos}
              onSave={(item) => saveItem('testimonial_videos', item as unknown as Record<string, unknown>)}
              onDelete={(id) => deleteItem('testimonial_videos', id)}
            />
          )}
          {activeSection === 'event_videos' && (
            <EventVideosSection
              items={eventVideos}
              onSave={(item) => saveItem('event_videos', item as unknown as Record<string, unknown>)}
              onDelete={(id) => deleteItem('event_videos', id)}
            />
          )}
          {activeSection === 'house_management' && <HouseManagement />}
          {activeSection === 'upcoming_events' && (
            <UpcomingEventsSection
              items={upcomingEvents}
              onSave={(item) => saveItem('upcoming_events', item as unknown as Record<string, unknown>)}
              onDelete={(id) => deleteItem('upcoming_events', id)}
            />
          )}
          {activeSection === 'membership_faqs' && (
            <FaqsSection
              items={faqs}
              onSave={(item) => saveItem('membership_faqs', item as unknown as Record<string, unknown>)}
              onDelete={(id) => deleteItem('membership_faqs', id)}
              onReorder={async (reordered) => {
                setSaving(true);
                await Promise.all(
                  reordered.map((faq, i) =>
                    supabase.from('membership_faqs').update({ order_index: i, updated_at: new Date().toISOString() }).eq('id', faq.id)
                  )
                );
                setSaving(false);
                showToast('Order saved!');
                fetchAll();
              }}
            />
          )}
        </main>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 bg-emerald-500 text-black font-semibold px-5 py-3 rounded-xl shadow-lg text-sm z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== Leadership Team Section =====
const LEADERSHIP_TEAM_SECTIONS = [
  'Governing Council',
  'Global Executive Board',
  'Global Support Team',
  'State Team',
  'Zonal Team',
] as const;

function emptyLeadershipTeamMember(): Omit<LeadershipTeamMember, 'id' | 'created_at' | 'updated_at'> {
  return { name: '', designation: '', bio: '', photo_url: '', team_section: 'Governing Council', order_index: 0, is_active: true };
}

// Stable top-level card — never re-mounts mid-drag
function LeaderMemberCard({
  member,
  draggingId,
  dragOverId,
  showSection,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onEdit,
  onDelete,
}: {
  member: LeadershipTeamMember;
  draggingId: string | null;
  dragOverId: string | null;
  showSection: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (e: React.DragEvent, id: string, section: string) => void;
  onDragEnd: () => void;
  onEdit: (m: LeadershipTeamMember) => void;
  onDelete: (id: string) => void;
}) {
  const isDragging = draggingId === member.id;
  const isDragOver = dragOverId === member.id && draggingId !== member.id;
  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, member.id)}
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, member.id); }}
      onDrop={e => { e.preventDefault(); e.stopPropagation(); onDrop(e, member.id, member.team_section); }}
      onDragEnd={onDragEnd}
      className={`bg-card border rounded-2xl overflow-hidden transition-all duration-150 group cursor-grab active:cursor-grabbing select-none
        ${isDragging ? 'opacity-30 border-emerald-500/60 scale-95' : ''}
        ${isDragOver && !isDragging ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-[1.02]' : ''}
        ${!isDragging && !isDragOver ? 'border-border hover:border-emerald-500/40' : ''}
      `}
    >
      <div className="relative w-full bg-muted overflow-hidden" style={{ aspectRatio: '1/1' }}>
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-md p-1 pointer-events-none">
          <GripVertical className="w-3.5 h-3.5 text-white" />
        </div>
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 pointer-events-none">
            <span className="text-white font-bold text-3xl">{member.name.charAt(0)}</span>
          </div>
        )}
        <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium border pointer-events-none ${member.is_active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-muted text-muted-foreground border-border'}`}>
          {member.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>
      <div className="p-3 space-y-0.5">
        {showSection && <p className="text-xs text-teal-500/80 font-medium truncate">{member.team_section}</p>}
        <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wide truncate leading-tight">{member.designation}</p>
        <p className="font-semibold text-foreground text-sm truncate">{member.name || <span className="text-muted-foreground italic">Unnamed</span>}</p>
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(member)} className="flex-1 h-7 text-xs">Edit</Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(member.id)} className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 shrink-0">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function LeadershipTeamSection({
  items,
  onSave,
  onDelete,
  onReorder,
}: {
  items: LeadershipTeamMember[];
  onSave: (item: LeadershipTeamMember | Omit<LeadershipTeamMember, 'id' | 'created_at' | 'updated_at'>) => void;
  onDelete: (id: string) => void;
  onReorder: (reordered: Pick<LeadershipTeamMember, 'id' | 'order_index' | 'team_section'>[]) => void;
}) {
  const [editing, setEditing] = useState<(LeadershipTeamMember | Omit<LeadershipTeamMember, 'id' | 'created_at' | 'updated_at'>) | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('All');

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  // Tracks which section container the cursor is over (for cross-section empty-zone drops)
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  // Counter-based enter/leave tracking per section to avoid false leave events from child elements
  const dragEnterCounters = useRef<Record<string, number>>({});

  const tabs = ['All', ...LEADERSHIP_TEAM_SECTIONS];

  const sortedItems = [...items].sort((a, b) => {
    const si = LEADERSHIP_TEAM_SECTIONS.indexOf(a.team_section as typeof LEADERSHIP_TEAM_SECTIONS[number]);
    const ti = LEADERSHIP_TEAM_SECTIONS.indexOf(b.team_section as typeof LEADERSHIP_TEAM_SECTIONS[number]);
    if (si !== ti) return si - ti;
    return a.order_index - b.order_index;
  });

  const populatedSections = LEADERSHIP_TEAM_SECTIONS.filter(s => items.some(m => m.team_section === s));

  function handleDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    // Defer so the drag ghost captures the un-faded element
    setTimeout(() => setDraggingId(id), 0);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (dragOverId !== id) setDragOverId(id);
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
    setDragOverSection(null);
    dragEnterCounters.current = {};
  }

  function handleCardDrop(e: React.DragEvent, targetId: string, targetSection: string) {
    e.preventDefault();
    e.stopPropagation();
    const srcId = e.dataTransfer.getData('text/plain') || draggingId;
    setDraggingId(null); setDragOverId(null); setDragOverSection(null);
    if (!srcId || srcId === targetId) return;
    applyReorder(srcId, targetId, targetSection);
  }

  function handleSectionDragEnter(e: React.DragEvent, section: string) {
    e.preventDefault();
    dragEnterCounters.current[section] = (dragEnterCounters.current[section] || 0) + 1;
    setDragOverSection(section);
  }

  function handleSectionDragLeave(e: React.DragEvent, section: string) {
    dragEnterCounters.current[section] = (dragEnterCounters.current[section] || 1) - 1;
    if (dragEnterCounters.current[section] <= 0) {
      dragEnterCounters.current[section] = 0;
      setDragOverSection(prev => prev === section ? null : prev);
    }
  }

  function handleSectionDrop(e: React.DragEvent, section: string) {
    e.preventDefault();
    const srcId = e.dataTransfer.getData('text/plain') || draggingId;
    dragEnterCounters.current[section] = 0;
    setDraggingId(null); setDragOverId(null); setDragOverSection(null);
    if (!srcId) return;
    const src = items.find(m => m.id === srcId);
    if (!src || src.team_section === section) return;
    // Append to end of target section
    const sectionItems = items.filter(m => m.team_section === section);
    onReorder([{ id: srcId, order_index: sectionItems.length, team_section: section }]);
  }

  function applyReorder(srcId: string, tgtId: string, tgtSection: string) {
    const src = items.find(m => m.id === srcId);
    if (!src) return;

    const affectedSections = Array.from(new Set([src.team_section, tgtSection]));
    const sectionMap: Record<string, LeadershipTeamMember[]> = {};
    affectedSections.forEach(s => {
      sectionMap[s] = items.filter(m => m.team_section === s).sort((a, b) => a.order_index - b.order_index);
    });

    // Remove from source section
    sectionMap[src.team_section] = sectionMap[src.team_section].filter(m => m.id !== srcId);

    // Insert before target in target section
    const tgtList = sectionMap[tgtSection];
    const tgtIdx = tgtList.findIndex(m => m.id === tgtId);
    tgtList.splice(tgtIdx === -1 ? tgtList.length : tgtIdx, 0, { ...src, team_section: tgtSection });

    // Collect changed items
    const updates: Pick<LeadershipTeamMember, 'id' | 'order_index' | 'team_section'>[] = [];
    affectedSections.forEach(s => {
      sectionMap[s].forEach((m, i) => {
        const orig = items.find(x => x.id === m.id);
        if (!orig || orig.order_index !== i || orig.team_section !== s) {
          updates.push({ id: m.id, order_index: i, team_section: s });
        }
      });
    });

    if (updates.length > 0) onReorder(updates);
  }

  const cardProps = {
    draggingId,
    dragOverId,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDrop: handleCardDrop,
    onDragEnd: handleDragEnd,
    onEdit: (m: LeadershipTeamMember) => setEditing({ ...m }),
    onDelete: (id: string) => setConfirmingId(id),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Leadership Team</h2>
          <p className="text-muted-foreground text-sm mt-1">Drag cards to reorder or move between sections</p>
        </div>
        <Button onClick={() => setEditing(emptyLeadershipTeamMember())} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add Member
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
              ${activeTab === tab
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                : 'text-muted-foreground border-border hover:border-emerald-500/30 hover:text-foreground'
              }`}
          >
            {tab}
            <span className="ml-1.5 opacity-60">
              {tab === 'All' ? items.length : items.filter(m => m.team_section === tab).length}
            </span>
          </button>
        ))}
      </div>

      {editing && (
        <ItemForm
          title={'id' in editing ? 'Edit Member' : 'Add New Member'}
          onClose={() => setEditing(null)}
          onSubmit={() => { onSave(editing); setEditing(null); }}
        >
          <FormField label="Name" value={(editing as LeadershipTeamMember).name} onChange={v => setEditing({ ...editing, name: v })} />
          <FormField label="Designation / Role" value={(editing as LeadershipTeamMember).designation} onChange={v => setEditing({ ...editing, designation: v })} />
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Team Section</Label>
            <select
              value={(editing as LeadershipTeamMember).team_section}
              onChange={e => setEditing({ ...editing, team_section: e.target.value })}
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {LEADERSHIP_TEAM_SECTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <FormField label="Order" type="number" value={String((editing as LeadershipTeamMember).order_index ?? 0)} onChange={v => setEditing({ ...editing, order_index: parseInt(v) || 0 })} />
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground">Bio</Label>
            <textarea
              value={(editing as LeadershipTeamMember).bio}
              onChange={e => setEditing({ ...editing, bio: e.target.value })}
              placeholder="Brief bio..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
          <ToggleField label="Active" value={(editing as LeadershipTeamMember).is_active} onChange={v => setEditing({ ...editing, is_active: v })} />
          <ImageUploadField label="Photo" value={(editing as LeadershipTeamMember).photo_url} onChange={v => setEditing({ ...editing, photo_url: v })} folder="leadership-team" />
        </ItemForm>
      )}

      {/* ---- All view: grouped sections with cross-section drag ---- */}
      {activeTab === 'All' ? (
        <div className="space-y-6">
          {populatedSections.map(section => {
            const sectionMembers = sortedItems.filter(m => m.team_section === section);
            const src = draggingId ? items.find(m => m.id === draggingId) ?? null : null;
            const isIncoming = dragOverSection === section && src !== null && src.team_section !== section;
            return (
              <div
                key={section}
                onDragEnter={e => handleSectionDragEnter(e, section)}
                onDragLeave={e => handleSectionDragLeave(e, section)}
                onDragOver={e => { e.preventDefault(); }}
                onDrop={e => handleSectionDrop(e, section)}
                className={`rounded-xl p-4 border transition-colors duration-150
                  ${isIncoming ? 'border-emerald-400/70 bg-emerald-500/5' : 'border-border/40 bg-card/30'}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-sm font-semibold text-foreground">{section}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{sectionMembers.length}</span>
                  {isIncoming && <span className="ml-auto text-xs text-emerald-400 font-medium animate-pulse">Drop to move here</span>}
                </div>
                {sectionMembers.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-8 border border-dashed border-border/60 rounded-lg">
                    Drop a member here
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {sectionMembers.map(member => (
                      <LeaderMemberCard key={member.id} member={member} showSection={false} {...cardProps} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* ---- Single section view ---- */
        <div>
          {sortedItems.filter(m => m.team_section === activeTab).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl text-sm">
              No members yet. Click &quot;Add Member&quot; to create one.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {sortedItems.filter(m => m.team_section === activeTab).map(member => (
                <LeaderMemberCard key={member.id} member={member} showSection={false} {...cardProps} />
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {confirmingId && (
          <ConfirmDialog
            onConfirm={() => { onDelete(confirmingId); setConfirmingId(null); }}
            onCancel={() => setConfirmingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


// ===== Blog Posts Section =====
const BLOG_CATEGORIES = [
  { value: 'blog',          label: 'Blog' },
  { value: 'success_story', label: 'Success Story' },
  { value: 'business_tip',  label: 'Business Tip' },
  { value: 'recipe',        label: 'Recipe' },
  { value: 'podcast',       label: 'Podcast' },
] as const;

type BlogCategory = typeof BLOG_CATEGORIES[number]['value'];

function emptyBlogPost(): Omit<BlogPost, 'id' | 'created_at'> {
  return {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'blog',
    image_url: '',
    published: false,
    published_at: new Date().toISOString().slice(0, 10),
  };
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function BlogPostsSection({
  items,
  onSave,
  onDelete,
}: {
  items: BlogPost[];
  onSave: (item: BlogPost | Omit<BlogPost, 'id' | 'created_at'>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<(BlogPost | Omit<BlogPost, 'id' | 'created_at'>) | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function handleTitleChange(title: string) {
    if (!editing) return;
    const hasId = 'id' in editing;
    setEditing({ ...editing, title, slug: hasId ? (editing as BlogPost).slug : slugify(title) });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Blog Posts</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage posts shown on the Resources page</p>
        </div>
        <Button onClick={() => setEditing(emptyBlogPost())} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-emerald-500/30 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-foreground">{'id' in editing ? 'Edit Post' : 'New Post'}</h3>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">Title</Label>
              <Input
                value={(editing as BlogPost).title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Post title..."
                className="h-9 text-sm"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">Slug (URL)</Label>
              <Input
                value={(editing as BlogPost).slug}
                onChange={e => setEditing({ ...editing, slug: e.target.value })}
                placeholder="post-url-slug"
                className="h-9 text-sm font-mono"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Category</Label>
              <select
                value={(editing as BlogPost).category ?? 'blog'}
                onChange={e => setEditing({ ...editing, category: e.target.value as BlogCategory })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {BLOG_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Published date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Publish Date</Label>
              <Input
                type="date"
                value={((editing as BlogPost).published_at ?? '').slice(0, 10)}
                onChange={e => setEditing({ ...editing, published_at: e.target.value })}
                className="h-9 text-sm"
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">Excerpt</Label>
              <textarea
                value={(editing as BlogPost).excerpt ?? ''}
                onChange={e => setEditing({ ...editing, excerpt: e.target.value })}
                placeholder="Short description shown on cards..."
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">Content</Label>
              <textarea
                value={(editing as BlogPost).content ?? ''}
                onChange={e => setEditing({ ...editing, content: e.target.value })}
                placeholder="Full post content..."
                rows={6}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Image */}
            <ImageUploadField
              label="Cover Image"
              value={(editing as BlogPost).image_url ?? ''}
              onChange={v => setEditing({ ...editing, image_url: v })}
              folder="blog"
            />

            {/* Published toggle */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Published</Label>
              <button
                type="button"
                onClick={() => setEditing({ ...editing, published: !(editing as BlogPost).published })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${(editing as BlogPost).published ? 'bg-emerald-500' : 'bg-muted'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(editing as BlogPost).published ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-6 justify-end">
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => { onSave(editing); setEditing(null); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </motion.div>
      )}

      {/* Posts list */}
      <div className="space-y-2">
        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl text-sm">
            No posts yet. Click &quot;New Post&quot; to create one.
          </div>
        )}
        {items.map((post, i) => {
          const cat = BLOG_CATEGORIES.find(c => c.value === post.category);
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl p-4 hover:border-emerald-500/40 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg border border-border bg-muted overflow-hidden shrink-0">
                  {post.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Newspaper className="w-6 h-6 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {cat && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {cat.label}
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${post.published ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' : 'bg-muted text-muted-foreground border-border'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground text-sm truncate">{post.title || '—'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{post.excerpt}</p>
                  {post.published_at && (
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      {new Date(post.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => setEditing(post)} className="h-8 text-xs">Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmingId(post.id)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {confirmingId && (
          <ConfirmDialog
            onConfirm={() => { onDelete(confirmingId); setConfirmingId(null); }}
            onCancel={() => setConfirmingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== Global Leaders Section (4 fixed roles) =====
function GlobalLeadersSection({
  items,
  onSave,
}: {
  items: GlobalLeader[];
  onSave: (item: GlobalLeader) => void;
}) {
  const [editing, setEditing] = useState<GlobalLeader | null>(null);

  // Build one card per fixed role
  const cards = GLOBAL_LEADER_ROLES.map(role => {
    const match = items.find(l => l.role === role);
    return match ?? { id: '', role, name: '', image_url: '', is_active: false };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Global Leaders Network</h2>
        <p className="text-muted-foreground text-sm mt-1">Edit the 4 fixed leadership roles shown on the homepage</p>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-emerald-500/30 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-foreground">Edit — {editing.role}</h3>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Name" value={editing.name} onChange={v => setEditing({ ...editing, name: v })} />
            <ToggleField label="Active" value={editing.is_active} onChange={v => setEditing({ ...editing, is_active: v })} />
            <ImageUploadField label="Photo" value={editing.image_url} onChange={v => setEditing({ ...editing, image_url: v })} folder="global-leaders" />
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => { onSave(editing); setEditing(null); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.role}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all group"
          >
            {/* Image */}
            <div className="relative w-full bg-muted overflow-hidden" style={{ aspectRatio: '3/4' }}>
              {card.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={card.image_url} alt={card.name || card.role} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-muted-foreground/30" />
                </div>
              )}
              <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium border ${card.is_active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-muted text-muted-foreground border-border'}`}>
                {card.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-xs text-emerald-500 font-semibold uppercase tracking-wide">{card.role}</p>
              <p className="font-semibold text-foreground text-sm truncate">{card.name || <span className="text-muted-foreground italic">Not set</span>}</p>
              <div className="pt-2">
                <Button size="sm" variant="outline" onClick={() => setEditing({ ...card })} className="w-full h-8 text-xs">Edit</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ===== Leadership Videos Section =====
function LeadershipVideosSection({
  items,
  onSave,
  onDelete,
}: {
  items: LeadershipVideo[];
  onSave: (item: LeadershipVideo | Omit<LeadershipVideo, 'id'>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<(LeadershipVideo | Omit<LeadershipVideo, 'id'>) | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Meet Our Leaders</h2>
          <p className="text-muted-foreground text-sm mt-1">Leadership video testimonials shown on the homepage</p>
        </div>
        <Button onClick={() => setEditing(emptyLeadershipVideo())} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      {editing && (
        <ItemForm
          title={'id' in editing ? 'Edit Video' : 'Add New Video'}
          onClose={() => setEditing(null)}
          onSubmit={() => { onSave(editing); setEditing(null); }}
        >
          <FormField label="Leader Name" value={(editing as LeadershipVideo).name} onChange={v => setEditing({ ...editing, name: v })} />
          <FormField label="Role / Title" value={(editing as LeadershipVideo).role} onChange={v => setEditing({ ...editing, role: v })} />
          <VideoUploadField label="Video" value={(editing as LeadershipVideo).video_url} onChange={v => setEditing({ ...editing, video_url: v })} folder="leadership-videos" />
          <FormField label="Duration (seconds)" type="number" value={String((editing as LeadershipVideo).duration ?? 0)} onChange={v => setEditing({ ...editing, duration: parseInt(v) || 0 })} />
          <FormField label="Order" type="number" value={String((editing as LeadershipVideo).order_index ?? 0)} onChange={v => setEditing({ ...editing, order_index: parseInt(v) || 0 })} />
          <ToggleField label="Active" value={(editing as LeadershipVideo).is_active ?? true} onChange={v => setEditing({ ...editing, is_active: v })} />
          <ImageUploadField label="Thumbnail" value={(editing as LeadershipVideo).thumbnail_url ?? ''} onChange={v => setEditing({ ...editing, thumbnail_url: v })} folder="leadership-videos" />
        </ItemForm>
      )}

      <ItemGrid>
        {items.map(item => (
          <ItemCard
            key={item.id}
            title={item.name}
            subtitle={item.role}
            meta={item.video_url}
            isActive={item.is_active ?? true}
            imageUrl={item.thumbnail_url}
            isVideo
            onEdit={() => setEditing(item)}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </ItemGrid>
    </div>
  );
}

// ===== Testimonial Videos Section =====
function TestimonialVideosSection({
  items,
  onSave,
  onDelete,
}: {
  items: TestimonialVideo[];
  onSave: (item: TestimonialVideo | Omit<TestimonialVideo, 'id'>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<(TestimonialVideo | Omit<TestimonialVideo, 'id'>) | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Success Stories</h2>
          <p className="text-muted-foreground text-sm mt-1">Member testimonial videos displayed on homepage</p>
        </div>
        <Button onClick={() => setEditing(emptyTestimonialVideo())} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      {editing && (
        <ItemForm
          title={'id' in editing ? 'Edit Video' : 'Add New Video'}
          onClose={() => setEditing(null)}
          onSubmit={() => { onSave(editing); setEditing(null); }}
        >
          <FormField label="Member Name" value={(editing as TestimonialVideo).member_name} onChange={v => setEditing({ ...editing, member_name: v })} />
          <FormField label="Business Name" value={(editing as TestimonialVideo).business_name ?? ''} onChange={v => setEditing({ ...editing, business_name: v })} />
          <FormField label="City" value={(editing as TestimonialVideo).city ?? ''} onChange={v => setEditing({ ...editing, city: v })} />
          <VideoUploadField label="Video" value={(editing as TestimonialVideo).video_url} onChange={v => setEditing({ ...editing, video_url: v })} folder="testimonial-videos" />
          <FormField label="Duration (seconds)" type="number" value={String((editing as TestimonialVideo).duration ?? 0)} onChange={v => setEditing({ ...editing, duration: parseInt(v) || 0 })} />
          <FormField label="Order" type="number" value={String((editing as TestimonialVideo).order_index ?? 0)} onChange={v => setEditing({ ...editing, order_index: parseInt(v) || 0 })} />
          <ToggleField label="Active" value={(editing as TestimonialVideo).is_active ?? true} onChange={v => setEditing({ ...editing, is_active: v })} />
          <ImageUploadField label="Thumbnail" value={(editing as TestimonialVideo).thumbnail_url ?? ''} onChange={v => setEditing({ ...editing, thumbnail_url: v })} folder="testimonial-videos" />
        </ItemForm>
      )}

      <ItemGrid>
        {items.map(item => (
          <ItemCard
            key={item.id}
            title={item.member_name}
            subtitle={item.business_name ?? ''}
            meta={item.city ?? ''}
            isActive={item.is_active ?? true}
            imageUrl={item.thumbnail_url}
            isVideo
            onEdit={() => setEditing(item)}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </ItemGrid>
    </div>
  );
}

// ===== Event Videos Section =====
function EventVideosSection({
  items,
  onSave,
  onDelete,
}: {
  items: EventVideo[];
  onSave: (item: EventVideo | Omit<EventVideo, 'id'>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<(EventVideo | Omit<EventVideo, 'id'>) | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Event Highlights</h2>
          <p className="text-muted-foreground text-sm mt-1">Event highlight videos shown on the homepage</p>
        </div>
        <Button onClick={() => setEditing(emptyEventVideo())} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      {editing && (
        <ItemForm
          title={'id' in editing ? 'Edit Video' : 'Add New Video'}
          onClose={() => setEditing(null)}
          onSubmit={() => { onSave(editing); setEditing(null); }}
        >
          <FormField label="Title" value={(editing as EventVideo).title} onChange={v => setEditing({ ...editing, title: v })} />
          <VideoUploadField label="Video" value={(editing as EventVideo).video_url} onChange={v => setEditing({ ...editing, video_url: v })} folder="event-videos" />
          <FormField label="Duration (seconds)" type="number" value={String((editing as EventVideo).duration ?? 0)} onChange={v => setEditing({ ...editing, duration: parseInt(v) || 0 })} />
          <FormField label="Order" type="number" value={String((editing as EventVideo).order_index ?? 0)} onChange={v => setEditing({ ...editing, order_index: parseInt(v) || 0 })} />
          <ToggleField label="Active" value={(editing as EventVideo).is_active ?? true} onChange={v => setEditing({ ...editing, is_active: v })} />
          <ImageUploadField label="Thumbnail" value={(editing as EventVideo).thumbnail_url ?? ''} onChange={v => setEditing({ ...editing, thumbnail_url: v })} folder="event-videos" />
        </ItemForm>
      )}

      <ItemGrid>
        {items.map(item => (
          <ItemCard
            key={item.id}
            title={item.title}
            subtitle=""
            meta={item.video_url}
            isActive={item.is_active ?? true}
            imageUrl={item.thumbnail_url}
            isVideo
            onEdit={() => setEditing(item)}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </ItemGrid>
    </div>
  );
}

// ===== Upcoming Events Section =====
function UpcomingEventsSection({
  items,
  onSave,
  onDelete,
}: {
  items: UpcomingEvent[];
  onSave: (item: UpcomingEvent | Omit<UpcomingEvent, 'id'>) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<(UpcomingEvent | Omit<UpcomingEvent, 'id'>) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const filename = `upcoming-events/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
    if (error) { setUploading(false); return; }
    const { data } = supabase.storage.from('media').getPublicUrl(filename);
    if (editing) setEditing({ ...editing, image_url: data.publicUrl });
    setUploading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Upcoming Events</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage events shown on the public Events page</p>
        </div>
        <Button onClick={() => setEditing(emptyUpcomingEvent())} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-emerald-500/30 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-foreground">{'id' in editing ? 'Edit Event' : 'Add New Event'}</h3>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Event Title</Label>
              <Input
                value={(editing as UpcomingEvent).title}
                onChange={e => setEditing({ ...editing, title: e.target.value })}
                placeholder="e.g. WeVysya Annual Summit 2026"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Event Date</Label>
              <Input
                type="date"
                value={(editing as UpcomingEvent).event_date}
                onChange={e => setEditing({ ...editing, event_date: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Description</Label>
              <textarea
                value={(editing as UpcomingEvent).description}
                onChange={e => setEditing({ ...editing, description: e.target.value })}
                placeholder="Brief description of the event..."
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Event Image (3:4 portrait ratio)</Label>
              <div className="flex gap-4 items-start">
                {/* Preview at 3:4 */}
                <div className="w-24 shrink-0" style={{ aspectRatio: '3/4' }}>
                  <div className="w-full h-full rounded-xl border border-border bg-muted overflow-hidden flex items-center justify-center">
                    {(editing as UpcomingEvent).image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={(editing as UpcomingEvent).image_url} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-border hover:border-emerald-500/50 bg-muted/50 hover:bg-emerald-500/5 text-sm text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 w-full justify-center"
                  >
                    {uploading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="w-4 h-4" /> Click to upload image</>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                  />
                  <Input
                    type="text"
                    placeholder="Or paste image URL..."
                    value={(editing as UpcomingEvent).image_url}
                    onChange={e => setEditing({ ...editing, image_url: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <ToggleField label="Active" value={(editing as UpcomingEvent).is_active} onChange={v => setEditing({ ...editing, is_active: v })} />
            </div>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => { onSave(editing); setEditing(null); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl text-sm">
            No upcoming events yet. Click &quot;Add Event&quot; to create one.
          </div>
        )}
        {items.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all group"
          >
            {/* Image at 3:4 */}
            <div style={{ aspectRatio: '3/4' }} className="w-full bg-muted relative overflow-hidden">
              {event.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-muted-foreground opacity-30" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${event.is_active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-muted text-muted-foreground border-border'}`}>
                  {event.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <p className="font-semibold text-foreground text-sm leading-tight line-clamp-2">{event.title}</p>
              <p className="text-xs text-emerald-400 font-medium">
                {event.event_date ? new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => setEditing(event)} className="flex-1 h-7 text-xs">Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmingId(event.id)} className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {confirmingId && (
          <ConfirmDialog
            onConfirm={() => { onDelete(confirmingId); setConfirmingId(null); }}
            onCancel={() => setConfirmingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== FAQs Section =====
function FaqsSection({
  items,
  onSave,
  onDelete,
  onReorder,
}: {
  items: MembershipFaq[];
  onSave: (item: MembershipFaq | Omit<MembershipFaq, 'id'>) => void;
  onDelete: (id: string) => void;
  onReorder: (reordered: MembershipFaq[]) => void;
}) {
  const [editing, setEditing] = useState<(MembershipFaq | Omit<MembershipFaq, 'id'>) | null>(null);
  const [localItems, setLocalItems] = useState<MembershipFaq[]>(items);
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => { setLocalItems(items); }, [items]);

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOver(index);
    if (dragIndex.current === null || dragIndex.current === index) return;
    const reordered = [...localItems];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    dragIndex.current = index;
    setLocalItems(reordered);
  }

  function handleDragEnd() {
    setDragOver(null);
    dragIndex.current = null;
    onReorder(localItems);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Membership FAQs</h2>
          <p className="text-muted-foreground text-sm mt-1">Drag to reorder &middot; Manage the FAQ section displayed on the Membership page</p>
        </div>
        <Button onClick={() => setEditing(emptyFaq())} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-emerald-500/30 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-foreground">{'id' in editing ? 'Edit FAQ' : 'Add New FAQ'}</h3>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Question</Label>
              <Input
                value={(editing as MembershipFaq).question}
                onChange={e => setEditing({ ...editing, question: e.target.value })}
                placeholder="e.g. How do I apply for membership?"
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Answer</Label>
              <textarea
                value={(editing as MembershipFaq).answer}
                onChange={e => setEditing({ ...editing, answer: e.target.value })}
                placeholder="Provide a clear, helpful answer..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>
            <div className="flex justify-end">
              <ToggleField label="Active" value={(editing as MembershipFaq).is_active} onChange={v => setEditing({ ...editing, is_active: v })} />
            </div>
          </div>
          <div className="flex gap-3 mt-6 justify-end">
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button
              onClick={() => { onSave(editing); setEditing(null); }}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2"
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        {localItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
            No FAQs yet. Click &quot;Add FAQ&quot; to create one.
          </div>
        )}
        {localItems.map((faq, i) => (
          <div
            key={faq.id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={e => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`bg-card border rounded-xl p-4 transition-all cursor-grab active:cursor-grabbing select-none
              ${dragOver === i ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 scale-[1.01]' : 'border-border hover:border-emerald-500/40'}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center justify-center pt-1 text-muted-foreground/50 hover:text-muted-foreground shrink-0">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${faq.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-muted text-muted-foreground border border-border'}`}>
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="font-semibold text-foreground text-sm">{faq.question}</p>
                <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" variant="outline" onClick={() => setEditing(faq)} className="h-8 text-xs">Edit</Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmingId(faq.id)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {confirmingId && (
          <ConfirmDialog
            onConfirm={() => { onDelete(confirmingId); setConfirmingId(null); }}
            onCancel={() => setConfirmingId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== Confirm Dialog =====
function ConfirmDialog({
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  onConfirm,
  onCancel,
}: {
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 shadow-2xl shadow-black/50"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 border border-destructive/30 mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-destructive" />
        </div>
        <h3 className="text-center font-bold text-foreground text-lg mb-2">Delete Item</h3>
        <p className="text-center text-muted-foreground text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
          >
            Delete
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ===== Shared UI Components =====

function ItemGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </div>
  );
}

function ItemCard({
  title, subtitle, meta, isActive, imageUrl, isVideo = false, onEdit, onDelete,
}: {
  title: string; subtitle: string; meta: string; isActive: boolean;
  imageUrl?: string; isVideo?: boolean; onEdit: () => void; onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden group hover:border-emerald-500/40 transition-all duration-200"
      >
        <div className="relative h-36 bg-muted overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              {isVideo ? <Video className="w-10 h-10" /> : <Users className="w-10 h-10" />}
            </div>
          )}
          <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-muted text-muted-foreground border border-border'}`}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm truncate">{title || '—'}</h3>
          {subtitle && <p className="text-emerald-500 text-xs truncate mt-0.5">{subtitle}</p>}
          {meta && <p className="text-muted-foreground text-xs truncate mt-0.5">{meta}</p>}
          <div className="flex gap-2 mt-4">
            <Button size="sm" variant="outline" onClick={onEdit} className="flex-1 h-8 text-xs">Edit</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(true)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {confirming && (
          <ConfirmDialog
            onConfirm={() => { setConfirming(false); onDelete(); }}
            onCancel={() => setConfirming(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ItemForm({
  title, children, onClose, onSubmit,
}: {
  title: string; children: React.ReactNode; onClose: () => void; onSubmit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-emerald-500/30 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-foreground">{title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
      <div className="flex gap-3 mt-6 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Save className="w-4 h-4" /> Save
        </Button>
      </div>
    </motion.div>
  );
}

function FormField({
  label, value, onChange, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input type={type} value={value} onChange={e => onChange(e.target.value)} className="h-9 text-sm" />
    </div>
  );
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-emerald-500' : 'bg-muted'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

function ImageUploadField({
  label,
  value,
  onChange,
  folder = 'leaders',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
    if (uploadError) {
      setError('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(filename);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div className="w-20 h-20 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-emerald-500/50 bg-muted/50 hover:bg-emerald-500/5 text-sm text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 w-full justify-center"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-4 h-4" /> Click to upload image</>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
          {/* Manual URL fallback */}
          <Input
            type="text"
            placeholder="Or paste image URL..."
            value={value}
            onChange={e => onChange(e.target.value)}
            className="h-8 text-xs"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  );
}

function VideoUploadField({
  label,
  value,
  onChange,
  folder = 'videos',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  folder?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
    if (uploadError) {
      setError('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from('media').getPublicUrl(filename);
    onChange(data.publicUrl);
    setUploading(false);
  }

  const fileName = value ? value.split('/').pop()?.split('?')[0] : '';

  return (
    <div className="space-y-1.5 sm:col-span-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex gap-3 items-start">
        {/* Preview */}
        <div className="w-20 h-20 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {value ? (
            <video src={value} className="w-full h-full object-cover" muted />
          ) : (
            <FileVideo className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border hover:border-emerald-500/50 bg-muted/50 hover:bg-emerald-500/5 text-sm text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 w-full justify-center"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-4 h-4" /> Click to upload video</>  
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
          />
          <Input
            type="text"
            placeholder="Or paste video URL..."
            value={value}
            onChange={e => onChange(e.target.value)}
            className="h-8 text-xs"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
          {value && !uploading && fileName && (
            <p className="text-xs text-emerald-400 truncate" title={fileName}>{fileName}</p>
          )}
        </div>
      </div>
    </div>
  );
}
