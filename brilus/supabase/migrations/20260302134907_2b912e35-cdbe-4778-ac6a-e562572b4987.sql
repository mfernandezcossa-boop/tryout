INSERT INTO public.user_roles (user_id, role) 
VALUES ('34f5b2fd-ab56-4e1d-9588-23a76bb6d8d4', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO public.users_profiles (user_id, display_name)
VALUES ('34f5b2fd-ab56-4e1d-9588-23a76bb6d8d4', 'Alexia Sanchez')
ON CONFLICT (user_id) DO NOTHING;