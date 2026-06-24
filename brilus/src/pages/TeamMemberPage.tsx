import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, GraduationCap, Globe, Award, ChevronDown } from 'lucide-react';
import DOMPurify from 'dompurify';
import NavbarBrilus from '@/components/NavbarBrilus';
import Footer from '@/components/Footer';
import { SEOHead } from '@/components/SEOHead';

interface CredencialDetalle {
  institution: string;
  logo_url: string;
  title: string;
}

interface TeamMember {
  id: string;
  name: string;
  role_title: string;
  bio_short: string | null;
  photo_url: string | null;
  presentacion_personal: string | null;
  credenciales: string[] | null;
  credenciales_detalle: CredencialDetalle[] | null;
  consulting_partnership: { logo_url?: string; name: string; description: string } | null;
  filosofia: string | null;
  specialties: string[] | null;
  languages: string[] | null;
  featured_quote: string | null;
  years_experience: number | null;
  certification_number: string | null;
}

const TeamMemberPage = () => {
  const { id } = useParams<{id: string;}>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllCredentials, setShowAllCredentials] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchMember = async () => {
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('id, name, role_title, bio_short, photo_url, presentacion_personal, credenciales, credenciales_detalle, consulting_partnership, filosofia, specialties, languages, featured_quote, years_experience, certification_number')
          .eq('id', id)
          .eq('visible', true)
          .single();
        if (error) throw error;
        setMember(data as any);
      } catch {
        setMember(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  const hasDetailedCredentials = member?.credenciales_detalle && member.credenciales_detalle.length > 0;
  const hasPlainCredentials = !hasDetailedCredentials && member?.credenciales && member.credenciales.length > 0;
  const hasSpecialties = member?.specialties && member.specialties.length > 0;
  const hasLanguages = member?.languages && member.languages.length > 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarBrilus />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-8 md:px-10 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
              <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl bg-brand-grey" />
              <div className="space-y-3">
                <div className="h-8 bg-brand-grey rounded w-48" />
                <div className="h-5 bg-brand-grey rounded w-32" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarBrilus />
        <div className="pt-24 pb-20 text-center">
          <p className="text-body-lg text-brand-black/60">Miembro no encontrado.</p>
          <Link to="/sobre-nosotros" className="text-brand-blue underline mt-4 inline-block">
            Volver al equipo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if years_experience is already mentioned in the bio
  const yearsInBio = member.presentacion_personal?.includes(`${member.years_experience} años`);

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title={`${member.name} — ${member.role_title} | Brilus`}
        description={member.presentacion_personal?.slice(0, 155) || `Conoce a ${member.name}, ${member.role_title} en Brilus.`}
      />

      <NavbarBrilus />

      {/* Hero header — two-column layout inspired by leadership profiles */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-16 bg-white">
        <div className="max-w-5xl mx-auto w-full px-6 md:px-10">
          <Link
            to="/sobre-nosotros"
            className="inline-flex items-center gap-1.5 text-body-sm text-brand-black/40 hover:text-brand-black transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Nuestro equipo
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
            {/* Left: Photo with role badge */}
            <div className="relative">
              {/* Role badge */}
              <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-brand-black text-xs font-semibold px-4 py-1.5 rounded-md shadow-sm border border-brand-grey/40">
                {member.role_title}
              </span>

              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-blue-50">
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-charcoal">
                    <span className="text-7xl font-bold text-brand-white/80">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Name, bio, details */}
            <div className="space-y-6 md:pt-4">
              <div>
                <h1 className="text-h2 md:text-h1 text-brand-black font-bold leading-tight mb-3">
                  {member.name}
                </h1>

              {member.bio_short && (
                  <p className="text-body-lg md:text-xl text-brand-black/60 leading-relaxed">
                    {member.bio_short}
                  </p>
                )}
              </div>

              {/* Languages & Certification */}
              <div className="space-y-2">
                {hasLanguages && (
                  <div className="flex items-center gap-2 text-brand-black/50">
                    <Globe className="w-5 h-5" />
                    <span className="text-base font-medium">
                      {member.languages!.join(' · ')}
                    </span>
                  </div>
                )}
                {member.certification_number && (
                  <div className="flex items-center gap-2 text-brand-black/50">
                    <Award className="w-5 h-5" />
                    <span className="text-base font-medium">
                      {member.certification_number}
                    </span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <hr className="border-brand-grey/50" />


              {/* Detailed credentials */}
              {hasDetailedCredentials && (() => {
                const allCreds = member.credenciales_detalle!;
                const visibleCreds = showAllCredentials ? allCreds : allCreds.slice(0, 3);
                const hasMore = allCreds.length > 3;
                return (
                  <div>
                    <h3 className="text-sm text-brand-black/40 uppercase tracking-widest font-semibold mb-3">
                      Educación y Credenciales
                    </h3>
                    <div className="space-y-3">
                      {visibleCreds.map((cred, i) => (
                        <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] border border-brand-grey/30">
                          <div className="w-12 h-12 rounded-xl bg-brand-grey/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {cred.logo_url ? (
                              <img src={cred.logo_url} alt={cred.institution} className="w-full h-full object-contain p-1.5" />
                            ) : (
                              <GraduationCap className="w-5 h-5 text-brand-black/30" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-base font-bold text-brand-black leading-tight">{cred.institution}</p>
                            <p className="text-sm text-brand-black/45 mt-0.5">{cred.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {hasMore && (
                      <button
                        onClick={() => setShowAllCredentials(!showAllCredentials)}
                        className="mt-3 flex items-center gap-1 text-sm font-medium text-brand-blue hover:text-brand-blue/80 transition-colors"
                      >
                        {showAllCredentials ? "Ver menos" : "Ver más"} 
                        <ChevronDown className={`w-4 h-4 transition-transform ${showAllCredentials ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Plain credentials fallback */}
              {hasPlainCredentials && (
                <div>
                  <h3 className="text-xs text-brand-black/40 uppercase tracking-widest font-semibold mb-3">
                    Credenciales
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.credenciales!.map((cred, i) => (
                      <span key={i} className="rounded-full border border-brand-blue/20 text-brand-blue text-xs font-medium px-3 py-1">
                        {cred}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content body */}
      <section className="max-w-5xl mx-auto w-full px-6 md:px-10 py-14 md:py-20 space-y-12">

        {/* Featured quote */}
        {member.featured_quote && (
          <blockquote className="relative bg-gradient-to-br from-brand-coral/[0.08] to-brand-amber/[0.04] border-l-[5px] border-brand-coral rounded-2xl px-10 py-10 md:px-14 md:py-12">
            <span className="absolute top-4 left-6 text-7xl text-brand-coral/20 font-serif leading-none select-none">"</span>
            <p className="text-2xl md:text-[1.75rem] text-brand-black/75 font-medium italic leading-relaxed pl-6">
              {member.featured_quote}
            </p>
          </blockquote>
        )}

        {member.presentacion_personal && (
          <div
            className="prose prose-lg max-w-none text-brand-black/70 leading-relaxed
              prose-p:mb-4 prose-p:mt-0
              prose-headings:text-brand-black prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-3
              prose-strong:text-brand-black/85 prose-strong:font-semibold
              prose-ul:my-4 prose-li:my-1
              prose-blockquote:border-brand-coral/30 prose-blockquote:text-brand-black/60 prose-blockquote:italic"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                member.presentacion_personal.includes('<p>') || member.presentacion_personal.includes('<h')
                  ? member.presentacion_personal
                  : member.presentacion_personal
                      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
                      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .split(/\n\n+/)
                      .map(p => p.trim())
                      .filter(Boolean)
                      .map(p => p.startsWith('<h') ? p : `<p>${p}</p>`)
                      .join('')
              )
            }}
          />
        )}

        {/* Experience chips */}
        {hasSpecialties && (
          <div className="space-y-3">
            <h2 className="text-sm text-brand-black/40 uppercase tracking-widest font-semibold">
              Experiencia
            </h2>
            <div className="flex flex-wrap gap-2">
              {member.years_experience && !yearsInBio && (
                <span className="rounded-full bg-brand-charcoal/[0.06] text-brand-black/70 text-sm font-medium px-4 py-2">
                  +{member.years_experience} años de experiencia
                </span>
              )}
              {member.specialties!.map((spec, i) => (
                <span key={i} className="rounded-full bg-brand-charcoal/[0.06] text-brand-black/70 text-sm font-medium px-4 py-2">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {!hasSpecialties && member.years_experience && !yearsInBio && (
          <span className="inline-block rounded-full bg-brand-charcoal/[0.06] text-brand-black/70 text-sm font-medium px-4 py-2">
            +{member.years_experience} años de experiencia
          </span>
        )}

        {/* Consulting Partnership */}
        {member.consulting_partnership && (
          <div>
            <h2 className="text-sm text-brand-black/40 uppercase tracking-widest font-semibold mb-5">
              Consulting Partnership
            </h2>
            <div className="flex items-start gap-5 p-5 rounded-xl bg-brand-charcoal/[0.02] border border-brand-grey/60">
              {member.consulting_partnership.logo_url ? (
                <div className="w-14 h-14 rounded-lg bg-white border border-brand-grey/50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={member.consulting_partnership.logo_url}
                    alt={member.consulting_partnership.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-brand-charcoal/5 border border-brand-grey/50 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-brand-black/20">
                    {member.consulting_partnership.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="min-w-0">
                <p className="text-body-sm font-semibold text-brand-black leading-tight mb-1">
                  {member.consulting_partnership.name}
                </p>
                <p className="text-sm text-brand-black/55 leading-relaxed">
                  {member.consulting_partnership.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {member.filosofia && (
          <div className="border-l-4 border-brand-coral/25 pl-6">
            <p className="text-body-md text-brand-black/55 italic leading-relaxed">
              "{member.filosofia}"
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default TeamMemberPage;
