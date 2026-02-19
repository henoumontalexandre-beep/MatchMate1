
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  avatar_emoji TEXT NOT NULL DEFAULT '🎮',
  bio TEXT DEFAULT '',
  main_game TEXT DEFAULT '',
  games TEXT[] DEFAULT '{}',
  level TEXT NOT NULL DEFAULT 'intermédiaire' CHECK (level IN ('débutant', 'intermédiaire', 'avancé', 'expert')),
  play_style TEXT NOT NULL DEFAULT 'chill' CHECK (play_style IN ('compétitif', 'chill', 'tryhard', 'fun')),
  availability TEXT[] DEFAULT '{}',
  discord_tag TEXT DEFAULT '',
  game_username TEXT DEFAULT '',
  phone_number TEXT DEFAULT '',
  steam_epic_link TEXT DEFAULT '',
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  matched_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL DEFAULT 0,
  match_mode TEXT NOT NULL DEFAULT 'normal' CHECK (match_mode IN ('compétitif', 'chill', 'normal')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(requester_id, matched_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own matches"
  ON public.matches FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = matched_id);

CREATE POLICY "Users can create matches"
  ON public.matches FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update matches they're involved in"
  ON public.matches FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = matched_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'Player_' || LEFT(NEW.id::text, 6)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
