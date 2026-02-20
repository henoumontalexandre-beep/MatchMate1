import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { GAMES, STYLES, AVAILABILITIES } from "@/lib/matchmaking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, ChevronRight, ChevronLeft, Check, Globe, Phone, Link2, Mail, Lock } from "lucide-react";

const Setup = () => {
  const { user, signUp } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Form state - Profile
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("🎮");
  const [games, setGames] = useState<string[]>([]);
  const [level, setLevel] = useState("intermédiaire");
  const [playStyle, setPlayStyle] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [mainGame, setMainGame] = useState("");
  const [discordTag, setDiscordTag] = useState("");
  const [gameUsername, setGameUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [steamEpicLink, setSteamEpicLink] = useState("");

  // Form state - Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setAvatar(profile.avatar_emoji || "🎮");
      setGames(profile.games || []);
      setLevel(profile.level || "intermédiaire");
      setPlayStyle(profile.play_style || "");
      setAvailability(profile.availability || []);
      setBio(profile.bio || "");
      setMainGame(profile.main_game || "");
      setDiscordTag(profile.discord_tag || "");
      setGameUsername(profile.game_username || "");
      setPhoneNumber(profile.phone_number || "");
      setSteamEpicLink(profile.steam_epic_link || "");
    }
  }, [profile]);

  const toggle = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const handleSave = async () => {
    // If user is not authenticated yet, create account first
    if (!user) {
      if (password !== confirmPassword) {
        toast({ title: "Erreur", description: "Les mots de passe ne correspondent pas", variant: "destructive" });
        return;
      }

      if (password.length < 6) {
        toast({ title: "Erreur", description: "Le mot de passe doit contenir au least 6 caractères", variant: "destructive" });
        return;
      }

      setSaving(true);
      const { error } = await signUp(email, password, username);
      setSaving(false);

      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
      } else {
        // Save profile immediately since user is now logged in
        const profileData = {
          username,
          avatar_emoji: avatar,
          games,
          level: level as string,
          play_style: playStyle as string,
          availability,
          bio,
          main_game: mainGame || games[0] || "",
          discord_tag: discordTag,
          game_username: gameUsername,
          phone_number: phoneNumber,
          steam_epic_link: steamEpicLink,
        };
        
        setSaving(true);
        const { error: profileError } = await updateProfile(profileData);
        setSaving(false);
        
        if (profileError) {
          toast({ title: "Erreur", description: profileError.message, variant: "destructive" });
        } else {
          toast({ title: "Compte créé avec succès ✓" });
          navigate("/dashboard");
        }
      }
      return;
    }

    // If user is authenticated, save profile data
    setSaving(true);
    const { error } = await updateProfile({
      username,
      avatar_emoji: avatar,
      games,
      level: level as unknown as string,
      play_style: playStyle as unknown as string,
      availability,
      bio,
      main_game: mainGame || games[0] || "",
      discord_tag: discordTag,
      game_username: gameUsername,
      phone_number: phoneNumber,
      steam_epic_link: steamEpicLink,
    });
    setSaving(false);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profil sauvegardé ✓" });
      navigate("/dashboard");
    }
  };

  const canProceed = [
    username.length >= 2,
    games.length >= 1,
    playStyle.length > 0,
    availability.length >= 1,
    true,
    true,
    email.length > 0 && email.includes("@"),
    password.length >= 6 && confirmPassword === password,
  ][step];

  // L'ordre des étapes : profil d'abord (étapes 0-6), puis email/password (étapes 7-8) uniquement si pas authentifié
  const totalSteps = user ? 6 : 8;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-primary/10 bg-card/30 backdrop-blur-sm">
        <span className="font-display font-bold text-lg text-foreground">MatchMate</span>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground font-medium">Étape {step + 1}/{totalSteps}</div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="text-primary hover:bg-primary/5">Se connecter</Button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    i <= step ? "bg-primary shadow-lg shadow-primary/30" : "bg-muted"
                  }`} 
                />
              ))}
            </div>
          </div>

          <AnimatedStep step={step}>
            {step === 0 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">Ton identité</h2>
                  <p className="text-muted-foreground">Commence par te présenter</p>
                </div>

                <div>
                  <Label className="text-foreground text-sm font-medium mb-3 block">Pseudo</Label>
                  <Input 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="Ton pseudo gaming" 
                    className="h-11 bg-card/60 border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                    maxLength={20} 
                  />
                  <p className="text-xs text-muted-foreground mt-2">{username.length}/20 caractères</p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">Tes jeux</h2>
                  <p className="text-muted-foreground">Sélectionne au moins un jeu</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {GAMES.map(g => (
                    <button 
                      key={g} 
                      onClick={() => toggle(games, g, setGames)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-300 border-2 ${
                        games.includes(g) 
                          ? "bg-primary/20 border-primary/60 text-primary shadow-lg shadow-primary/20" 
                          : "bg-card/60 border-primary/20 text-muted-foreground hover:bg-card hover:border-primary/40"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Niveau step removed - default level is set to "intermédiaire" */}

            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">Ton style</h2>
                  <p className="text-muted-foreground">Comment tu aimes jouer</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {STYLES.map(s => (
                    <button 
                      key={s} 
                      onClick={() => setPlayStyle(s)}
                      className={`px-6 py-4 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                        playStyle === s 
                          ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20" 
                          : "bg-card/60 border-primary/20 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {s === "compétitif" ? "🎯 Compétitif" : s === "chill" ? "😎 Chill" : s === "tryhard" ? "💪 Tryhard" : "🎉 Fun"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">Tes disponibilités</h2>
                  <p className="text-muted-foreground">Quand aimes-tu jouer ?</p>
                </div>
                <div className="space-y-2.5">
                  {AVAILABILITIES.map(a => (
                    <button 
                      key={a} 
                      onClick={() => toggle(availability, a, setAvailability)}
                      className={`w-full px-5 py-3.5 rounded-xl text-sm font-medium text-left transition-all duration-300 border-2 ${
                        availability.includes(a) 
                          ? "bg-primary/20 border-primary text-primary shadow-lg shadow-primary/20" 
                          : "bg-card/60 border-primary/20 text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">Parle de toi</h2>
                  <p className="text-muted-foreground">Raconte ton truc</p>
                </div>
                <div>
                  <Label className="text-foreground text-sm font-medium mb-3 block">Bio</Label>
                  <p className="text-xs text-muted-foreground mb-3">Ex: "Je joue chill le soir, je cherche quelqu'un pour rigoler"</p>
                  <Textarea 
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                    placeholder="Racontez votre style, vos envies..." 
                    className="bg-card/60 border border-primary/20 rounded-xl min-h-[120px] text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                    maxLength={200} 
                  />
                  <p className="text-xs text-muted-foreground mt-2 text-right">{bio.length}/200</p>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">Infos de contact</h2>
                  <p className="text-muted-foreground">Pour que tes matchs te contactent</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground text-sm font-medium mb-2 block flex items-center gap-2">
                      <Globe className="w-4 h-4 text-primary" /> Discord
                    </Label>
                    <Input 
                      value={discordTag} 
                      onChange={e => setDiscordTag(e.target.value)} 
                      placeholder="PseudoDiscord#1234" 
                      className="h-11 bg-card/60 border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                    />
                  </div>
                  <div>
                    <Label className="text-foreground text-sm font-medium mb-2 block flex items-center gap-2">
                      <Gamepad2 className="w-4 h-4 text-primary" /> Pseudo en jeu
                    </Label>
                    <Input 
                      value={gameUsername} 
                      onChange={e => setGameUsername(e.target.value)} 
                      placeholder="Ton pseudo dans ton jeu principal" 
                      className="h-11 bg-card/60 border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                    />
                  </div>
                  <div>
                    <Label className="text-foreground text-sm font-medium mb-2 block flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" /> Téléphone (facultatif)
                    </Label>
                    <Input 
                      value={phoneNumber} 
                      onChange={e => setPhoneNumber(e.target.value)} 
                      placeholder="+33 6 12 34 56 78" 
                      className="h-11 bg-card/60 border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                    />
                  </div>
                  <div>
                    <Label className="text-foreground text-sm font-medium mb-2 block flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-primary" /> Lien Steam/Epic (facultatif)
                    </Label>
                    <Input 
                      value={steamEpicLink} 
                      onChange={e => setSteamEpicLink(e.target.value)} 
                      placeholder="https://steamcommunity.com/..." 
                      className="h-11 bg-card/60 border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">Valide ton email</h2>
                  <p className="text-muted-foreground">C'est la dernière étape !</p>
                </div>
                <div>
                  <Label className="text-foreground text-sm font-medium mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" /> Email
                  </Label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="toi@exemple.com" 
                    className="h-11 bg-card/60 border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                  />
                  <p className="text-xs text-muted-foreground mt-2">Tu recevras un lien de confirmation par email</p>
                </div>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground mb-2">Sécurise ton compte</h2>
                  <p className="text-muted-foreground">Choisis un mot de passe fort</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-foreground text-sm font-medium mb-2 block flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" /> Mot de passe
                    </Label>
                    <Input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="Minimum 6 caractères" 
                      className="h-11 bg-card/60 border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                    />
                  </div>
                  <div>
                    <Label className="text-foreground text-sm font-medium mb-2 block flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary" /> Confirmer le mot de passe
                    </Label>
                    <Input 
                      type="password" 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)} 
                      placeholder="Confirmez votre mot de passe" 
                      className="h-11 bg-card/60 border border-primary/20 rounded-xl text-foreground placeholder:text-muted-foreground focus:border-primary/50" 
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-xs text-destructive mt-2">Les mots de passe ne correspondent pas</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </AnimatedStep>

          {/* Navigation */}
          <div className="flex gap-3 mt-10">
            {step > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(s => s - 1)} 
                className="flex-1 h-12 border-primary/30 text-primary hover:bg-primary/5 rounded-xl font-medium"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Retour
              </Button>
            )}
            {step < totalSteps - 1 ? (
              <Button 
                onClick={() => setStep(s => s + 1)} 
                disabled={!canProceed} 
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSave} 
                disabled={saving || !canProceed} 
                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                    Sauvegarde...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Créer mon compte
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function AnimatedStep({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      {children}
    </motion.div>
  );
}

export default Setup;
