import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  role_title: string;
  bio_short: string | null;
  photo_url: string | null;
  presentacion_personal: string | null;
  credenciales: string[] | null;
  filosofia: string | null;
}

export const TeamSection = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('id, name, role_title, bio_short, photo_url, presentacion_personal, credenciales, filosofia')
        .eq('visible', true)
        .order('order_index', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasDetailContent = (member: TeamMember) =>
    member.presentacion_personal ||
    (member.credenciales && member.credenciales.length > 0) ||
    member.filosofia ||
    member.bio_short;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-[1440px] mx-auto">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square w-full bg-brand-grey rounded-2xl" />
            <div className="mt-4">
              <div className="h-5 bg-brand-grey rounded w-3/4 mb-2" />
              <div className="h-4 bg-brand-grey rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-body-lg text-brand-black">
          Próximamente conocerás a nuestro equipo.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-[1440px] mx-auto">
      {members.map(member => {
        const Wrapper = hasDetailContent(member) ? Link : 'div';
        const wrapperProps = hasDetailContent(member)
          ? { to: `/equipo/${member.id}` }
          : {};

        return (
          <Wrapper
            key={member.id}
            className="group block"
            {...(wrapperProps as any)}
          >
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-brand-grey">
              {member.photo_url ? (
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand-charcoal">
                  <span className="text-5xl font-bold text-brand-white/80">
                    {member.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-body-lg md:text-h5 text-brand-black font-bold leading-tight">
                {member.name}
              </h4>
              <p className="text-body-sm text-brand-black/50 mt-1">
                {member.role_title}
              </p>
              {member.bio_short && (
                <p className="text-body-sm text-brand-black/60 mt-2 line-clamp-2 leading-relaxed">
                  {member.bio_short}
                </p>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
};
