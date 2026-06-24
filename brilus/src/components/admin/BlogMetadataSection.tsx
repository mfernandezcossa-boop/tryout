import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogMetadataSectionProps {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage: string;
  category: string;
  tagsInput: string;
  authorName: string;
  authorBio: string;
  authorLink: string;
  authorAvatar: string;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onFeaturedImageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onAuthorNameChange: (value: string) => void;
  onAuthorBioChange: (value: string) => void;
  onAuthorLinkChange: (value: string) => void;
  onAuthorAvatarChange: (value: string) => void;
}

export const BlogMetadataSection = ({
  title,
  slug,
  excerpt,
  seoTitle,
  seoDescription,
  featuredImage,
  category,
  tagsInput,
  authorName,
  authorBio,
  authorLink,
  authorAvatar,
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onFeaturedImageChange,
  onCategoryChange,
  onTagsChange,
  onAuthorNameChange,
  onAuthorBioChange,
  onAuthorLinkChange,
  onAuthorAvatarChange,
}: BlogMetadataSectionProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del Post *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Título principal del artículo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL (slug)</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="titulo-del-post"
            />
            <p className="text-xs text-muted-foreground">Se generará automáticamente desde el título</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumen Corto</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              placeholder="Breve descripción que aparecerá en las tarjetas de vista previa"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured-image">Imagen Destacada (URL)</Label>
            <Input
              id="featured-image"
              value={featuredImage}
              onChange={(e) => onFeaturedImageChange(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                placeholder="Educación, Terapia..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separados por comas)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => onTagsChange(e.target.value)}
                placeholder="psicología, educación"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seo-title">Título SEO</Label>
            <Input
              id="seo-title"
              value={seoTitle}
              onChange={(e) => onSeoTitleChange(e.target.value)}
              placeholder="Título optimizado para buscadores (máx 60 caracteres)"
              maxLength={60}
            />
            <p className="text-xs text-muted-foreground">{seoTitle.length}/60 caracteres</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seo-description">Descripción SEO</Label>
            <Textarea
              id="seo-description"
              value={seoDescription}
              onChange={(e) => onSeoDescriptionChange(e.target.value)}
              placeholder="Descripción para los resultados de búsqueda (máx 160 caracteres)"
              maxLength={160}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">{seoDescription.length}/160 caracteres</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Autor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author-name">Nombre del Autor</Label>
            <Input
              id="author-name"
              value={authorName}
              onChange={(e) => onAuthorNameChange(e.target.value)}
              placeholder="Nombre completo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author-bio">Biografía del Autor</Label>
            <Textarea
              id="author-bio"
              value={authorBio}
              onChange={(e) => onAuthorBioChange(e.target.value)}
              placeholder="Breve descripción del autor"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author-link">URL del Autor</Label>
            <Input
              id="author-link"
              value={authorLink}
              onChange={(e) => onAuthorLinkChange(e.target.value)}
              placeholder="https://... (perfil o sitio del autor)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author-avatar">Avatar del Autor (URL)</Label>
            <Input
              id="author-avatar"
              value={authorAvatar}
              onChange={(e) => onAuthorAvatarChange(e.target.value)}
              placeholder="https://... (foto del autor)"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
