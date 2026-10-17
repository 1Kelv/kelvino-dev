import React from 'react';
import type { IconType } from 'react-icons';
import {
  SiReact, SiTypescript, SiJavascript, SiPython, SiNextdotjs, SiPostgresql,
  SiSupabase, SiFirebase, SiTensorflow, SiAppwrite, SiVite, SiNodedotjs,
  SiStreamlit,
} from 'react-icons/si';
import { useTheme } from '../ThemeContext';
import './TechIcon.css';

/*
  Brand marks for the tech chips. These are inline SVG from react-icons, which
  was already a dependency, so nothing is fetched at page load and the icons
  cannot fail to arrive the way a remote icon service can.

  Colours are the official brand ones. A few need a per-theme value: a brand
  whose colour is black vanishes on a dark page, and a pale brand vanishes on
  a light one, so those follow the page instead.
*/

type Colour = string | { light: string; dark: string };

const TECH: Record<string, { Icon: IconType; colour: Colour }> = {
  react:      { Icon: SiReact,      colour: { light: '#0B9FC4', dark: '#61DAFB' } },
  typescript: { Icon: SiTypescript, colour: { light: '#3178C6', dark: '#6CA6E8' } },
  javascript: { Icon: SiJavascript, colour: { light: '#B8A000', dark: '#F7DF1E' } },
  python:     { Icon: SiPython,     colour: { light: '#3776AB', dark: '#6FA8DC' } },
  nextjs:     { Icon: SiNextdotjs,  colour: 'currentColor' },
  postgresql: { Icon: SiPostgresql, colour: { light: '#31648C', dark: '#7AA7D9' } },
  supabase:   { Icon: SiSupabase,   colour: { light: '#249D62', dark: '#3FCF8E' } },
  firebase:   { Icon: SiFirebase,   colour: { light: '#D97706', dark: '#FFCA28' } },
  firestore:  { Icon: SiFirebase,   colour: { light: '#D97706', dark: '#FFCA28' } },
  tensorflow: { Icon: SiTensorflow, colour: '#FF6F00' },
  appwrite:   { Icon: SiAppwrite,   colour: '#FD366E' },
  vite:       { Icon: SiVite,       colour: '#8E7BFF' },
  nodejs:     { Icon: SiNodedotjs,  colour: { light: '#417E34', dark: '#7DC866' } },
  streamlit:  { Icon: SiStreamlit,  colour: '#FF4B4B' },
};

/** "Node.js" -> "nodejs", "Next.js" -> "nextjs", so the data stays readable. */
const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const TechIcon: React.FC<{ name: string }> = ({ name }) => {
  const { theme } = useTheme();
  const entry = TECH[key(name)];
  // A tech with no brand mark simply renders as text, which is why the label
  // is always present rather than being replaced by the icon.
  if (!entry) return null;

  const { Icon, colour } = entry;
  const resolved = typeof colour === 'string' ? colour : colour[theme];

  return <Icon className="tech-icon" style={{ color: resolved }} aria-hidden="true" focusable="false" />;
};

export default TechIcon;
