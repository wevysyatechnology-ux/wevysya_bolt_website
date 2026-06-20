"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save, X, ChevronRight, Chrome as Home, MapPin, Globe, Map, Upload, Image as ImageIcon, Loader as Loader2, Pencil, Crown, BookOpen, Wallet, ArrowLeft } from 'lucide-react';

// ---- Types ----
type Country = { id: string; name: string; is_active: boolean };
type State = { id: string; country_id: string; name: string; is_active: boolean };
type Zone = { id: string; state_id: string; name: string; is_active: boolean };
type House = { id: string; zone_id: string; name: string; is_active: boolean };
type HouseMember = {
  id: string;
  house_id: string;
  role: 'president' | 'secretary' | 'treasurer';
  name: string;
  industry: string;
  photo_url: string;
  is_active: boolean;
};

type Level = 'country' | 'state' | 'zone' | 'house' | 'members';

const ROLE_CONFIG = {
  president: { label: 'House President', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  secretary: { label: 'House Secretary', icon: BookOpen, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
  treasurer: { label: 'House Treasurer', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
};

// ---- Main Component ----
export function HouseManagement() {
  const [level, setLevel] = useState<Level>('country');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [members, setMembers] = useState<HouseMember[]>([]);

  const [toast, setToast] = useState('');
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchCountries = useCallback(async () => {
    const { data } = await supabase.from('hm_countries').select('*').order('name');
    if (data) setCountries(data);
  }, []);

  const fetchStates = useCallback(async (countryId: string) => {
    const { data } = await supabase.from('hm_states').select('*').eq('country_id', countryId).order('name');
    if (data) setStates(data);
  }, []);

  const fetchZones = useCallback(async (stateId: string) => {
    const { data } = await supabase.from('hm_zones').select('*').eq('state_id', stateId).order('name');
    if (data) setZones(data);
  }, []);

  const fetchHouses = useCallback(async (zoneId: string) => {
    const { data } = await supabase.from('hm_houses').select('*').eq('zone_id', zoneId).order('name');
    if (data) setHouses(data);
  }, []);

  const fetchMembers = useCallback(async (houseId: string) => {
    const { data } = await supabase.from('hm_house_members').select('*').eq('house_id', houseId);
    if (data) setMembers(data);
  }, []);

  useEffect(() => { fetchCountries(); }, [fetchCountries]);

  function drillDown(item: Country | State | Zone | House, nextLevel: Level) {
    if (nextLevel === 'state') {
      setSelectedCountry(item as Country);
      fetchStates(item.id);
    } else if (nextLevel === 'zone') {
      setSelectedState(item as State);
      fetchZones(item.id);
    } else if (nextLevel === 'house') {
      setSelectedZone(item as Zone);
      fetchHouses(item.id);
    } else if (nextLevel === 'members') {
      setSelectedHouse(item as House);
      fetchMembers(item.id);
    }
    setLevel(nextLevel);
  }

  function goBack() {
    if (level === 'state') { setLevel('country'); setSelectedCountry(null); }
    else if (level === 'zone') { setLevel('state'); setSelectedState(null); }
    else if (level === 'house') { setLevel('zone'); setSelectedZone(null); }
    else if (level === 'members') { setLevel('house'); setSelectedHouse(null); }
  }

  async function saveGeneric(table: string, payload: Record<string, unknown>, id?: string) {
    const { id: _id, created_at, updated_at, ...clean } = payload;
    void _id; void created_at; void updated_at;
    let error;
    if (id) {
      ({ error } = await supabase.from(table).update({ ...clean, updated_at: new Date().toISOString() }).eq('id', id));
    } else {
      ({ error } = await supabase.from(table).insert(clean));
    }
    if (error) { showToast('Error: ' + error.message); return false; }
    showToast('Saved!');
    return true;
  }

  async function deleteGeneric(table: string, id: string) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message); return; }
    showToast('Deleted.');
  }

  const refresh = useCallback(() => {
    if (level === 'country') fetchCountries();
    else if (level === 'state' && selectedCountry) fetchStates(selectedCountry.id);
    else if (level === 'zone' && selectedState) fetchZones(selectedState.id);
    else if (level === 'house' && selectedZone) fetchHouses(selectedZone.id);
    else if (level === 'members' && selectedHouse) fetchMembers(selectedHouse.id);
  }, [level, selectedCountry, selectedState, selectedZone, selectedHouse, fetchCountries, fetchStates, fetchZones, fetchHouses, fetchMembers]);

  // Breadcrumb
  const breadcrumbs = [
    { label: 'Countries', level: 'country' as Level },
    ...(selectedCountry ? [{ label: selectedCountry.name, level: 'state' as Level }] : []),
    ...(selectedState ? [{ label: selectedState.name, level: 'zone' as Level }] : []),
    ...(selectedZone ? [{ label: selectedZone.name, level: 'house' as Level }] : []),
    ...(selectedHouse ? [{ label: selectedHouse.name, level: 'members' as Level }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">House Management</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage the hierarchy: Country &rarr; State &rarr; Zone &rarr; House &rarr; Members</p>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 flex-wrap">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.level} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
            <button
              onClick={() => {
                if (crumb.level === 'country') { setLevel('country'); setSelectedCountry(null); setSelectedState(null); setSelectedZone(null); setSelectedHouse(null); }
                else if (crumb.level === 'state' && selectedCountry) { setLevel('state'); setSelectedState(null); setSelectedZone(null); setSelectedHouse(null); fetchStates(selectedCountry.id); }
                else if (crumb.level === 'zone' && selectedState) { setLevel('zone'); setSelectedZone(null); setSelectedHouse(null); fetchZones(selectedState.id); }
                else if (crumb.level === 'house' && selectedZone) { setLevel('house'); setSelectedHouse(null); fetchHouses(selectedZone.id); }
              }}
              className={`text-sm font-medium px-2 py-0.5 rounded-md transition-colors ${i === breadcrumbs.length - 1 ? 'text-emerald-400 bg-emerald-500/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
            >
              {crumb.label}
            </button>
          </span>
        ))}
      </nav>

      {/* Level panels */}
      {level === 'country' && (
        <LevelPanel
          title="Countries"
          icon={Globe}
          items={countries}
          addLabel="Add Country"
          emptyMsg="No countries yet."
          onAdd={async (name) => { const ok = await saveGeneric('hm_countries', { name, is_active: true }); if (ok) fetchCountries(); }}
          onEdit={async (item, name) => { const ok = await saveGeneric('hm_countries', { name, is_active: item.is_active }, item.id); if (ok) fetchCountries(); }}
          onDelete={async (id) => { await deleteGeneric('hm_countries', id); fetchCountries(); }}
          onToggle={async (item) => { await supabase.from('hm_countries').update({ is_active: !item.is_active }).eq('id', item.id); fetchCountries(); }}
          onDrillDown={(item) => drillDown(item, 'state')}
          drillLabel="View States"
        />
      )}

      {level === 'state' && (
        <LevelPanel
          title={`States in ${selectedCountry?.name}`}
          icon={Map}
          items={states}
          addLabel="Add State"
          emptyMsg="No states yet."
          onBack={goBack}
          onAdd={async (name) => { const ok = await saveGeneric('hm_states', { name, country_id: selectedCountry!.id, is_active: true }); if (ok) fetchStates(selectedCountry!.id); }}
          onEdit={async (item, name) => { const ok = await saveGeneric('hm_states', { name, country_id: (item as State).country_id, is_active: item.is_active }, item.id); if (ok) fetchStates(selectedCountry!.id); }}
          onDelete={async (id) => { await deleteGeneric('hm_states', id); fetchStates(selectedCountry!.id); }}
          onToggle={async (item) => { await supabase.from('hm_states').update({ is_active: !item.is_active }).eq('id', item.id); fetchStates(selectedCountry!.id); }}
          onDrillDown={(item) => drillDown(item, 'zone')}
          drillLabel="View Zones"
        />
      )}

      {level === 'zone' && (
        <LevelPanel
          title={`Zones in ${selectedState?.name}`}
          icon={MapPin}
          items={zones}
          addLabel="Add Zone"
          emptyMsg="No zones yet."
          onBack={goBack}
          onAdd={async (name) => { const ok = await saveGeneric('hm_zones', { name, state_id: selectedState!.id, is_active: true }); if (ok) fetchZones(selectedState!.id); }}
          onEdit={async (item, name) => { const ok = await saveGeneric('hm_zones', { name, state_id: (item as Zone).state_id, is_active: item.is_active }, item.id); if (ok) fetchZones(selectedState!.id); }}
          onDelete={async (id) => { await deleteGeneric('hm_zones', id); fetchZones(selectedState!.id); }}
          onToggle={async (item) => { await supabase.from('hm_zones').update({ is_active: !item.is_active }).eq('id', item.id); fetchZones(selectedState!.id); }}
          onDrillDown={(item) => drillDown(item, 'house')}
          drillLabel="View Houses"
        />
      )}

      {level === 'house' && (
        <LevelPanel
          title={`Houses in ${selectedZone?.name}`}
          icon={Home}
          items={houses}
          addLabel="Add House"
          emptyMsg="No houses yet."
          onBack={goBack}
          onAdd={async (name) => { const ok = await saveGeneric('hm_houses', { name, zone_id: selectedZone!.id, is_active: true }); if (ok) fetchHouses(selectedZone!.id); }}
          onEdit={async (item, name) => { const ok = await saveGeneric('hm_houses', { name, zone_id: (item as House).zone_id, is_active: item.is_active }, item.id); if (ok) fetchHouses(selectedZone!.id); }}
          onDelete={async (id) => { await deleteGeneric('hm_houses', id); fetchHouses(selectedZone!.id); }}
          onToggle={async (item) => { await supabase.from('hm_houses').update({ is_active: !item.is_active }).eq('id', item.id); fetchHouses(selectedZone!.id); }}
          onDrillDown={(item) => drillDown(item, 'members')}
          drillLabel="Manage Members"
        />
      )}

      {level === 'members' && selectedHouse && (
        <MembersPanel
          house={selectedHouse}
          members={members}
          onBack={goBack}
          onRefresh={() => fetchMembers(selectedHouse.id)}
          showToast={showToast}
        />
      )}

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

// ---- Confirm Dialog ----
function ConfirmDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onCancel}>
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
        <p className="text-center text-muted-foreground text-sm leading-relaxed mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
          <Button onClick={onConfirm} className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold">Delete</Button>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Generic Level Panel ----
type AnyItem = Country | State | Zone | House;

function LevelPanel({
  title, icon: Icon, items, addLabel, emptyMsg, onBack, onAdd, onEdit, onDelete, onToggle, onDrillDown, drillLabel,
}: {
  title: string;
  icon: React.ElementType;
  items: AnyItem[];
  addLabel: string;
  emptyMsg: string;
  onBack?: () => void;
  onAdd: (name: string) => void;
  onEdit: (item: AnyItem, name: string) => void;
  onDelete: (id: string) => void;
  onToggle: (item: AnyItem) => void;
  onDrillDown: (item: AnyItem) => void;
  drillLabel: string;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  function startEdit(item: AnyItem) {
    setEditingId(item.id);
    setEditName(item.name);
  }

  function submitAdd() {
    if (!addName.trim()) return;
    onAdd(addName.trim());
    setAddName('');
    setShowAdd(false);
  }

  function submitEdit(item: AnyItem) {
    if (!editName.trim()) return;
    onEdit(item, editName.trim());
    setEditingId(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2 flex-1">
          <Icon className="w-5 h-5 text-emerald-500" />
          <span className="font-semibold text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <Button
          size="sm"
          onClick={() => setShowAdd(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> {addLabel}
        </Button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex gap-2 p-3 bg-card border border-emerald-500/30 rounded-xl"
          >
            <Input
              autoFocus
              value={addName}
              onChange={e => setAddName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitAdd(); if (e.key === 'Escape') { setShowAdd(false); setAddName(''); } }}
              placeholder={`Enter name...`}
              className="h-9 text-sm flex-1"
            />
            <Button size="sm" onClick={submitAdd} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold h-9 gap-1">
              <Save className="w-3.5 h-3.5" /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setAddName(''); }} className="h-9 w-9 p-0">
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items */}
      {items.length === 0 && (
        <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-xl text-sm">
          {emptyMsg}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="bg-card border border-border rounded-xl p-4 hover:border-emerald-500/40 transition-all group"
          >
            {editingId === item.id ? (
              <div className="flex gap-2">
                <Input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submitEdit(item); if (e.key === 'Escape') setEditingId(null); }}
                  className="h-8 text-sm flex-1"
                />
                <Button size="sm" onClick={() => submitEdit(item)} className="bg-emerald-500 hover:bg-emerald-400 text-black h-8 w-8 p-0">
                  <Save className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-8 w-8 p-0">
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-semibold text-foreground text-sm truncate">{item.name}</span>
                  </div>
                  <button
                    onClick={() => onToggle(item)}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 border transition-colors ${item.is_active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30' : 'bg-muted text-muted-foreground border-border hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30'}`}
                  >
                    {item.is_active ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onDrillDown(item)}
                    className="flex-1 h-8 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium gap-1"
                    variant="ghost"
                  >
                    {drillLabel} <ChevronRight className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => startEdit(item)} className="h-8 w-8 p-0">
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmingId(item.id)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </>
            )}
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

// ---- Members Panel ----
function MembersPanel({
  house, members, onBack, onRefresh, showToast,
}: {
  house: House;
  members: HouseMember[];
  onBack: () => void;
  onRefresh: () => void;
  showToast: (msg: string) => void;
}) {
  const [editingMember, setEditingMember] = useState<HouseMember | Omit<HouseMember, 'id'> | null>(null);
  const [confirmingMemberId, setConfirmingMemberId] = useState<string | null>(null);

  const roles: Array<'president' | 'secretary' | 'treasurer'> = ['president', 'secretary', 'treasurer'];

  function getMember(role: 'president' | 'secretary' | 'treasurer') {
    return members.find(m => m.role === role) ?? null;
  }

  async function saveMember(data: HouseMember | Omit<HouseMember, 'id'>) {
    const { id, created_at, updated_at, ...clean } = data as Record<string, unknown>;
    void created_at; void updated_at;
    let error;
    if (id) {
      ({ error } = await supabase.from('hm_house_members').update({ ...clean, updated_at: new Date().toISOString() }).eq('id', id as string));
    } else {
      ({ error } = await supabase.from('hm_house_members').insert(clean));
    }
    if (error) { showToast('Error: ' + error.message); return; }
    showToast('Saved!');
    onRefresh();
    setEditingMember(null);
  }

  async function deleteMember(id: string) {
    const { error } = await supabase.from('hm_house_members').delete().eq('id', id);
    if (error) { showToast('Error: ' + error.message); return; }
    showToast('Deleted.');
    onRefresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Home className="w-5 h-5 text-emerald-500" />
        <span className="font-semibold text-foreground">{house.name}</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Members</span>
      </div>

      {/* Edit / Add Form */}
      <AnimatePresence>
        {editingMember && (
          <MemberForm
            member={editingMember}
            onChange={setEditingMember}
            onSave={() => saveMember(editingMember)}
            onClose={() => setEditingMember(null)}
          />
        )}
      </AnimatePresence>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map(role => {
          const member = getMember(role);
          const cfg = ROLE_CONFIG[role];
          const RoleIcon = cfg.icon;
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-5 ${cfg.bg} flex flex-col gap-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RoleIcon className={`w-5 h-5 ${cfg.color}`} />
                  <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                </div>
                {member ? (
                  <div className="flex gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 hover:bg-white/10"
                      onClick={() => setEditingMember(member)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                      onClick={() => setConfirmingMemberId(member.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2.5 text-xs gap-1 hover:bg-white/10"
                    onClick={() => setEditingMember({ house_id: house.id, role, name: '', industry: '', photo_url: '', is_active: true })}
                  >
                    <Plus className="w-3.5 h-3.5" /> Assign
                  </Button>
                )}
              </div>

              {member ? (
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden bg-black/20 shrink-0">
                    {member.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <RoleIcon className={`w-7 h-7 ${cfg.color} opacity-50`} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm leading-tight">{member.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{member.industry}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-white/10 text-muted-foreground text-xs">
                  Not assigned yet
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {confirmingMemberId && (
          <ConfirmDialog
            onConfirm={() => { deleteMember(confirmingMemberId); setConfirmingMemberId(null); }}
            onCancel={() => setConfirmingMemberId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Member Form ----
function MemberForm({
  member,
  onChange,
  onSave,
  onClose,
}: {
  member: HouseMember | Omit<HouseMember, 'id'>;
  onChange: (m: HouseMember | Omit<HouseMember, 'id'>) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const cfg = ROLE_CONFIG[(member as HouseMember).role];
  const isEdit = 'id' in member;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFile(file: File) {
    setUploading(true);
    setUploadError('');
    const ext = file.name.split('.').pop();
    const filename = `house-members/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(filename, file, { upsert: false });
    if (error) { setUploadError('Upload failed: ' + error.message); setUploading(false); return; }
    const { data } = supabase.storage.from('media').getPublicUrl(filename);
    onChange({ ...member, photo_url: data.publicUrl });
    setUploading(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-card border border-emerald-500/30 rounded-2xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
          <h3 className="font-bold text-foreground">{isEdit ? 'Edit' : 'Assign'} {cfg.label}</h3>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
          <Input
            value={(member as HouseMember).name}
            onChange={e => onChange({ ...member, name: e.target.value })}
            placeholder="e.g. Rajesh Kumar"
            className="h-9 text-sm"
          />
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Industry</Label>
          <Input
            value={(member as HouseMember).industry}
            onChange={e => onChange({ ...member, industry: e.target.value })}
            placeholder="e.g. Real Estate, IT, Textiles"
            className="h-9 text-sm"
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium text-muted-foreground">Photo</Label>
          <div className="flex gap-3 items-start">
            <div className="w-20 h-20 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
              {(member as HouseMember).photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={(member as HouseMember).photo_url} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
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
                  <><Upload className="w-4 h-4" /> Click to upload photo</>
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
                value={(member as HouseMember).photo_url}
                onChange={e => onChange({ ...member, photo_url: e.target.value })}
                className="h-8 text-xs"
              />
              {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold gap-2">
          <Save className="w-4 h-4" /> Save
        </Button>
      </div>
    </motion.div>
  );
}
