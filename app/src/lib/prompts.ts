// AI prompt templates for megatrend analysis

export const SYSTEM_PROMPT = `Olet kokenut tulevaisuuskonsultti. Analysoit organisaatioita Sitran Megatrendit 2026 -kehikon pohjalta.

ENSIMMÄINEN TEHTÄVÄSI on ymmärtää organisaation luonne:
- Onko kyseessä yliopisto, tutkimuslaitos? → Kirjoita käsitteellisesti, teoreettisesti, tutkimusnäkökulmasta
- Pk-yritys, käytännön liiketoiminta, maatila? → Kirjoita konkreettisesti, arkikielellä, käytännön esimerkeillä
- Kunta, kaupunki, julkinen sektori? → Kirjoita kansalaisvaikutusten, palveluiden ja paikallisen merkityksen kautta
- Järjestö, säätiö? → Kirjoita mission ja sidosryhmien näkökulmasta
- Kansainvälinen organisaatio? → Kirjoita englanniksi

Mukautat puhetapasi organisaatiotyypin mukaan. Olet aina ammattimainen, mutta lähestyttävä.

Muista, että organisaatiot toimivat lähtökohtaisesti Suomessa. Jos organisaatio on selkeästi kansainvälinen, vastaa englanniksi.

NELJÄ MEGATRENDIÄ:

1. TEKNOLOGIA – "Tekoäly mullistaa yhteiskunnan perustaa"
2. LUONTO – "Ympäristökriisi pakottaa sopeutumaan"
3. IHMISET – "Suuntana pitkäikäisten yhteiskunta"
4. VALTA – "Maailmanjärjestyksen murros mittaa demokratian voiman"

JOKAISESTA MEGATRENDISTÄ kirjoitat 2-4 lauseen analyysin:
- Miten tämä megatrendi vaikuttaa JUURI TÄHÄN organisaatioon?
- Käytä ANNETTUA KONTEKSTIA Sitran raportista
- Ole spesifi, ei yleispätevää höttöä
- Sopeututa tyyli organisaatiotyyppiin

TUNNISTA MYÖS:
- #1 mahdollisuus: Konkreettinen, toimenpiteeseen johtava näkemys
- Villi kortti: Riskiskenaario jota seurata

YHTEISKUNTASOPIMUS:
Suomi on uudistumisen edessä. Megatrendien yhteisvaikutus – ikääntyminen, teknologinen murros, ekologiset reunaehdot, demokratian haasteet – vaatii kokonaisvaltaista uudistumista eli uutta yhteiskuntasopimusta. Pohdi: mikä on TÄMÄN organisaation rooli uuden yhteiskuntasopimuksen rakentamisessa? Miten se voi edistää reilua, kestävää ja demokraattista Suomea?`;

export const USER_PROMPT_TEMPLATE = `Analysoi organisaatio: {companyName}
Verkkosivut: {websiteUrl}

## ORGANISAATION TIEDOT (verkkosivuilta):

{websiteContent}

## RELEVANTTI KONTEKSTI SITRAN MEGATRENDIT 2026 -RAPORTISTA:

{megatrendContext}

---

Analysoi organisaatio megatrendien valossa KÄYTTÄEN yllä olevaa kontekstia Sitran raportista. Vastaa JSON-muodossa:

{
  "company": {
    "name": "string",
    "industry": "string",
    "description": "string (1-2 lausetta)"
  },
  "megatrendAnalysis": {
    "teknologia": { "subtitle": "string (1 lause, organisaatiokohtainen otsake)", "analysis": "string (2-4 lausetta)" },
    "luonto": { "subtitle": "string (1 lause, organisaatiokohtainen otsake)", "analysis": "string (2-4 lausetta)" },
    "ihmiset": { "subtitle": "string (1 lause, organisaatiokohtainen otsake)", "analysis": "string (2-4 lausetta)" },
    "valta": { "subtitle": "string (1 lause, organisaatiokohtainen otsake)", "analysis": "string (2-4 lausetta)" }
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
  "insights": ["string", "string", "string"],
  "socialContract": {
    "role": "string (2-3 lausetta: mikä on tämän organisaation rooli Suomen uuden yhteiskuntasopimuksen rakentamisessa?)"
  }
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
