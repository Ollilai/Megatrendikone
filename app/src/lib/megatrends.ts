// Megatrend types and data utilities

export interface MegatrendScore {
  score: number;
  reasoning: string;
}

export interface MegatrendScores {
  teknologia: MegatrendScore;
  luonto: MegatrendScore;
  ihmiset: MegatrendScore;
  valta: MegatrendScore;
}

export interface TopOpportunity {
  megatrend: 'teknologia' | 'luonto' | 'ihmiset' | 'valta';
  title: string;
  description: string;
}

export interface WildCard {
  title: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
}

export interface CompanyInfo {
  name: string;
  industry: string;
  description: string;
  employeeCount?: string;
  location?: string;
  logoUrl?: string;
}

export interface AnalysisResult {
  company: CompanyInfo;
  megatrendScores: MegatrendScores;
  topOpportunity: TopOpportunity;
  wildCard: WildCard;
  insights: string[];
  generatedAt: string;
  futureImageUrl?: string; // AI-generated future vision image
}

export interface AnalysisRequest {
  companyName: string;
  websiteUrl: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

// Megatrend metadata
export const MEGATRENDS = {
  teknologia: {
    emoji: '🤖',
    label: 'TEKNOLOGIA',
    color: '#3B82F6', // blue
    description: 'Tekoäly mullistaa yhteiskunnan perustaa',
  },
  luonto: {
    emoji: '🌍',
    label: 'LUONTO',
    color: '#10B981', // green
    description: 'Ympäristökriisi pakottaa sopeutumaan ja uudistumaan',
  },
  ihmiset: {
    emoji: '👥',
    label: 'IHMISET',
    color: '#F59E0B', // amber
    description: 'Suuntana pitkäikäisten yhteiskunta',
  },
  valta: {
    emoji: '⚖️',
    label: 'VALTA',
    color: '#8B5CF6', // purple
    description: 'Maailmanjärjestyksen murros mittaa demokratian voiman',
  },
} as const;

export type MegatrendKey = keyof typeof MEGATRENDS;

// Get company logo from Google Favicon API
export function getCompanyLogoUrl(websiteUrl: string): string {
  try {
    const url = new URL(websiteUrl);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return '';
  }
}
