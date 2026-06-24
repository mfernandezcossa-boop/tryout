import { Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "./RichTextEditor";
import DOMPurify from "dompurify";

interface BlogContentSectionProps {
  content: string;
  contentHtml: string;
  onChange: (content: string) => void;
  onHtmlChange: (html: string) => void;
}

export const BlogContentSection = ({
  content,
  contentHtml,
  onChange,
  onHtmlChange,
}: BlogContentSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenido del Artículo</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="mr-2 h-4 w-4" />
              Vista Previa
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-4">
            <RichTextEditor 
              content={content} 
              onChange={onChange}
              onHtmlChange={onHtmlChange}
              placeholder="Escribe el contenido de tu artículo aquí..."
            />
          </TabsContent>
          
          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-lg p-8 bg-background min-h-[400px]">
              {contentHtml ? (
                <div 
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(contentHtml) }}
                />
              ) : (
                <p className="text-muted-foreground italic">No hay contenido para previsualizar</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
