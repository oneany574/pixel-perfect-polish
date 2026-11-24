import { createFileRoute } from '@tanstack/react-router';
import { getPublishedContent } from '@/lib/cms/cms.functions';
export const Route=createFileRoute('/api/public/media/$')({server:{handlers:{GET:async({params})=>{
 const path=params._splat; if(!path||path.includes('..')||path.includes('/'))return new Response('Not found',{status:404});
 const document=await getPublishedContent();const reference=`/api/public/media/${path}`;
 const inUse=document.sections.filter(s=>s.enabled).some(s=>Object.values(s.fields).includes(reference)||s.items.some(i=>Object.values(i).includes(reference)))||Object.values(document.settings).includes(reference);
 if(!inUse)return new Response('Not found',{status:404});
 const {supabaseAdmin}=await import('@/integrations/supabase/client.server');const {data,error}=await supabaseAdmin.storage.from('website-media').createSignedUrl(path,300);if(error||!data)return new Response('Not found',{status:404});return new Response(null,{status:302,headers:{Location:data.signedUrl,'Cache-Control':'no-store'}});
}}}});
