import React from "react";
import { ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebinarVideoSectionProps {
  className?: string;
}

const WebinarVideoSection: React.FC<WebinarVideoSectionProps> = ({ className }) => {
  const youtubeVideoId = "prbQaK4s70U";
  const youtubeUrl = "https://youtu.be/prbQaK4s70U";

  return (
    <section className={`w-full section-py bg-muted ${className || ""}`}>
      <div className="section-px max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-coral-50 text-brand-coral rounded-brilus-pill text-body-sm font-medium mb-4">
            <Play className="w-4 h-4" />
            Webinar
          </div>
          <h2 className="text-h2 text-brand-black mb-4">
            Conoce más sobre la Terapia ABA
          </h2>
          <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
            Te invitamos a ver nuestro webinar donde explicamos cómo funciona el método Brilus
            y el impacto que puede tener en el desarrollo de tu hijo.
          </p>
        </div>

        {/* Video Container */}
        <div className="relative w-full rounded-brilus-card overflow-hidden shadow-brilus-2 bg-brand-black/5">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0&modestbranding=1`}
              title="Webinar Brilus - Terapia ABA"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8 md:mt-10">
          <Button asChild variant="outline" size="lg" className="gap-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white transition-colors">
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              Ver en YouTube
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WebinarVideoSection;
