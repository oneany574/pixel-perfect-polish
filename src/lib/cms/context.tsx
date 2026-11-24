import { createContext, useContext } from 'react';
import { defaultContent, section, type SiteContent } from './content';
export const ContentContext = createContext<SiteContent>(defaultContent);
export const useContent = () => useContext(ContentContext);
export const useSection = (key: string) => section(useContent(), key);
