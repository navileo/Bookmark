-- Create the bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  user_id UUID DEFAULT auth.uid() NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Users can view only their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks FOR SELECT
USING (auth.uid() = user_id);

-- 2. Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
ON bookmarks FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own bookmarks
CREATE POLICY "Users can update their own bookmarks"
ON bookmarks FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
ON bookmarks FOR DELETE
USING (auth.uid() = user_id);

-- Enable Realtime for the bookmarks table
-- Note: This is usually done in the Supabase Dashboard under Database -> Replication -> supabase_realtime
-- But you can also do it via SQL:
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
