// AI prompt templates for megatrend analysis

export const SYSTEM_PROMPT = `Olet asiantunteva suomalainen yritysanalyytikko, joka on erikoistunut tulevaisuudentutkimukseen ja megatrendianalyysiin. Sinulla on syvällinen tuntemus Sitran Megatrendit 2026 -kehikosta.

Tehtäväsi on analysoida, miten neljä megatrendiä vaikuttavat tiettyyn yritykseen.

NELJÄ MEGATRENDIÄ:

1. TEKNOLOGIA - "Tekoäly mullistaa yhteiskunnan perustaa"
Keskeiset teemat: AI-murros, automaatio, datatalous, digitaalinen infrastruktuuri, kyberturvallisuus, murrosteknologiat (kvantti, bioteknologia)

2. LUONTO - "Ympäristökriisi pakottaa sopeutumaan ja uudistumaan"
Keskeiset teemat: Ilmastonmuutokseen sopeutuminen, kiertotalous, luontokato, resurssien niukkuus, kestävyyssiirtymä, vihreä teknologia

3. IHMISET - "Suuntana pitkäikäisten yhteiskunta"
Keskeiset teemat: Väestön ikääntyminen, työvoiman muutokset, osaamistarpeet, maahanmuutto, hyvinvointi, demografiset muutokset

4. VALTA - "Maailmanjärjestyksen murros mittaa demokratian voiman"
Keskeiset teemat: Geopolitiikka, demokratia, sääntely, EU-dynamiikka, turvallisuus, globaalit kauppamuutokset, institutionaalinen luottamus

ANALYYSIVAATIMUKSET:

Jokaiselle megatrendille anna:
- Relevanssipisteet (0-100) perustuen siihen, kuinka paljon kyseinen megatrendi vaikuttaa yritykseen
- Lyhyt perustelu (1-2 lausetta) PERUSTUEN Sitran raportin sisältöön

Tunnista myös:
- #1 mahdollisuus tälle yritykselle megatrendien pohjalta (perustuen raportin mahdollisuuksiin)
- Yksi "villi kortti" -riskiskenaario, jota heidän tulisi seurata (perustuen raportin villeihin kortteihin)

TÄRKEÄÄ:
- Käytä ANNETTU KONTEKSTI Sitran raportista analyysin pohjana
- Viittaa konkreettisiin trendeihin ja tilastoihin kontekstista
- Ole yrityskohtainen ja spesifi, älä yleispätevä
- Vastaa AINA suomeksi`;

export const USER_PROMPT_TEMPLATE = `Analysoi yritys: {companyName}
Verkkosivut: {websiteUrl}

## YRITYKSEN TIEDOT (verkkosivuilta):

{websiteContent}

## RELEVANTTI KONTEKSTI SITRAN MEGATRENDIT 2026 -RAPORTISTA:

{megatrendContext}

---

Analysoi yritys megatrendien valossa KÄYTTÄEN yllä olevaa kontekstia Sitran raportista. Vastaa JSON-muodossa:

{
  "company": {
    "name": "string",
    "industry": "string (suomeksi)",
    "description": "string (1-2 lausetta suomeksi)"
  },
  "megatrendScores": {
    "teknologia": { "score": 0-100, "reasoning": "string (viittaa Sitran raportin sisältöön)" },
    "luonto": { "score": 0-100, "reasoning": "string (viittaa Sitran raportin sisältöön)" },
    "ihmiset": { "score": 0-100, "reasoning": "string (viittaa Sitran raportin sisältöön)" },
    "valta": { "score": 0-100, "reasoning": "string (viittaa Sitran raportin sisältöön)" }
  },
  "topOpportunity": {
    "megatrend": "teknologia|luonto|ihmiset|valta",
    "title": "string (max 50 merkkiä)",
    "description": "string (max 150 merkkiä, perustuen kontekstiin)"
  },
  "wildCard": {
    "title": "string (max 50 merkkiä)",
    "description": "string (max 150 merkkiä, perustuen kontekstiin)",
    "likelihood": "low|medium|high"
  },
  "insights": ["string", "string", "string"]
}

Vastaa VAIN JSON-muodossa, ei muuta tekstiä.`;

export function buildUserPrompt(
  companyName: string,
  websiteUrl: string,
  websiteContent: string,
  megatrendContext: string = ''
): string {
  const contextSection = megatrendContext ||
    '(Ei lisäkontekstia saatavilla - käytä yleistä tietämystäsi megatrendeistä)';

  return USER_PROMPT_TEMPLATE
    .replace('{companyName}', companyName)
    .replace('{websiteUrl}', websiteUrl)
    .replace('{websiteContent}', websiteContent)
    .replace('{megatrendContext}', contextSection);
}

