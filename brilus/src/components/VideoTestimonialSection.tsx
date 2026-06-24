import React from "react";
import { Play } from "lucide-react";

interface VideoTestimonialSectionProps {
  source?: "youtube" | "mp4";
  videoId?: string;
  videoUrl?: string;
  posterUrl?: string;
  authorName?: string;
  authorRole?: string;
  aspect?: "16/9" | "9/16";
  title?: string;
  eyebrow?: string;
}

const VideoTestimonialSection: React.FC<VideoTestimonialSectionProps> = ({
  source = "youtube",
  videoId = "prbQaK4s70U",
  videoUrl,
  posterUrl,
  authorName = "Familia Brilus",
  authorRole,
  aspect = "16/9",
  title = "Escucha a una familia Brilus",
  eyebrow = "Testimonio en video",
}) => {
  const aspectClass = aspect === "9/16" ? "aspect-[9/16]" : "aspect-video";
  const widthClass = aspect === "9/16" ? "max-w-sm" : "max-w-3xl";

  return (
    <section className="w-full section-py bg-brand-white">
      <div className="section-px">
        <div className={`${widthClass} mx-auto`}>
          <div className="text-center mb-8 md:mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-coral-50 text-brand-coral rounded-brilus-pill text-body-sm font-medium mb-4">
              <Play className="w-4 h-4" />
              {eyebrow}
            </div>
            <h2 className="text-h3 md:text-h2 text-brand-black">{title}</h2>
          </div>

          <div className="relative w-full rounded-brilus-card overflow-hidden shadow-brilus-2 bg-brand-black/5">
            <div className={aspectClass}>
              {source === "youtube" ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title={`Testimonio de ${authorName}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={posterUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-body-md font-medium text-brand-black">{authorName}</p>
            {authorRole && (
              <p className="text-body-sm text-muted-foreground">{authorRole}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoTestimonialSection;
