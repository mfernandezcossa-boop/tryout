UPDATE public.team_members 
SET consulting_partnership = '{
  "name": "Consulting Partner",
  "logo_url": "",
  "description": "Colaboración estratégica orientada a garantizar los más altos estándares de excelencia clínica, supervisión continua y desarrollo profesional en cada intervención."
}'::jsonb 
WHERE id = 'ef127f7d-8d97-4e74-bc22-7bb61f8eda36';