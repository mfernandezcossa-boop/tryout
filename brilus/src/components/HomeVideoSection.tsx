import React from "react";

const HomeVideoSection: React.FC = () => {
  const youtubeVideoId = "kGImyTSKWXs";
  const headingId = "home-video-testimonial-heading";

  return (
    <section className="w-full py-6 md:section-py" aria-labelledby={headingId}>
      <div className="section-px section-container max-md:!px-4 mb-3 md:mb-0">
        <h2
          id={headingId}
          className="md:sr-only text-h5 text-brand-black"
        >
          Karla, mamá de Emmet: un testimonio sobre la terapia ABA en Brilus
        </h2>
      </div>
      <div className="section-px section-container max-md:!px-0">
        <div className="relative w-full md:rounded-brilus-card overflow-hidden shadow-brilus-1 bg-brand-grey-light aspect-video">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
            title="Testimonio en video de una familia Brilus"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeVideoSection;
