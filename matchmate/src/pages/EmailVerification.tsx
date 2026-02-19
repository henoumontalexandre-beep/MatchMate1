import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PendingProfileData {
  username: string;
  avatar_emoji: string;
  games: string[];
  level: string;
  play_style: string;
  availability: string[];
  bio: string;
  main_game: string;
  discord_tag: string;
  game_username: string;
  phone_number: string;
  steam_epic_link: string;
}

const EmailVerification = () => {
  const { user, session } = useAuth();
  const { updateProfile } = useProfile();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAndSave = async () => {
      try {
        // Wait for user to be authenticated
        let attempts = 0;
        const maxAttempts = 40; // 40 * 500ms = 20 seconds max wait

        while (!user && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 500));
          attempts++;
        }

        if (!user) {
          throw new Error("Authentification échouée. Veuillez vérifier vos identifiants et réessayer.");
        }

        console.log("✅ User authenticated:", user.email);

        // Get pending profile data from localStorage
        const pendingDataStr = localStorage.getItem("pendingProfileData");
        
        if (!pendingDataStr) {
          throw new Error("Données de profil manquantes. Veuillez recommencer l'inscription.");
        }

        const pendingData: PendingProfileData = JSON.parse(pendingDataStr);

        console.log("💾 Saving profile data...");

        // Save profile data to database
        const { error: profileError } = await updateProfile({
          username: pendingData.username,
          avatar_emoji: pendingData.avatar_emoji,
          games: pendingData.games,
          level: pendingData.level as "débutant" | "intermédiaire" | "avancé" | "expert",
          play_style: pendingData.play_style as "compétitif" | "chill" | "tryhard" | "fun",
          availability: pendingData.availability,
          bio: pendingData.bio,
          main_game: pendingData.main_game,
          discord_tag: pendingData.discord_tag,
          game_username: pendingData.game_username,
          phone_number: pendingData.phone_number,
          steam_epic_link: pendingData.steam_epic_link,
        });

        if (profileError) {
          console.error("Profile save error:", profileError);
          throw new Error("Erreur lors de la sauvegarde du profil: " + profileError.message);
        }

        console.log("✅ Profile saved successfully");

        // Clear localStorage
        localStorage.removeItem("pendingProfileData");
        localStorage.removeItem("pendingEmail");

        // Wait a moment before redirecting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log("🚀 Redirecting to dashboard...");
        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("Verification error:", err);
        setError(err instanceof Error ? err.message : "Une erreur s'est produite");
        setLoading(false);
      }
    };

    verifyAndSave();
  }, [user, updateProfile, navigate]);

  if (loading && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Vérification en cours...</h1>
          <p className="text-muted-foreground">
            Nous créons votre compte et sauvegardons votre profil.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Erreur de vérification</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate("/setup")}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Retour au formulaire d'inscription
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Compte créé! ✓</h1>
        <p className="text-muted-foreground mb-8">
          Redirection en cours...
        </p>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
