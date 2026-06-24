import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

export const SEOHead = ({
  title,
  description,
  canonical,
  ogImage = "https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/seo/ogimage.png",
  noindex = false,
  structuredData,
}: SEOHeadProps) => {
  const fullCanonical = canonical ? `https://somosbrilus.com${canonical}` : undefined;

  return (
    <Helmet>
      {/* Language */}
      <html lang="es" />
      
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Canonical Link */}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Hreflang for Spanish */}
      {fullCanonical && <link rel="alternate" hrefLang="es" href={fullCanonical} />}
      
      {/* Sitemap & Robots */}
      <link rel="sitemap" type="application/xml" href="https://somosbrilus.com/sitemap.xml" />
      
      {/* Robots Meta */}
      {noindex && <meta name="robots" content="noindex, nofollow, noarchive" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Brilus - Terapia ABA personalizada para niños y jóvenes" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="es_MX" />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : [structuredData])}
        </script>
      )}
    </Helmet>
  );
};
