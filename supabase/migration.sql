
-- Add new columns to round_scores table for detailed scoring
ALTER TABLE IF EXISTS public.round_scores
ADD COLUMN IF NOT EXISTS participant1_punches numeric,
ADD COLUMN IF NOT EXISTS participant1_kicks numeric,
ADD COLUMN IF NOT EXISTS participant1_throws numeric,
ADD COLUMN IF NOT EXISTS participant2_punches numeric,
ADD COLUMN IF NOT EXISTS participant2_kicks numeric,
ADD COLUMN IF NOT EXISTS participant2_throws numeric;

-- Update existing scores with default values if needed
UPDATE public.round_scores
SET 
  participant1_punches = ROUND(participant1_score / 3, 1),
  participant1_kicks = ROUND(participant1_score / 3, 1),
  participant1_throws = ROUND(participant1_score / 3, 1),
  participant2_punches = ROUND(participant2_score / 3, 1),
  participant2_kicks = ROUND(participant2_score / 3, 1),
  participant2_throws = ROUND(participant2_score / 3, 1)
WHERE
  participant1_punches IS NULL OR
  participant1_kicks IS NULL OR
  participant1_throws IS NULL OR
  participant2_punches IS NULL OR
  participant2_kicks IS NULL OR
  participant2_throws IS NULL;
