import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'user' | 'moderator' | 'admin' | 'admin_operations' | 'admin_brilers';

export interface UserProfile {
  user_id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoles {
  roles: UserRole[];
}

// Session cache
const SESSION_CACHE_KEY = 'brilus_session_cache';
const CACHE_DURATION = 60000; // 60 seconds

interface CachedSession {
  user: User;
  profile: UserProfile | null;
  roles: UserRole[];
  timestamp: number;
}

export const useAuth = (requiredRoles?: UserRole[]) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRoles>({ roles: [] });
  const [loading, setLoading] = useState(true);
  const [slowConnection, setSlowConnection] = useState(false);
  const navigate = useNavigate();

  // Memoize required roles to prevent unnecessary re-renders
  const memoizedRequiredRoles = useMemo(() => requiredRoles, [JSON.stringify(requiredRoles)]);

  useEffect(() => {
    let isChecking = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let slowConnectionTimeout: ReturnType<typeof setTimeout>;
    let abortController = new AbortController();
    const startTime = performance.now();

    const log = (...args: any[]) => { if (import.meta.env.DEV) console.log(...args); };
    const warn = (...args: any[]) => { if (import.meta.env.DEV) console.warn(...args); };

    const checkAuth = async () => {
      if (isChecking) {
        log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Ya hay una verificación en curso`);
        return;
      }

      isChecking = true;
      log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Iniciando verificación de autenticación...`);

      // Check session cache first
      const cachedData = sessionStorage.getItem(SESSION_CACHE_KEY);
      if (cachedData) {
        try {
          const cached: CachedSession = JSON.parse(cachedData);
          if (Date.now() - cached.timestamp < CACHE_DURATION) {
            log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Usando sesión cacheada`);
            setUser(cached.user);
            setProfile(cached.profile);
            setUserRoles({ roles: cached.roles });
            setLoading(false);
            isChecking = false;
            return;
          }
        } catch (e) {
          console.warn('[useAuth] Error al parsear caché de sesión');
        }
      }

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Sesión obtenida:`, session ? 'Sí' : 'No');
        
        if (sessionError || !session) {
          console.log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] No hay sesión o error:`, sessionError?.message);
          if (memoizedRequiredRoles) {
            navigate('/auth');
          }
          setLoading(false);
          isChecking = false;
          return;
        }

        setUser(session.user);
        console.log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Usuario establecido:`, session.user.id);

        // Fetch profile and roles in parallel
        const [profileResult, rolesResult] = await Promise.all([
          supabase
            .from('users_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .abortSignal(abortController.signal)
            .single(),
          supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .abortSignal(abortController.signal)
        ]);

        console.log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Datos cargados en paralelo`);

        const profileData = profileResult.error ? null : (profileResult.data as UserProfile);
        const roles: UserRole[] = rolesResult.error ? ['user'] : (rolesResult.data?.map(r => r.role as UserRole) || ['user']);

        setProfile(profileData);
        setUserRoles({ roles });

        // Cache the session
        const cacheData: CachedSession = {
          user: session.user,
          profile: profileData,
          roles,
          timestamp: Date.now()
        };
        sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(cacheData));

        console.log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Roles cargados:`, roles);

        // Check if user has required role
        if (memoizedRequiredRoles && !memoizedRequiredRoles.some(role => roles.includes(role))) {
          console.log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Usuario no tiene los roles requeridos`);
          navigate('/');
        }

        console.log(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Verificación completada exitosamente`);
        setLoading(false);
        setSlowConnection(false);
        isChecking = false;
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.log('[useAuth] Verificación cancelada');
          return;
        }
        console.error(`[useAuth] [+${Math.round(performance.now() - startTime)}ms] Error en verificación:`, error);
        if (memoizedRequiredRoles) {
          navigate('/auth');
        }
        setLoading(false);
        isChecking = false;
      }
    };

    // Set slow connection warning at 3 seconds
    slowConnectionTimeout = setTimeout(() => {
      if (loading) {
        console.warn('[useAuth] Conexión lenta detectada');
        setSlowConnection(true);
      }
    }, 3000);

    // Set timeout to prevent infinite loading at 5 seconds
    timeoutId = setTimeout(() => {
      if (loading) {
        console.error('[useAuth] Timeout: La verificación tomó demasiado tiempo');
        setLoading(false);
        isChecking = false;
      }
    }, 5000);

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[useAuth] Auth state changed: ${event}`);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setUserRoles({ roles: [] });
        sessionStorage.removeItem(SESSION_CACHE_KEY);
        if (memoizedRequiredRoles) {
          navigate('/auth');
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Clear cache on sign in to force fresh data
        sessionStorage.removeItem(SESSION_CACHE_KEY);
        
        if (session) {
          // Defer async operations
          setTimeout(() => {
            setUser(session.user);
            
            Promise.all([
              supabase.from('users_profiles').select('*').eq('user_id', session.user.id).single(),
              supabase.from('user_roles').select('role').eq('user_id', session.user.id)
            ]).then(([profileResult, rolesResult]) => {
              const profileData = profileResult.error ? null : (profileResult.data as UserProfile);
              const roles: UserRole[] = rolesResult.error ? ['user'] : (rolesResult.data?.map(r => r.role as UserRole) || ['user']);
              
              setProfile(profileData);
              setUserRoles({ roles });
              
              // Update cache
              const cacheData: CachedSession = {
                user: session.user,
                profile: profileData,
                roles,
                timestamp: Date.now()
              };
              sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(cacheData));
            });
          }, 0);
        }
      }
    });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(slowConnectionTimeout);
      abortController.abort();
      subscription.unsubscribe();
    };
  }, [navigate, memoizedRequiredRoles]);

  return { user, profile, userRoles, loading, slowConnection };
};
