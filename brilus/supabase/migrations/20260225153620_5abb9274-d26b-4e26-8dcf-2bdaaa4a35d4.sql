
-- Fix typo in Elizabeth's bio
UPDATE public.team_members
SET presentacion_personal = REPLACE(presentacion_personal, 'la connection con', 'la conexión con'),
    bio_short = REPLACE(bio_short, 'la connection con', 'la conexión con')
WHERE id = 'ef127f7d-8d97-4e74-bc22-7bb61f8eda36';
