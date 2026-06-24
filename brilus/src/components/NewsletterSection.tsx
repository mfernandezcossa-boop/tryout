import React from 'react';

const newsletterImage =
  'https://dozlintkzvgtfjlflkyp.supabase.co/storage/v1/object/public/Photos/Home/NEWSLETTER%20BANNER.webp';

const NEWSLETTER_URL =
  'https://eab94282.sibforms.com/serve/MUIFANxyTX-sSX8VAEWhA0CxLGuMJr0GXnmeZRdsEnU4KEijtRHvYWbWSIPSvbIhNGtq-Nbx--gm6-6Q8R1j3hIKPk16w72bZaWfuKE7yDM9VqTPFumfXfzrycBaw8wv55b8-wx_Xp-InAgjfLKx0bK8TfrGrBeplvTS9doYvjoL6R5VDC1FP3d9xz8kejilUGvbW4sNieAv-wEhmw==';

const NewsletterSection: React.FC = () => {
  return (
    <section className="w-full bg-secondary section-py-lg py-24 md:py-32">
      <div className="section-px max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image */}
          <div className="order-1 md:order-1">
            <img
              src={newsletterImage}
              alt="Brilus Newsletter — Recursos, tips y organización para acompañar el autismo"
              className="w-full h-auto rounded-brilus-card"
              loading="lazy"
            />
          </div>

          {/* Text + CTA */}
          <div className="order-2 md:order-2 space-y-6 text-center md:text-left">
            <span className="inline-block px-4 py-1 rounded-full bg-brand-blue text-white text-body-sm font-medium">
              Newsletter Brilus
            </span>
            <h2 className="text-h2 text-foreground leading-tight">
              Recursos, tips y organización para acompañar el autismo
            </h2>
            <p className="text-body-lg text-muted-foreground">
              Recibe en tu correo guías prácticas, herramientas clínicas y
              novedades pensadas para familias y profesionales que acompañan
              el desarrollo de niños con autismo.
            </p>
            <div className="flex justify-center md:justify-start pt-2">
              <a
                href={NEWSLETTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-body-md font-medium text-white bg-brand-blue rounded-brilus hover:bg-brand-blue/90 transition-colors shadow-brilus-1"
              >
                Suscribirme a la newsletter
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
