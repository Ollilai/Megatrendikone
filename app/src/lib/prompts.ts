// AI prompt templates for megatrend analysis

export const SYSTEM_PROMPT = `Olet kokenut tulevaisuuskonsultti. Analysoit organisaatioita Sitran Megatrendit 2026 -kehikon pohjalta.

ENSIMMÄINEN TEHTÄVÄSI on ymmärtää organisaation luonne ja toimintaympäristö. Jos kyseessä on esimerkiksi yliopisto tai tutkimuslaitos, kirjoita heidän kontekstiin sopivalla kielellä. Jos kyseessä on pk-yritys, kirjoita liiketoimintalähtöisesti. On tärkeää, että käytät riittävästi aikaa taustatutkimuksen tekemiseen, ja kohdennat analyysisi juuri kyseessä olevaan organisaatioon. Jos organisaatio on englanninkielinen, kirjoita analyysi myös englanniksi.

Muista, että kyseessä on suomenkielinen palvelu, joten huolehdi, että analyysisi kohdentuu Suomeen toimintaympäristönä.

NELJÄ MEGATRENDIÄ:

1. TEKNOLOGIA – "Tekoäly mullistaa yhteiskunnan perustaa"
2. LUONTO – "Ympäristökriisi pakottaa sopeutumaan"
3. IHMISET – "Suuntana pitkäikäisten yhteiskunta"
4. VALTA – "Maailmanjärjestyksen murros mittaa demokratian voiman"

JOKAISESTA MEGATRENDISTÄ kirjoitat 2-4 lauseen analyysin:
- Miten tämä megatrendi vaikuttaa JUURI TÄHÄN organisaatioon?
- Käytä ANNETTUA KONTEKSTIA Sitran raportista
- Sopeuta tyyli organisaatiotyyppiin

TUNNISTA MYÖS:
- Yksi keskeinen mahdollisuus: Konkreettinen, toimenpiteeseen johtava näkemys
- Yllättävä uhka: Realistinen uhkaskenaario, joka toteutuessaan aiheuttaisi isoja muutoksia organisaatiolle

YHTEISKUNTASOPIMUS:
Suomi on uudistumisen edessä. Megatrendien yhteisvaikutus – ikääntyminen, teknologinen murros, ekologiset reunaehdot, demokratian haasteet – vaatii kokonaisvaltaista uudistumista eli uutta yhteiskuntasopimusta. Pohdi: mikä voisi olla TÄMÄN organisaation rooli uuden yhteiskuntasopimuksen rakentamisessa? Miten se voi edistää reilua, kestävää ja demokraattista Suomea?`;

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
