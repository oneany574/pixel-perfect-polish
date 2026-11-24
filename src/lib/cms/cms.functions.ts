import { createServerFn } from '@tanstack/react-start';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database } from '@/integrations/supabase/types';
import { contentSchema } from './content';
async function requireAdmin(client:SupabaseClient<Database>,id:string) { const {data,error}=await client.rpc('has_role',{_user_id:id,_role:'admin'}); if(error || !data) throw new Error('Administrator access required'); }
export const getPublishedContent = createServerFn({method:'GET'}).handler(async()=>{
 const url=process.env['SUPABASE_URL']; const key=process.env['SUPABASE_PUBLISHABLE_KEY']; if(!url||!key) throw new Error('Content service unavailable');
 const client=createClient<Database>(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers); if(h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
 const {data,error}=await client.from('cms_documents').select('document').eq('id','published').single(); if(error) throw new Error('Could not load website content'); return contentSchema.parse(data.document);
});
export const getAdminContent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
 await requireAdmin(context.supabase,context.userId);
 const [draft,live,revisions,profile,media]=await Promise.all([context.supabase.from('cms_documents').select('*').eq('id','draft').single(),context.supabase.from('cms_documents').select('updated_at').eq('id','published').single(),context.supabase.from('cms_revisions').select('id,action,created_at').order('created_at',{ascending:false}).limit(30),context.supabase.from('profiles').select('*').eq('id',context.userId).single(),context.supabase.storage.from('website-media').list('',{limit:100,sortBy:{column:'created_at',order:'desc'}})]);
 if(draft.error||live.error||revisions.error||media.error)throw new Error('Could not load the content workspace');
 const files=await Promise.all((media.data??[]).filter(f=>f.id).map(async(f)=>{const {data}=await context.supabase.storage.from('website-media').createSignedUrl(f.name,3600);return {name:f.name,url:data?.signedUrl??'',reference:`/api/public/media/${f.name}`};}));
 return {document:contentSchema.parse(draft.data.document),version:draft.data.version,updatedAt:draft.data.updated_at,publishedAt:live.data.updated_at,revisions:revisions.data,profile:profile.data,email:String(context.claims['email']??''),media:files};
});
export const saveContent=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({document:contentSchema,version:z.number().int(),publish:z.boolean()})).handler(async({context,data})=>{
 await requireAdmin(context.supabase,context.userId); const {data:version,error}=await context.supabase.rpc('cms_save',{_document:data.document,_version:data.version,_publish:data.publish}); if(error)throw new Error(error.message);return {version};
});
export const restoreRevision=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid()})).handler(async({context,data})=>{await requireAdmin(context.supabase,context.userId);const result=await context.supabase.from('cms_revisions').select('document').eq('id',data.id).single();if(result.error)throw new Error('Revision unavailable');return contentSchema.parse(result.data.document);});
