"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { AnimatedBackground } from '@/components/animated-background';
import { Crown, BookOpen, Wallet, Chrome as Home, ChevronDown, Users, Calendar, Building2 } from 'lucide-react';

// ---- Types ----
type Country = { id: string; name: string };
type State = { id: string; country_id: string; name: string };
type Zone = { id: string; state_id: string; name: string };
type House = { id: string; zone_id: string; name: string };
type HouseMember = {
  id: string;
  house_id: string;
  role: 'president' | 'secretary' | 'treasurer';
  name: string;
  industry: string;
  photo_url: string;
};

type HouseWithMembers = House & { members: HouseMember[] };

const ROLE_CONFIG = {
  president: { label: 'President', icon: Crown, color: 'text-amber-400', border: 'border-amber-500/40', glow: 'shadow-amber-500/10' },
  secretary: { label: 'Secretary', icon: BookOpen, color: 'text-sky-400', border: 'border-sky-500/40', glow: 'shadow-sky-500/10' },
  treasurer: { label: 'Treasurer', icon: Wallet, color: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/10' },
};

// ---- Dropdown Component ----
function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: { id: string; name: string }[];
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const selectId = `filter-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="relative">
      <label htmlFor={selectId} className="sr-only">{label}</label>
      <select
        id={selectId}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none bg-card border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer pr-10"
      >
        <option value="">{label}</option>
        {options.map(o => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ---- Member Card ----
function MemberCard({ member }: { member: HouseMember }) {
  const cfg = ROLE_CONFIG[member.role];
  const RoleIcon = cfg.icon;
  return (
    <div className={`flex flex-col items-center gap-3 p-4 rounded-2xl border ${cfg.border} bg-card/60 shadow-lg ${cfg.glow}`}>
      <div className={`w-20 h-20 rounded-full overflow-hidden border-2 ${cfg.border} bg-muted shrink-0`}>
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <RoleIcon className={`w-8 h-8 ${cfg.color} opacity-40`} />
          </div>
        )}
      </div>
      <div className="text-center">
        <div className={`flex items-center justify-center gap-1.5 mb-1`}>
          <RoleIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
          <span className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</span>
        </div>
        <p className="font-bold text-foreground text-sm leading-tight">{member.name}</p>
        <p className="text-muted-foreground text-xs mt-0.5">{member.industry}</p>
      </div>
    </div>
  );
}

// ---- House Card ----
function HouseCard({ house, index }: { house: HouseWithMembers; index: number }) {
  const roles: Array<'president' | 'secretary' | 'treasurer'> = ['president', 'secretary', 'treasurer'];
  const getMember = (role: 'president' | 'secretary' | 'treasurer') =>
    house.members.find(m => m.role === role) ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5"
    >
      {/* House Header */}
      <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-emerald-500/5 to-transparent flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Home className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">{house.name}</h3>
          <p className="text-xs text-muted-foreground">{house.members.length} member{house.members.length !== 1 ? 's' : ''} assigned</p>
        </div>
      </div>

      {/* Members grid */}
      <div className="p-5">
        {house.members.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6">No members assigned yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {roles.map(role => {
              const member = getMember(role);
              if (!member) {
                const cfg = ROLE_CONFIG[role];
                const RoleIcon = cfg.icon;
                return (
                  <div key={role} className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-dashed border-border opacity-40">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <RoleIcon className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs text-muted-foreground">Vacant</span>
                  </div>
                );
              }
              return <MemberCard key={role} member={member} />;
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---- Main Page ----
export default function HousesPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [houses, setHouses] = useState<HouseWithMembers[]>([]);
  const [totalHouseCount, setTotalHouseCount] = useState(0);

  const [selCountry, setSelCountry] = useState('');
  const [selState, setSelState] = useState('');
  const [selZone, setSelZone] = useState('');

  const [loading, setLoading] = useState(false);

  // Fetch total house count on mount
  useEffect(() => {
    supabase.from('hm_houses').select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .then(({ count }) => { if (count !== null) setTotalHouseCount(count); });
  }, []);

  // Fetch countries
  useEffect(() => {
    supabase.from('hm_countries').select('id, name').eq('is_active', true).order('name')
      .then(({ data }) => { if (data) setCountries(data); });
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    setSelState('');
    setSelZone('');
    setStates([]);
    setZones([]);
    if (!selCountry) return;
    supabase.from('hm_states').select('id, country_id, name').eq('country_id', selCountry).eq('is_active', true).order('name')
      .then(({ data }) => { if (data) setStates(data); });
  }, [selCountry]);

  // Fetch zones when state changes
  useEffect(() => {
    setSelZone('');
    setZones([]);
    if (!selState) return;
    supabase.from('hm_zones').select('id, state_id, name').eq('state_id', selState).eq('is_active', true).order('name')
      .then(({ data }) => { if (data) setZones(data); });
  }, [selState]);

  // Fetch houses + members when filters change
  useEffect(() => {
    async function load() {
      setLoading(true);

      // Build house query
      let query = supabase.from('hm_houses').select('id, zone_id, name').eq('is_active', true).order('name');

      if (selZone) {
        query = query.eq('zone_id', selZone);
      } else if (selState) {
        // Get zone ids for this state
        const { data: zoneData } = await supabase.from('hm_zones').select('id').eq('state_id', selState).eq('is_active', true);
        const zoneIds = (zoneData ?? []).map(z => z.id);
        if (zoneIds.length === 0) { setHouses([]); setLoading(false); return; }
        query = query.in('zone_id', zoneIds);
      } else if (selCountry) {
        // Get all zone ids under this country
        const { data: stateData } = await supabase.from('hm_states').select('id').eq('country_id', selCountry).eq('is_active', true);
        const stateIds = (stateData ?? []).map(s => s.id);
        if (stateIds.length === 0) { setHouses([]); setLoading(false); return; }
        const { data: zoneData } = await supabase.from('hm_zones').select('id').in('state_id', stateIds).eq('is_active', true);
        const zoneIds = (zoneData ?? []).map(z => z.id);
        if (zoneIds.length === 0) { setHouses([]); setLoading(false); return; }
        query = query.in('zone_id', zoneIds);
      }

      const { data: houseData } = await query;
      if (!houseData || houseData.length === 0) { setHouses([]); setLoading(false); return; }

      const houseIds = houseData.map(h => h.id);
      const { data: memberData } = await supabase.from('hm_house_members').select('*').in('house_id', houseIds).eq('is_active', true);

      const withMembers: HouseWithMembers[] = houseData.map(h => ({
        ...h,
        members: (memberData ?? []).filter(m => m.house_id === h.id),
      }));

      setHouses(withMembers);
      setLoading(false);
    }
    load();
  }, [selCountry, selState, selZone]);

  const statsCards = [
    { icon: Building2, value: totalHouseCount > 0 ? `${totalHouseCount}+` : '—', label: 'Active Houses', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    { icon: Users, value: '1720+', label: 'Members', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
    { icon: Calendar, value: 'Every 15 Days', label: 'House Meet', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  ];

  return (
    <div className="min-h-screen pt-20 bg-black">
      <section className="relative overflow-hidden">
        <AnimatedBackground variant="default" />

        <div className="container mx-auto px-4 relative z-10 py-16">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
              WeVysya Business Houses
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Structured business communities driving growth, collaboration, and prosperity across regions.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto mb-14"
          >
            {statsCards.map((card, i) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`rounded-2xl border p-4 text-center ${card.bg} flex flex-col items-center gap-2`}
                >
                  <CardIcon className={`w-5 h-5 ${card.color}`} />
                  <p className={`text-2xl font-extrabold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl mx-auto mb-10"
          >
            <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Filter Houses</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FilterSelect
                  label="All Countries"
                  value={selCountry}
                  options={countries}
                  onChange={v => setSelCountry(v)}
                />
                <FilterSelect
                  label="All States"
                  value={selState}
                  options={states}
                  onChange={v => setSelState(v)}
                  disabled={!selCountry}
                />
                <FilterSelect
                  label="All Zones"
                  value={selZone}
                  options={zones}
                  onChange={v => setSelZone(v)}
                  disabled={!selState}
                />
              </div>
            </div>
          </motion.div>

          {/* Houses Grid */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : houses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 text-muted-foreground"
              >
                <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                {!selCountry ? (
                  <>
                    <p className="text-lg font-medium">Select a country to explore houses</p>
                    <p className="text-sm mt-1">Use the filters above to browse WeVysya houses by region</p>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium">No houses found</p>
                    <p className="text-sm mt-1">Try selecting a different filter</p>
                  </>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selCountry}-${selState}-${selZone}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {houses.map((house, i) => (
                    <HouseCard key={house.id} house={house} index={i} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
