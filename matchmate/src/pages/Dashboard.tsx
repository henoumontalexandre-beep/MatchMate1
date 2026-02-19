import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { calculateCompatibility, type Profile } from "@/lib/matchmaking";
import { CompatibilityScore } from "@/components/CompatibilityScore";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Gamepad2, LogOut, Search, Users, Clock, Zap, Target, Sparkles,
  UserCircle, Settings, X, MessageSquare, Globe, Phone, Link2, ChevronRight
} from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, setOnlineStatus } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tab, setTab] = useState<"find" | "matches" | "profile" | "duo">("find");
  const [players, setPlayers] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Array<{ requester_id: string; matched_id: string; compatibility_score: number; match_mode: string; status: string; created_at?: string; otherProfile?: Profile }>>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Profile | null>(null);
  const [matchMode, setMatchMode] = useState<"compétitif" | "chill" | "normal">("normal");
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  // Set online on mount
  useEffect(() => {
    setOnlineStatus(true);
    const handleBeforeUnload = () => setOnlineStatus(false);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setOnlineStatus(false);
    };
  }, [setOnlineStatus]);

  // Check if profile is complete
  useEffect(() => {
    if (!profileLoading && profile && (!profile.games.length || !profile.availability.length)) {
      navigate("/setup");
    }
  }, [profile, profileLoading, navigate]);

  // Fetch players for matchmaking
  const fetchPlayers = useCallback(async () => {
    if (!user) return;
    setLoadingPlayers(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .neq("user_id", user.id);
    if (data) setPlayers(data as unknown as Profile[]);
    setLoadingPlayers(false);
  }, [user]);

  // Fetch matches
  const fetchMatches = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("matches")
      .select("*")
      .or(`requester_id.eq.${user.id},matched_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    
    if (data) {
      // Fetch profiles for matched users
      const otherIds = data.map(m => m.requester_id === user.id ? m.matched_id : m.requester_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", otherIds);
      
      const profileMap = new Map((profiles || []).map(p => [p.user_id, p]));
      setMatches(data.map(m => ({
        ...m,
        otherProfile: profileMap.get(m.requester_id === user.id ? m.matched_id : m.requester_id),
      })));
    }
  }, [user]);

  useEffect(() => { fetchPlayers(); fetchMatches(); }, [user, fetchPlayers, fetchMatches]);

  // Ranked players by compatibility
  const rankedPlayers = useMemo(() => {
    if (!profile) return [];
    let filtered = players;

    // Filter by match mode
    if (matchMode === "compétitif") {
      filtered = filtered.filter(p => p.play_style === "compétitif" || p.play_style === "tryhard");
    } else if (matchMode === "chill") {
      filtered = filtered.filter(p => p.play_style === "chill" || p.play_style === "fun");
    }

    return filtered
      .map(p => ({ player: p, score: calculateCompatibility(profile, p) }))
      .sort((a, b) => b.score - a.score);
  }, [profile, players, matchMode]);

  const sendMatchRequest = async (targetUserId: string) => {
    if (!user || !profile) return;
    const score = rankedPlayers.find(r => r.player.user_id === targetUserId)?.score || 0;
    
    const { error } = await supabase.from("matches").insert({
      requester_id: user.id,
      matched_id: targetUserId,
      compatibility_score: score,
      match_mode: matchMode,
      status: "accepted",
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Déjà matché", description: "Tu as déjà un match avec ce joueur" });
      } else {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Match envoyé ! 🎮", description: "Vous pouvez maintenant voir vos infos de contact" });
      fetchMatches();
    }
  };

  const handleSignOut = async () => {
    await setOnlineStatus(false);
    await signOut();
    navigate("/");
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-primary/10 bg-card/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-bold text-lg text-foreground">MatchMate</span>
          <div className="flex items-center gap-3">
            {profile && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-lg">{profile.avatar_emoji}</span>
                <span className="text-sm text-foreground font-medium hidden sm:inline">{profile.username}</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/setup")} 
              title="Modifier le profil"
              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut} 
              title="Déconnexion"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-primary/10 bg-card/20 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 flex overflow-x-auto">
          {[
            { key: "find" as const, label: "Découvrir", icon: <Search className="w-4 h-4" /> },
            { key: "duo" as const, label: "Trouve ton duo", icon: <Sparkles className="w-4 h-4" /> },
            { key: "matches" as const, label: "Mes matchs", icon: <MessageSquare className="w-4 h-4" /> },
            { key: "profile" as const, label: "Mon profil", icon: <UserCircle className="w-4 h-4" /> },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                tab === t.key
                  ? "border-primary text-primary shadow-lg shadow-primary/20"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* FIND TAB */}
        {tab === "find" && (
          <div>
            {/* Mode selector */}
            <div className="mb-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">Découvre tes matchs</h2>
              <div className="flex gap-3 flex-wrap">
                {[
                  { key: "normal" as const, label: "Tous", desc: "Tous les joueurs" },
                  { key: "compétitif" as const, label: "Compétitif", desc: "Ranked & Tryhard" },
                  { key: "chill" as const, label: "Chill", desc: "Détente & Fun" },
                ].map(m => (
                  <button
                    key={m.key}
                    onClick={() => setMatchMode(m.key)}
                    className={`flex flex-col items-start px-5 py-3 rounded-xl text-sm transition-all duration-300 border-2 font-medium ${
                      matchMode === m.key
                        ? "bg-primary/20 border-primary/60 text-primary shadow-lg shadow-primary/20"
                        : "bg-card/60 border-primary/20 text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <div>{m.label}</div>
                    <div className="text-xs opacity-70">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {loadingPlayers ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
                  Recherche de joueurs...
                </div>
              </div>
            ) : rankedPlayers.length === 0 ? (
              <div className="text-center py-16 bg-card/30 rounded-2xl border border-primary/10">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">Aucun joueur trouvé</p>
                <p className="text-sm text-muted-foreground">Reviens plus tard ou change de filtre</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {rankedPlayers.map(({ player, score }, i) => (
                  <motion.div
                    key={player.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card/60 border border-primary/20 rounded-2xl p-5 hover:border-primary/40 transition-all cursor-pointer group"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative flex-shrink-0">
                        <div className="text-4xl">{player.avatar_emoji}</div>
                        {player.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">{player.username}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium capitalize">{player.level}</span>
                          {player.is_online && <span className="text-xs text-primary font-medium">En ligne</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span className="capitalize">{player.play_style}</span>
                          <span>•</span>
                          <span>{player.main_game || player.games[0]}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{player.bio || "Pas de bio"}</p>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <CompatibilityScore score={score} size="sm" />
                        <Button 
                          size="sm" 
                          onClick={(e) => { e.stopPropagation(); sendMatchRequest(player.user_id); }}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 px-4 shadow-lg shadow-primary/20"
                        >
                          Match
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MATCHES TAB */}
        {tab === "matches" && (
          <div>
            {/* Deduplicate matches by otherProfile.user_id and show compact vertical cards */}
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Tes matchs ({/* show unique count */} {Array.from(new Set(matches.map(m => m.otherProfile?.user_id).filter(Boolean))).length})</h2>
            {matches.length === 0 ? (
              <div className="text-center py-16 bg-card/30 rounded-2xl border border-primary/10">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">Aucun match pour le moment</p>
                <p className="text-sm text-muted-foreground mb-4">Commence à découvrir d'autres joueurs</p>
                <Button onClick={() => setTab("find")} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg shadow-primary/20">
                  <Search className="w-4 h-4 mr-2" /> Découvrir des joueurs
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(() => {
                  const seen = new Set<string>();
                  const unique: typeof matches = [];
                  for (const m of matches) {
                    const pid = m.otherProfile?.user_id;
                    if (!pid) continue;
                    if (!seen.has(pid)) {
                      seen.add(pid);
                      unique.push(m);
                    }
                  }
                  return unique.map((match, i) => {
                    const p = match.otherProfile!;
                    return (
                      <motion.div
                        key={p.user_id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="bg-card/60 border border-primary/12 rounded-2xl p-6 hover:border-primary/30 transition-all flex flex-col items-center text-center gap-4"
                      >
                        <div className="text-5xl">{p.avatar_emoji}</div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground text-lg">{p.username}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">{Math.round(match.compatibility_score)}%</span>
                          <span className="text-xs text-muted-foreground capitalize">{match.match_mode}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{p.main_game || p.games[0] || "—"}</div>
                        <div className="mt-2 w-full">
                          <Button size="sm" onClick={() => navigate(`/profile/${p.user_id}`)} className="w-full h-10 rounded-lg bg-primary text-primary-foreground">Voir le profil</Button>
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}

        {/* DUO TAB - AI Matching (minimal, frontend only) */}
        {tab === "duo" && (
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-primary/20 bg-card/30 p-8 md:p-12 backdrop-blur-sm"
            >
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Minimal AI visualization */}
                <div className="flex items-center justify-center">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-primary/6" />
                    <div className="absolute w-36 h-36 rounded-full bg-primary/12 flex items-center justify-center text-4xl font-bold text-primary">AI</div>
                    <svg className="absolute w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="100" cy="100" r="70" stroke="hsl(var(--primary) / 0.12)" strokeWidth="2" />
                      <g stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.9">
                        <path d="M40 100 C70 60, 130 60, 160 100" strokeOpacity="0.6" />
                        <path d="M60 120 C85 140, 115 140, 140 120" strokeOpacity="0.4" />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Text & CTA */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-foreground mb-2">Trouve ton duo</h2>
                    <p className="text-sm text-muted-foreground">L'IA analysera ton profil et proposera un duo compatible. Design minimal — backend à connecter plus tard.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">1</div>
                      <div>
                        <div className="font-medium text-foreground">Analyse de profil</div>
                        <div className="text-xs text-muted-foreground">Jeux, style, disponibilités</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold">2</div>
                      <div>
                        <div className="font-medium text-foreground">Matching intelligent</div>
                        <div className="text-xs text-muted-foreground">Scores de compatibilité basés sur ton profil</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg shadow-primary/20">Lancer l'analyse</Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Placeholder summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card/40 border border-primary/10 rounded-xl p-5 text-center">
                <div className="text-2xl font-bold text-primary">—</div>
                <div className="text-xs text-muted-foreground mt-2">Meilleur match (sera affiché ici)</div>
              </div>
              <div className="bg-card/40 border border-primary/10 rounded-xl p-5 text-center">
                <div className="text-2xl font-bold text-primary">—</div>
                <div className="text-xs text-muted-foreground mt-2">Score de compatibilité</div>
              </div>
              <div className="bg-card/40 border border-primary/10 rounded-xl p-5 text-center">
                <div className="text-2xl font-bold text-primary">—</div>
                <div className="text-xs text-muted-foreground mt-2">Actions</div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === "profile" && profile && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">Mon profil gaming</h2>
            
            {/* Profile Card */}
            <div className="bg-card/60 border border-primary/20 rounded-2xl p-8 mb-8">
              <div className="flex items-end gap-6 mb-8">
                <div className="text-6xl">{profile.avatar_emoji}</div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-foreground">{profile.username}</h3>
                  <p className="text-primary font-medium mt-1 capitalize">{profile.level} • {profile.play_style}</p>
                  <p className="text-sm text-muted-foreground mt-2">Membre depuis {new Date(profile.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              
              {profile.bio && (
                <div className="mb-8 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-foreground">{profile.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Jeux principaux</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.games.map(g => (
                      <span key={g} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/40 text-sm font-medium">{g}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Disponibilités</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.availability.map(a => (
                      <span key={a} className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/40 text-sm font-medium">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-card/60 border border-primary/20 rounded-2xl p-8 mb-8">
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-5">Infos de contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.discord_tag ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/15 border border-primary/30">
                    <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Discord</p>
                      <p className="text-sm font-medium text-foreground">{profile.discord_tag}</p>
                    </div>
                  </div>
                ) : null}
                {profile.game_username ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/15 border border-primary/30">
                    <Gamepad2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Pseudo en jeu</p>
                      <p className="text-sm font-medium text-foreground">{profile.game_username}</p>
                    </div>
                  </div>
                ) : null}
                {profile.phone_number ? (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/15 border border-primary/30">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="text-sm font-medium text-foreground">{profile.phone_number}</p>
                    </div>
                  </div>
                ) : null}
                {profile.steam_epic_link ? (
                  <a href={profile.steam_epic_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl bg-primary/15 border border-primary/30 hover:bg-primary/25 transition-colors">
                    <Link2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Profil Steam/Epic</p>
                      <p className="text-sm font-medium text-primary underline">Voir le profil</p>
                    </div>
                  </a>
                ) : null}
              </div>
              {!profile.discord_tag && !profile.game_username && !profile.phone_number && !profile.steam_epic_link && (
                <p className="text-sm text-muted-foreground italic">Aucune info de contact renseignée</p>
              )}
            </div>

            {/* Action Button */}
            <Button 
              onClick={() => navigate("/setup")} 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20"
            >
              <Settings className="w-4 h-4 mr-2" /> Modifier mon profil
            </Button>
          </div>
        )}
      </main>

      {/* Player detail modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPlayer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="text-4xl">{selectedPlayer.avatar_emoji}</div>
                    {selectedPlayer.is_online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-score-high border-2 border-card" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedPlayer.username}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{selectedPlayer.level} • {selectedPlayer.play_style}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPlayer(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {profile && (
                <div className="flex justify-center mb-4">
                  <CompatibilityScore score={calculateCompatibility(profile, selectedPlayer)} size="md" />
                </div>
              )}

              {selectedPlayer.bio && (
                <p className="text-muted-foreground text-sm text-center mb-4">"{selectedPlayer.bio}"</p>
              )}

              <div className="space-y-3 mb-6">
                <div>
                  <h4 className="text-xs font-medium text-foreground mb-1.5">Jeux</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlayer.games.map(g => {
                      const isCommon = profile?.games.includes(g);
                      return (
                        <span key={g} className={`text-xs px-2 py-0.5 rounded-md ${isCommon ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {isCommon && "✓ "}{g}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-foreground mb-1.5">Disponibilités</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlayer.availability.map(a => {
                      const isCommon = profile?.availability.includes(a);
                      return (
                        <span key={a} className={`text-xs px-2 py-0.5 rounded-md ${isCommon ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                          {isCommon && "✓ "}{a}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => { sendMatchRequest(selectedPlayer.user_id); setSelectedPlayer(null); }}
                className="w-full"
              >
                <Zap className="w-4 h-4 mr-2" /> Matcher avec {selectedPlayer.username}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
