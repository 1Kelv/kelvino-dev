import React from 'react';
import type { IconType } from 'react-icons';
import {
  SiReact, SiTypescript, SiJavascript, SiPython, SiNextdotjs, SiPostgresql,
  SiSupabase, SiFirebase, SiTensorflow, SiAppwrite, SiVite, SiNodedotjs,
  SiStreamlit, SiGit, SiGithub, SiClaude, SiMetabase,
} from 'react-icons/si';
import {
  LuDatabase, LuChartColumn, LuChartLine, LuShieldCheck, LuTestTube,
  LuCreditCard, LuUsers, LuScale, LuLandmark, LuWorkflow,
  LuSearch, LuGavel, LuFileText, LuSnowflake,
} from 'react-icons/lu';
import { useTheme } from '../ThemeContext';
import './TechIcon.css';

/*
  Marks for the tech chips, skill chips and experience tags.

  Inline SVG from react-icons, which was already a dependency, so nothing is
  fetched at page load and a mark cannot fail to arrive the way a remote icon
  service can. Only the icons referenced here are bundled.

  Two kinds, deliberately styled apart:
   - A product or language gets its real brand colour.
   - A capability ("SQL", "Fraud Operations") has no brand, so it gets a quiet
     monochrome glyph that inherits the chip's own colour. That way a mixed row
     reads as two kinds of thing rather than as some icons having gone missing.
*/

type Colour = string | { light: string; dark: string };

interface Entry {
  Icon: IconType;
  /** Omitted means monochrome: follow the chip's text colour. */
  colour?: Colour;
}

const ICONS: Record<string, Entry> = {
  // --- products and languages, in their brand colours ---
  react:      { Icon: SiReact,      colour: { light: '#0B9FC4', dark: '#61DAFB' } },
  typescript: { Icon: SiTypescript, colour: { light: '#3178C6', dark: '#6CA6E8' } },
  javascript: { Icon: SiJavascript, colour: { light: '#B8A000', dark: '#F7DF1E' } },
  python:     { Icon: SiPython,     colour: { light: '#3776AB', dark: '#6FA8DC' } },
  nextjs:     { Icon: SiNextdotjs },
  postgresql: { Icon: SiPostgresql, colour: { light: '#31648C', dark: '#7AA7D9' } },
  supabase:   { Icon: SiSupabase,   colour: { light: '#249D62', dark: '#3FCF8E' } },
  firebase:   { Icon: SiFirebase,   colour: { light: '#D97706', dark: '#FFCA28' } },
  firestore:  { Icon: SiFirebase,   colour: { light: '#D97706', dark: '#FFCA28' } },
  tensorflow: { Icon: SiTensorflow, colour: '#FF6F00' },
  appwrite:   { Icon: SiAppwrite,   colour: '#FD366E' },
  vite:       { Icon: SiVite,       colour: '#8E7BFF' },
  nodejs:     { Icon: SiNodedotjs,  colour: { light: '#417E34', dark: '#7DC866' } },
  streamlit:  { Icon: SiStreamlit,  colour: '#FF4B4B' },
  git:        { Icon: SiGit,        colour: '#F05033' },
  github:     { Icon: SiGithub },
  claudeai:   { Icon: SiClaude,     colour: '#D97757' },
  claude:     { Icon: SiClaude,     colour: '#D97757' },
  metabase:   { Icon: SiMetabase,   colour: { light: '#3A6FB0', dark: '#78A9DF' } },

  // --- capabilities, monochrome ---
  sql:              { Icon: LuDatabase },
  hex:              { Icon: LuChartColumn },
  hexdashboards:    { Icon: LuChartColumn },
  dataanalytics:    { Icon: LuChartLine },
  fraudoperations:  { Icon: LuShieldCheck },
  playwright:       { Icon: LuTestTube },
  payments:         { Icon: LuCreditCard },
  teamleadership:   { Icon: LuUsers },
  customerrisk:     { Icon: LuScale },
  riskoperations:   { Icon: LuScale },
  financialservices:{ Icon: LuLandmark },
  processdesign:    { Icon: LuWorkflow },
  regulatione:      { Icon: LuScale },
  fraudstrategy:    { Icon: LuSearch },
  detectioncontrols:{ Icon: LuShieldCheck },
  disputeschargebacks: { Icon: LuGavel },
  paymentsrisk:     { Icon: LuCreditCard },
  regulatoryreporting: { Icon: LuFileText },
  snowflake:        { Icon: LuSnowflake, colour: { light: '#2A8FD4', dark: '#6BC5F5' } },
};

/** "Node.js" -> "nodejs", "Hex Dashboards" -> "hexdashboards". */
const key = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

const TechIcon: React.FC<{ name: string }> = ({ name }) => {
  const { theme } = useTheme();
  const entry = ICONS[key(name)];
  // Anything unmapped renders as plain text, which is why the label is always
  // present rather than being replaced by the mark.
  if (!entry) return null;

  const { Icon, colour } = entry;
  const resolved = colour === undefined
    ? undefined                                        // inherit, stays monochrome
    : typeof colour === 'string' ? colour : colour[theme];

  return (
    <Icon
      className={`tech-icon ${resolved ? '' : 'tech-icon-muted'}`}
      style={resolved ? { color: resolved } : undefined}
      aria-hidden="true"
      focusable="false"
    />
  );
};

export default TechIcon;
