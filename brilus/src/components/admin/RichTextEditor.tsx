import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import ResizableImageExtension from 'tiptap-extension-resize-image';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onHtmlChange?: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ content, onChange, onHtmlChange, placeholder }: RichTextEditorProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      ResizableImageExtension.configure({
        inline: false,
        HTMLAttributes: {
          class: 'rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Escribe el contenido de tu post aquí...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none min-h-[400px] p-6',
      },
    },
    onUpdate: ({ editor }) => {
      // Convertir a Markdown compatible
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
      onHtmlChange?.(html);
    },
  });

  // Cargar contenido inicial
  useEffect(() => {
    if (editor && content && isInitialMount.current) {
      const html = markdownToHtml(content);
      editor.commands.setContent(html);
      isInitialMount.current = false;
    }
  }, [editor, content]);

  // Cargar contenido inicial
  useEffect(() => {
    if (editor && content && isInitialMount.current) {
      const html = markdownToHtml(content);
      editor.commands.setContent(html);
      isInitialMount.current = false;
    }
  }, [editor, content]);

  // Convertir HTML de TipTap a Markdown
  const htmlToMarkdown = (html: string): string => {
    let md = html;
    
    // Encabezados
    md = md.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
    md = md.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
    md = md.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
    
    // Formato
    md = md.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    md = md.replace(/<em>(.*?)<\/em>/g, '*$1*');
    md = md.replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');
    
    // Links
    md = md.replace(/<a href="(.*?)".*?>(.*?)<\/a>/g, '[$2]($1)');
    
    // Imágenes (con soporte para data-width y data-height)
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, '![$2]($1)');
    
    // Listas desordenadas
    md = md.replace(/<ul>(.*?)<\/ul>/gs, (match, content) => {
      const items = content.match(/<li>(.*?)<\/li>/g) || [];
      return items.map((item: string) => {
        const text = item.replace(/<li>(.*?)<\/li>/, '$1');
        return `- ${text}`;
      }).join('\n') + '\n\n';
    });
    
    // Listas ordenadas
    md = md.replace(/<ol>(.*?)<\/ol>/gs, (match, content) => {
      const items = content.match(/<li>(.*?)<\/li>/g) || [];
      return items.map((item: string, index: number) => {
        const text = item.replace(/<li>(.*?)<\/li>/, '$1');
        return `${index + 1}. ${text}`;
      }).join('\n') + '\n\n';
    });
    
    // Blockquotes
    md = md.replace(/<blockquote>(.*?)<\/blockquote>/gs, (match, content) => {
      const lines = content.split('\n');
      return lines.map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n';
    });
    
    // Párrafos
    md = md.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    
    // Limpiar tags restantes
    md = md.replace(/<br\s*\/?>/g, '\n');
    md = md.replace(/<[^>]*>/g, '');
    md = md.replace(/&nbsp;/g, ' ');
    md = md.replace(/&amp;/g, '&');
    md = md.replace(/&lt;/g, '<');
    md = md.replace(/&gt;/g, '>');
    md = md.replace(/&quot;/g, '"');
    
    // Limpiar espacios múltiples
    md = md.replace(/\n{3,}/g, '\n\n');
    md = md.trim();
    
    return md;
  };

  // Convertir Markdown a HTML para cargar en el editor
  const markdownToHtml = (markdown: string): string => {
    let html = markdown;
    
    // Encabezados
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Imágenes (antes de links)
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Negrita
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Cursiva
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Listas desordenadas
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*?<\/li>\n?)+/gs, '<ul>$&</ul>');
    
    // Listas ordenadas
    html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
    
    // Blockquotes
    html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Párrafos
    html = html.split('\n\n').map(para => {
      if (!para.match(/^<(h[1-3]|ul|ol|blockquote|li)/)) {
        return `<p>${para}</p>`;
      }
      return para;
    }).join('\n');
    
    return html;
  };

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona un archivo de imagen válido',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'La imagen no debe superar los 5MB',
        variant: 'destructive',
      });
      return;
    }

    try {
      toast({
        title: 'Subiendo imagen...',
        description: 'Por favor espera',
      });

      // Generar nombre único
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      // Subir a Supabase Storage
      const { data, error } = await supabase.storage
        .from('blog-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('blog-media')
        .getPublicUrl(data.path);

      // Insertar imagen en el editor
      editor.chain().focus().setImage({ src: publicUrl }).run();

      toast({
        title: 'Imagen subida',
        description: 'La imagen se ha insertado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error al subir imagen',
        description: error.message || 'Intenta de nuevo',
        variant: 'destructive',
      });
    }

    // Resetear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addLink = () => {
    const url = window.prompt('Introduce la URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden relative">
      {/* Toolbar */}
      <div className="bg-background border-b border-border p-2 flex flex-wrap gap-1 sticky top-0 z-20 shadow-sm">
        <Button
          type="button"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Encabezado 1 (Ctrl+Alt+1)"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Encabezado 2 (Ctrl+Alt+2)"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Encabezado 3 (Ctrl+Alt+3)"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrita (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Cursiva (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Subrayado (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Cita"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px bg-border mx-1" />

        <Button
          type="button"
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          size="sm"
          onClick={addLink}
          title="Insertar enlace"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          title="Insertar imagen"
        >
          <ImageIcon className="h-4 w-4" />
          <span className="ml-2">📷 Insertar imagen</span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Editor */}
      <div className="bg-background max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
