import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://dozlintkzvgtfjlflkyp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvemxpbnRrenZndGZqbGZsa3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDEwNzcsImV4cCI6MjA3NTQ3NzA3N30.BgI5poUTuFJ7OfyfQYmKnyW9lnyRqkL_YKV0zXG7uD4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  const baseUrl = 'https://somosbrilus.com';
  
  // Static pages (excluding noindex pages like /gracias)
  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
    { url: '/sobre-nosotros', changefreq: 'monthly', priority: '0.8' },
    { url: '/contacto', changefreq: 'monthly', priority: '0.8' },
    { url: '/nuestros-blogs', changefreq: 'daily', priority: '0.9' },
    { url: '/aviso-de-privacidad', changefreq: 'yearly', priority: '0.5' },
    { url: '/quiz-aba', changefreq: 'monthly', priority: '0.9' },
    { url: '/autismo-cdmx', changefreq: 'weekly', priority: '0.9' },
    { url: '/careers', changefreq: 'monthly', priority: '0.8' },
  ];

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false });

  // Fetch visible team members
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('id, updated_at')
    .eq('visible', true)
    .order('order_index', { ascending: true });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add team member profiles
  teamMembers?.forEach(member => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/equipo/${member.id}</loc>\n`;
    xml += `    <lastmod>${new Date(member.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += '  </url>\n';
  });

  // Add blog posts
  posts?.forEach(post => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/nuestros-blogs/${post.slug}</loc>\n`;
    xml += `    <lastmod>${new Date(post.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  // Write to public folder
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  
  console.log('✅ Sitemap generated successfully!');
  console.log(`📄 Total URLs: ${staticPages.length + (posts?.length || 0)}`);
}

generateSitemap().catch(console.error);
