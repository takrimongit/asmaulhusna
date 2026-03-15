#!/usr/bin/env node
/**
 * Fetches 99 Names of Allah data from AlAdhan API + Quran Foundation API
 * and writes a complete data/names.ts file.
 */

// Mapping: name number → known Quran verse_keys where the name appears
// These are well-known, verified references for each of the 99 names.
const nameVerseMap = {
  1:  ['1:1','59:22'],           // Ar-Rahman
  2:  ['1:1','2:163'],           // Ar-Rahim
  3:  ['59:23','20:114'],        // Al-Malik
  4:  ['59:23','62:1'],          // Al-Quddus
  5:  ['59:23'],                 // As-Salam
  6:  ['59:23'],                 // Al-Mu'min
  7:  ['59:23'],                 // Al-Muhaymin
  8:  ['59:23','3:6'],           // Al-Aziz
  9:  ['59:23'],                 // Al-Jabbar
  10: ['59:23'],                 // Al-Mutakabbir
  11: ['59:24','6:102'],         // Al-Khaliq
  12: ['59:24'],                 // Al-Bari'
  13: ['59:24'],                 // Al-Musawwir
  14: ['71:10','38:66'],         // Al-Ghaffar
  15: ['13:16','38:65'],         // Al-Qahhar
  16: ['3:8','38:35'],           // Al-Wahhab
  17: ['51:58'],                 // Ar-Razzaq
  18: ['34:26'],                 // Al-Fattah
  19: ['2:29','6:13'],           // Al-'Alim
  20: ['2:245'],                 // Al-Qabid
  21: ['2:245'],                 // Al-Basit
  22: ['56:3'],                  // Al-Khafid
  23: ['56:3','58:11'],          // Ar-Rafi'
  24: ['3:26'],                  // Al-Mu'izz
  25: ['3:26'],                  // Al-Mudhil
  26: ['2:127','2:256'],         // As-Sami'
  27: ['17:1','42:11'],          // Al-Basir
  28: ['6:114','40:48'],         // Al-Hakam
  29: ['6:115','21:47'],         // Al-'Adl
  30: ['6:103','67:14'],         // Al-Latif
  31: ['6:18','63:11'],          // Al-Khabir
  32: ['2:225','2:235'],         // Al-Halim
  33: ['2:255','56:96'],         // Al-'Azim
  34: ['2:173','4:152'],         // Al-Ghafur
  35: ['35:30','35:34'],         // Ash-Shakur
  36: ['2:255','4:34'],          // Al-'Aliyy
  37: ['13:9','22:62'],          // Al-Kabir
  38: ['11:57','34:21'],         // Al-Hafiz
  39: ['4:85'],                  // Al-Muqit
  40: ['4:6','33:39'],           // Al-Hasib
  41: ['55:27','55:78'],         // Al-Jalil
  42: ['27:40','82:6'],          // Al-Karim
  43: ['4:1','5:117'],           // Ar-Raqib
  44: ['11:61'],                 // Al-Mujib
  45: ['2:115','2:247'],         // Al-Wasi'
  46: ['2:129','31:27'],         // Al-Hakim
  47: ['11:90','85:14'],         // Al-Wadud
  48: ['11:73','85:15'],         // Al-Majid
  49: ['22:7'],                  // Al-Ba'ith
  50: ['4:79','4:166'],          // Ash-Shahid
  51: ['22:6','31:30'],          // Al-Haqq
  52: ['3:173','6:102'],         // Al-Wakil
  53: ['22:40','22:74'],         // Al-Qawiyy
  54: ['51:58'],                 // Al-Matin
  55: ['2:257','42:28'],         // Al-Waliyy
  56: ['14:1','14:8'],           // Al-Hamid
  57: ['72:28'],                 // Al-Muhsi
  58: ['10:4','85:13'],          // Al-Mubdi'
  59: ['10:4','85:13'],          // Al-Mu'id
  60: ['3:156','7:158'],         // Al-Muhyi
  61: ['3:156','7:158'],         // Al-Mumit
  62: ['2:255','3:2'],           // Al-Hayy
  63: ['2:255','3:2'],           // Al-Qayyum
  64: ['38:44'],                 // Al-Wajid
  65: ['11:73'],                 // Al-Majid
  66: ['2:163','18:110'],        // Al-Wahid
  67: ['112:1'],                 // Al-Ahad
  68: ['112:2'],                 // As-Samad
  69: ['6:65','36:83'],          // Al-Qadir
  70: ['18:45','54:42'],         // Al-Muqtadir
  71: ['50:28'],                 // Al-Muqaddim
  72: ['71:4'],                  // Al-Mu'akhkhir
  73: ['57:3'],                  // Al-Awwal
  74: ['57:3'],                  // Al-Akhir
  75: ['57:3'],                  // Az-Zahir
  76: ['57:3'],                  // Al-Batin
  77: ['13:11'],                 // Al-Wali
  78: ['13:9'],                  // Al-Muta'ali
  79: ['52:28'],                 // Al-Barr
  80: ['2:37','2:128'],          // At-Tawwab
  81: ['3:4','32:22'],           // Al-Muntaqim
  82: ['4:149','22:60'],         // Al-'Afuww
  83: ['2:207','59:10'],         // Ar-Ra'uf
  84: ['3:26'],                  // Malik al-Mulk
  85: ['55:27','55:78'],         // Dhul-Jalali wal-Ikram
  86: ['21:47','49:9'],          // Al-Muqsit
  87: ['3:9'],                   // Al-Jami'
  88: ['2:263','35:15'],         // Al-Ghaniyy
  89: ['93:8'],                  // Al-Mughni
  90: ['67:21'],                 // Al-Mani'
  91: ['6:17'],                  // Ad-Darr
  92: ['48:11'],                 // An-Nafi'
  93: ['24:35'],                 // An-Nur
  94: ['22:54'],                 // Al-Hadi
  95: ['2:117'],                 // Al-Badi'
  96: ['20:73','55:27'],         // Al-Baqi
  97: ['15:23','19:40'],         // Al-Warith
  98: ['11:87'],                 // Ar-Rashid
  99: ['8:46'],                  // As-Sabur
};

// Name type classification
const nameTypes = {
  // Dhati (Essence/Being attributes)
  3: 'Dhati', 4: 'Dhati', 62: 'Dhati', 63: 'Dhati', 66: 'Dhati', 67: 'Dhati',
  68: 'Dhati', 73: 'Dhati', 74: 'Dhati', 75: 'Dhati', 76: 'Dhati', 93: 'Dhati',
  96: 'Dhati',

  // Af'ali (Action attributes)
  11: "Af'ali", 12: "Af'ali", 13: "Af'ali", 14: "Af'ali", 15: "Af'ali",
  16: "Af'ali", 17: "Af'ali", 18: "Af'ali", 20: "Af'ali", 21: "Af'ali",
  22: "Af'ali", 23: "Af'ali", 24: "Af'ali", 25: "Af'ali", 34: "Af'ali",
  35: "Af'ali", 44: "Af'ali", 49: "Af'ali", 58: "Af'ali", 59: "Af'ali",
  60: "Af'ali", 61: "Af'ali", 71: "Af'ali", 72: "Af'ali", 80: "Af'ali",
  81: "Af'ali", 82: "Af'ali", 86: "Af'ali", 87: "Af'ali", 89: "Af'ali",
  94: "Af'ali", 95: "Af'ali",

  // Sifati (Qualitative attributes) — default for the rest
};

// Richer descriptions for all 99 names
const descriptions = {
  1:  'The One who is full of mercy and compassion for all of creation, encompassing every living thing with His grace.',
  2:  'The One whose mercy is specifically bestowed upon the believers, continuous and eternal in nature.',
  3:  'The absolute sovereign and ruler of the entire universe, whose dominion has no limits or boundaries.',
  4:  'The One who is absolutely pure, free from all defects, imperfections, and shortcomings.',
  5:  'The source and giver of peace, security, and tranquility. He is free from every imperfection.',
  6:  'The One who grants security and confirms the truth of His messengers through signs and miracles.',
  7:  'The Guardian and Protector who watches over all creation with complete awareness and control.',
  8:  'The Almighty, the One who is invincible and whose power cannot be overcome by anyone.',
  9:  'The Compeller who restores all of creation. His will cannot be resisted or opposed.',
  10: 'The Supreme in greatness, who is above all deficiency. Only He has the right to all greatness.',
  11: 'The Creator who brings everything into existence from absolute nothingness by His command.',
  12: 'The Originator who creates all beings with distinct, individual, and perfect qualities.',
  13: 'The Fashioner of forms who shapes every creation in the most beautiful and appropriate way.',
  14: 'The One who repeatedly forgives sins and covers the faults of His servants out of mercy.',
  15: 'The All-Subduer who dominates over all creation. Nothing can escape His power.',
  16: 'The Bestower who gives generously and endlessly without any expectation of return.',
  17: 'The Provider who creates all means of sustenance and provides for every creature.',
  18: 'The Opener who opens the doors of mercy, provision, and relief for His servants.',
  19: 'The All-Knowing whose knowledge encompasses everything — the seen and unseen, past, present, and future.',
  20: 'The Withholder who constricts provision and hearts according to His divine wisdom.',
  21: 'The Expander who extends sustenance and opens the hearts of whom He wills.',
  22: 'The Reducer who lowers and humbles the arrogant and disobedient as He wills.',
  23: 'The Exalter who elevates in rank and status those whom He wills among His creation.',
  24: 'The Bestower of Honour who grants dignity, power, and respect to whom He wills.',
  25: 'The Humiliator who abases and disgraces those who persist in arrogance and disbelief.',
  26: 'The All-Hearing who hears every sound in existence, whether spoken aloud or whispered in secret.',
  27: 'The All-Seeing who sees everything, from the smallest atom to the largest galaxy, nothing is hidden.',
  28: 'The Judge who settles all disputes with absolute justice. His judgment is final and perfect.',
  29: 'The Just One whose fairness and equity are absolute. He never wrongs anyone even by an atom.',
  30: 'The Subtle One who is kind to His servants in ways they cannot perceive, showing gentle care.',
  31: 'The All-Aware who knows the innermost secrets, intentions, and hidden aspects of all things.',
  32: 'The Forbearing who does not hasten punishment despite having full knowledge of the sins.',
  33: 'The Magnificent One whose greatness is beyond human comprehension and measure.',
  34: 'The Great Forgiver who pardons sins abundantly, no matter how great or numerous they are.',
  35: 'The Most Appreciative who generously rewards even the smallest good deeds with immense reward.',
  36: 'The Most High, exalted above all creation in His being, His attributes, and His power.',
  37: 'The Greatest, whose grandeur surpasses that of all creation. He is most great in every way.',
  38: 'The Preserver who protects and guards all things. Not even an atom is lost from His watch.',
  39: 'The Nourisher who provides sustenance and strength to all creation at every moment.',
  40: 'The Reckoner who keeps account of all deeds and will bring everyone to account on the Day of Judgment.',
  41: 'The Majestic One, full of glory, sublimity, and grandeur beyond what any heart can imagine.',
  42: 'The Generous One who gives abundantly and whose generosity extends to all creatures.',
  43: 'The Watchful One who observes all things at all times. Nothing escapes His watchful eye.',
  44: 'The Responsive One who answers the prayers and supplications of those who call upon Him.',
  45: 'The All-Encompassing whose capacity, knowledge, mercy, and power extend over all things.',
  46: 'The Perfectly Wise who places everything in its rightful place with perfect wisdom.',
  47: 'The Most Loving One whose love for His righteous servants is unconditional and eternal.',
  48: 'The Most Glorious, full of noble glory, whose majesty and honor are boundless.',
  49: 'The Resurrector who will raise all of creation from death on the Day of Judgment.',
  50: 'The Witness who is present everywhere and sees all things — open and hidden, known and unknown.',
  51: 'The Absolute Truth, the Real One whose existence is undeniable and whose words are always true.',
  52: 'The Trustee and Disposer of Affairs on whom all matters are placed with complete trust.',
  53: 'The Possessor of all strength, whose power is unlimited and inexhaustible.',
  54: 'The Firm One, possessing absolute firmness and steadfastness that cannot be shaken.',
  55: 'The Protecting Friend and Patron who loves and supports the believers.',
  56: 'The Praiseworthy, worthy of all praise and gratitude for His infinite blessings.',
  57: 'The Appraiser who keeps exact count of all things, nothing escapes His counting.',
  58: 'The Originator who creates all things for the first time, without any prior model.',
  59: 'The Restorer who brings back creation after death, reproducing and recreating it.',
  60: 'The Giver of Life who bestows life to the dead and breathes life into everything.',
  61: 'The Taker of Life who causes death. All souls return to Him at their appointed time.',
  62: 'The Ever-Living who has no beginning and no end, whose life is perfect and eternal.',
  63: 'The Self-Existing, Self-Sustaining who upholds and maintains all of creation.',
  64: 'The Finder who perceives and obtains whatever He wills, nothing is lost to Him.',
  65: 'The Glorious One whose nobility and honor are beyond description or comparison.',
  66: 'The Only One, unique in His essence, attributes, and actions. There is none like Him.',
  67: 'The One, the indivisible, the absolute unity. He has no partner or equal in any way.',
  68: 'The Supreme Provider, the Self-Sufficient upon whom all creation depends for their needs.',
  69: 'The All-Powerful who has complete power over all things. Nothing is difficult for Him.',
  70: 'The Creator of All Power who determines and measures all power and ability in creation.',
  71: 'The Expediter who brings forward what He wills, advancing things according to His plan.',
  72: 'The Delayer who puts back what He wills, postponing matters according to His wisdom.',
  73: 'The First, who existed before all creation. There is nothing before Him.',
  74: 'The Last, who will remain after all creation perishes. There is nothing after Him.',
  75: 'The Manifest, the Evident One. His existence is clear through the signs of His creation.',
  76: 'The Hidden One, whose essence is beyond the reach of human perception and imagination.',
  77: 'The Governor who manages all affairs of creation with perfect authority and sovereignty.',
  78: 'The Supreme One, exalted high above everything. Nothing is beyond His reach.',
  79: 'The Source of Goodness, the Doer of Good who is kind and gracious to His servants.',
  80: 'The Guide to Repentance who accepts the repentance of His servants and helps them return.',
  81: 'The Avenger who justly punishes those who persist in oppression and transgression.',
  82: 'The Pardoner who erases sins completely, as though they had never been committed.',
  83: 'The Most Kind, full of compassion. His gentleness toward creation exceeds all bounds.',
  84: 'The Owner of All Sovereignty, who grants dominion to whom He wills and takes it away.',
  85: 'The Lord of Majesty and Bounty, possessing all glory, beauty, and generosity.',
  86: 'The Equitable One who acts with perfect justice and fairness in all matters.',
  87: 'The Gatherer who will assemble all of creation on the Day of Judgment without exception.',
  88: 'The Self-Sufficient who is free from all needs. All creation is in need of Him.',
  89: 'The Enricher who makes wealthy and self-sufficient whom He wills from His bounty.',
  90: 'The Preventer who shields His servants from harm and prevents what He wills.',
  91: 'The Creator of the Harmful, who creates all that may cause harm by His wisdom.',
  92: 'The Bestower of Benefits, who creates all that is beneficial and good for creation.',
  93: 'The Light who illuminates the heavens and the earth. He guides to His light whom He wills.',
  94: 'The Guide who shows the straight path and leads creation to what is beneficial for them.',
  95: 'The Originator who created the heavens and earth in a unique way without any prior example.',
  96: 'The Everlasting One who remains forever. Everything perishes except His noble face.',
  97: 'The Inheritor who remains after all creation has perished. He is the ultimate heir of all.',
  98: 'The Righteous Guide who leads to the right path with wisdom and perfect guidance.',
  99: 'The Patient One who is not hasty in punishment, giving time to His servants to repent.',
};

async function fetchVerseText(verseKey) {
  try {
    // Fetch Arabic text
    const textRes = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?fields=text_uthmani`);
    if (!textRes.ok) return null;
    const textData = await textRes.json();

    // Fetch English translation (Abdel Haleem - resource 85)
    const transRes = await fetch(`https://api.quran.com/api/v4/quran/translations/85?verse_key=${verseKey}`);
    const transData = transRes.ok ? await transRes.json() : { translations: [] };

    const arabic = textData.verse?.text_uthmani || '';
    const translation = (transData.translations?.[0]?.text || '').replace(/<[^>]+>/g, '');
    const [surahNum] = verseKey.split(':');

    return { arabic, translation, surahNum: parseInt(surahNum), verseKey };
  } catch (e) {
    console.error(`  Error fetching ${verseKey}:`, e.message);
    return null;
  }
}

async function fetchSurahName(surahNum) {
  try {
    const res = await fetch(`https://api.quran.com/api/v4/chapters/${surahNum}`);
    if (!res.ok) return `Surah ${surahNum}`;
    const data = await res.json();
    return `Surah ${data.chapter?.name_simple || surahNum}`;
  } catch {
    return `Surah ${surahNum}`;
  }
}

async function main() {
  console.log('Fetching AlAdhan 99 Names...');
  const aladhanRes = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
  const aladhanData = await aladhanRes.json();
  const aladhanNames = aladhanData.data;

  // Cache surah names
  const surahNameCache = {};

  // Collect all unique surah numbers we need
  const allSurahNums = new Set();
  for (const verses of Object.values(nameVerseMap)) {
    for (const vk of verses) {
      allSurahNums.add(parseInt(vk.split(':')[0]));
    }
  }

  console.log(`Fetching ${allSurahNums.size} surah names...`);
  const surahPromises = [...allSurahNums].map(async num => {
    surahNameCache[num] = await fetchSurahName(num);
  });
  await Promise.all(surahPromises);

  // Fetch all verse texts
  const allVerseKeys = new Set();
  for (const verses of Object.values(nameVerseMap)) {
    for (const vk of verses) allVerseKeys.add(vk);
  }

  console.log(`Fetching ${allVerseKeys.size} verse texts from Quran Foundation...`);
  const verseCache = {};
  // Batch in groups of 10 to not overload
  const verseKeysArr = [...allVerseKeys];
  for (let i = 0; i < verseKeysArr.length; i += 10) {
    const batch = verseKeysArr.slice(i, i + 10);
    const results = await Promise.all(batch.map(vk => fetchVerseText(vk)));
    for (let j = 0; j < batch.length; j++) {
      if (results[j]) verseCache[batch[j]] = results[j];
    }
    console.log(`  Fetched ${Math.min(i + 10, verseKeysArr.length)}/${verseKeysArr.length}`);
    // Small delay between batches
    if (i + 10 < verseKeysArr.length) await new Promise(r => setTimeout(r, 300));
  }

  // Build the names array
  console.log('Building names data...');
  const names = [];
  for (const an of aladhanNames) {
    const id = an.number;
    const verseKeys = nameVerseMap[id] || [];

    // Build quranicRefs
    const quranicRefs = [];
    for (const vk of verseKeys) {
      const v = verseCache[vk];
      if (v) {
        const surahName = surahNameCache[v.surahNum] || `Surah ${v.surahNum}`;
        quranicRefs.push({
          surah: surahName,
          ayah: vk,
          arabic: v.arabic,
          translation: v.translation,
        });
      }
    }

    // Read existing data for this name from current names.ts
    const type = nameTypes[id] || 'Sifati';

    names.push({
      id,
      arabic: an.name,
      transliteration: an.transliteration.replace(/ /g, '-'),
      meaning: an.en.meaning,
      description: descriptions[id] || an.en.meaning,
      mentions: quranicRefs.length,
      type,
      quranicRefs,
    });
  }

  // Generate TypeScript
  let ts = `export interface QuranicRef {
  surah: string;
  ayah: string;
  arabic: string;
  translation: string;
}

export interface Name {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  description: string;
  mentions: number;
  type: string;
  quranicRefs: QuranicRef[];
}

export const names: Name[] = [\n`;

  for (const n of names) {
    ts += `  {\n`;
    ts += `    id: ${n.id},\n`;
    ts += `    arabic: '${n.arabic.replace(/'/g, "\\'")}',\n`;
    ts += `    transliteration: '${n.transliteration.replace(/'/g, "\\'")}',\n`;
    ts += `    meaning: '${n.meaning.replace(/'/g, "\\'")}',\n`;
    ts += `    description: '${n.description.replace(/'/g, "\\'")}',\n`;
    ts += `    mentions: ${n.mentions},\n`;
    ts += `    type: '${n.type.replace(/'/g, "\\'")}',\n`;
    ts += `    quranicRefs: [\n`;
    for (const ref of n.quranicRefs) {
      ts += `      { surah: '${ref.surah.replace(/'/g, "\\'")}', ayah: '${ref.ayah}', arabic: '${ref.arabic.replace(/'/g, "\\'")}', translation: '${ref.translation.replace(/'/g, "\\'")}' },\n`;
    }
    ts += `    ],\n`;
    ts += `  },\n`;
  }

  ts += `];\n`;

  // Write to data/names.ts
  const { writeFileSync } = await import('fs');
  const { join } = await import('path');
  const outPath = join(import.meta.dirname, '..', 'data', 'names.ts');
  writeFileSync(outPath, ts, 'utf-8');
  console.log(`\nWrote ${names.length} names to ${outPath}`);
  console.log(`Total Quranic references: ${names.reduce((s, n) => s + n.quranicRefs.length, 0)}`);
}

main().catch(console.error);
