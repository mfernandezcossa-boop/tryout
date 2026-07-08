ALTER TABLE testimonials
  ADD COLUMN IF NOT EXISTS author_vinculo text,
  ADD COLUMN IF NOT EXISTS youtube_url text;
