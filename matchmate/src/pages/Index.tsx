import { motion } from "framer-motion";
import { Users, Zap, Shield, ArrowRight, Gamepad2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function MatchMateLogo({ size = "sm" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };
  
  return (
    <svg className={sizeClasses[size]} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: "#06B6D4", stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: "#8B5CF6", stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: "#D946EF", stopOpacity: 1}} />
        </linearGradient>
      </defs>
      {/* Infinity symbol */}
      <path d="M 40 100 C 40 75, 60 60, 80 60 C 110 60, 120 85, 120 100 C 120 115, 110 140, 80 140 C 60 140, 40 125, 40 100" 
            stroke="url(#mmGrad)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M 160 100 C 160 75, 140 60, 120 60 C 90 60, 80 85, 80 100 C 80 115, 90 140, 120 140 C 140 140, 160 125, 160 100" 
            stroke="url(#mmGrad)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Floating blob background element
function FloatingBlob({ delay, position, blur }: { delay: number; position: string; blur: string }) {
  return (
    <motion.div
      animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute ${position} ${blur} rounded-full opacity-20 pointer-events-none`}
    />
  );
}

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { 
      icon: <Users className="w-8 h-8" />, 
      title: "Matchmaking Intelligent", 
      desc: "Notre IA analyse ton profil pour te trouver le partenaire parfait adapté à ton style de jeu" 
    },
    { 
      icon: <Gamepad2 className="w-8 h-8" />, 
      title: "12+ Jeux Supportés", 
      desc: "Valorant, LoL, Apex, CS2, Fortnite et bien d'autres titres populaires" 
    },
    { 
      icon: <Shield className="w-8 h-8" />, 
      title: "Trouvez Vos Matchs", 
      desc: "Retrouvez Discord, pseudo et infos pour commencer à jouer immédiatement" 
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Communauté Gaming",
      desc: "Rejoinz des milliers de gamers en quête de partenaires sérieux"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-background" />
        
        {/* Subtle animated blobs */}
        <FloatingBlob delay={0} position="top-10 -left-32" blur="w-80 h-80 bg-cyan-500" />
        <FloatingBlob delay={1} position="top-1/3 -right-40" blur="w-96 h-96 bg-purple-600" />
        <FloatingBlob delay={2} position="bottom-10 left-1/3" blur="w-72 h-72 bg-pink-500" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-3 backdrop-blur-lg bg-background/30 border-b border-primary/10">
        <motion.div 
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/")}
        >
          <MatchMateLogo size="sm" />
          <span className="font-display font-black text-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            MatchMate
          </span>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="outline" onClick={() => navigate("/auth")} className="text-sm font-semibold">
            Se connecter
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold w-fit"
            >
              <Zap className="w-4 h-4" />
              Le matchmaking du gaming
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                TROUVE TON <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  DUO
                </span>
              </h1>
              {/* Glow effect behind text */}
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-3xl blur-3xl -z-10 opacity-50" />
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-lg"
            >
              Analyse intelligente de ton profil gaming. Trouve le partenaire idéal pour tes ranked, tes sessions casual ou tes tournois. 
              <br />
              <span className="text-white font-semibold">Fini les games solo frustrantes.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black font-bold text-base px-8 h-14 rounded-xl"
                >
                  Commencer <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative h-96 lg:h-full hidden lg:flex items-center justify-center"
          >
            {/* Floating cards mockup */}
            <div className="relative w-full h-full max-h-96">
              {/* Card 1 */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 left-0 w-64 h-80 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 rounded-2xl backdrop-blur-md border border-primary/50 p-6 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 mb-4" />
                <div className="space-y-3">
                  <div className="h-3 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/20 rounded w-full" />
                  <div className="h-3 bg-white/20 rounded w-2/3" />
                </div>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-32 right-0 w-64 h-80 bg-gradient-to-br from-purple-600/30 to-pink-500/30 rounded-2xl backdrop-blur-md border border-primary/50 p-6 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 mb-4" />
                <div className="space-y-3">
                  <div className="h-3 bg-white/20 rounded w-3/4" />
                  <div className="h-3 bg-white/20 rounded w-full" />
                  <div className="h-3 bg-white/20 rounded w-1/2" />
                </div>
              </motion.div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-transparent to-pink-500/20 rounded-3xl filter blur-3xl opacity-50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4 sm:px-8 bg-gradient-to-b from-transparent via-black/50 to-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
              Pourquoi choisir <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text">MatchMate</span> ?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              La plateforme la plus avancée pour trouver tes partenaires gaming
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <div className="relative bg-slate-900/60 backdrop-blur-md border border-primary/20 hover:border-primary/50 rounded-2xl p-8 transition-all duration-300 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/30 to-purple-600/30 flex items-center justify-center text-cyan-400 group-hover:text-purple-400 transition-colors mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subtle transition divider to smooth sections */}
      <div className="relative z-10 -mt-8 mb-8 pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="h-20 rounded-3xl bg-gradient-to-b from-transparent via-black/8 to-transparent backdrop-blur-sm opacity-60" />
        </div>
      </div>

      {/* AI Matching Section */}
      <section className="relative z-10 py-32 px-4 sm:px-8 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: AI Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative h-96 lg:h-full min-h-96 flex items-center justify-center"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 rounded-3xl blur-2xl" />

              {/* Animated scanning circle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 rounded-full border-2 border-cyan-500/30 opacity-50"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute w-80 h-80 rounded-full border-2 border-purple-600/20 opacity-30"
              />

              {/* Center AI icon */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative z-10 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/50"
              >
                <div className="text-5xl">✨</div>
              </motion.div>

              {/* Floating info cards */}
              {[
                { label: "Analyse", icon: "📊", pos: "absolute -left-10 top-10" },
                { label: "Match", icon: "🎯", pos: "absolute -right-10 top-20" },
                { label: "Compatibilité", icon: "💫", pos: "absolute left-1/4 -bottom-10" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  className={`${item.pos} bg-slate-900/60 backdrop-blur-md border border-primary/30 rounded-lg px-4 py-2 text-center z-20`}
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="text-xs text-slate-300 font-semibold">{item.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Right: Text & CTA */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-semibold mb-6 w-fit"
                >
                  <Sparkles className="w-4 h-4" />
                  Alimentée par l'IA
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight"
                >
                  Laisse l'IA <br />
                  <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text">
                    trouver ton duo
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-lg text-slate-300 leading-relaxed max-w-lg mb-8"
                >
                  Notre algorithme d'IA analyse en profondeur ton profil gaming, tes préférences, ton style de jeu et tes disponibilités pour te proposer les meilleurs matchs. <br /><br />
                  <span className="text-white font-semibold">Pas de perte de temps. Juste les bonnes rencontres.</span>
                </motion.p>
              </div>

              {/* Feature bullets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  "Analyse comportementale en temps réel",
                  "Matching basé sur la compatibilité",
                  "Résultats garantis en moins de 24h"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600" />
                    <p className="text-slate-300 font-medium">{feature}</p>
                  </div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pt-4"
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black font-black text-lg px-10 h-16 rounded-xl shadow-2xl shadow-cyan-500/50 w-full sm:w-auto"
                >
                  Mode de jeu <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
              Comment ça <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text">fonctionne</span> ?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              4 étapes simples pour trouver ton partenaire idéal
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                step: "01", 
                title: "Crée ton profil", 
                desc: "Inscris-toi avec tes infos gaming et tes préférences",
                gradient: "from-cyan-400 to-blue-500"
              },
              { 
                step: "02", 
                title: "Réponds aux questions", 
                desc: "Jeux favoris, niveau, style, disponibilités",
                gradient: "from-purple-400 to-cyan-500"
              },
              { 
                step: "03", 
                title: "Reçois tes matchs", 
                desc: "Notre IA te propose les meilleurs partenaires",
                gradient: "from-pink-400 to-purple-500"
              },
              { 
                step: "04", 
                title: "Joue ensemble", 
                desc: "Contactez directement et commencez à gagner",
                gradient: "from-cyan-400 to-pink-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Connection line */}
                {i < 3 && (
                  <div className="hidden md:block absolute top-20 -right-4 w-8 h-1 bg-gradient-to-r from-cyan-500 to-purple-600 opacity-30" />
                )}
                
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-primary/20 group-hover:border-primary/50 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-black text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-300">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Removed: Stats, Gallery, Testimonials, and Features Showcase sections per request */}

      {/* Call to Action Section with Animation */}
      <section className="relative z-10 py-32 px-4 sm:px-8 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative"
        >
          {/* Animated background elements */}
          <div className="absolute -inset-20 bg-gradient-to-r from-cyan-500/30 via-purple-600/30 to-pink-500/30 blur-3xl opacity-20 -z-10 animate-pulse" />
          
          <div className="bg-gradient-to-r from-cyan-500/10 via-purple-600/10 to-pink-500/10 rounded-3xl border border-primary/30 p-12 backdrop-blur-sm relative overflow-hidden">
            {/* Animated gradient background */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 opacity-30 blur-2xl -z-10 rounded-3xl"
            />

            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              Rejoins les <br />
              <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text">
                joueurs MatchMate
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
            >
              Trouve ton duo en moins de 24h et commence à dominer ensemble. C'est gratuit et sans engagement.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-cyan-400 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black font-black text-lg px-10 h-16 rounded-xl shadow-2xl shadow-cyan-500/50"
              >
                Commencer Maintenant <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
