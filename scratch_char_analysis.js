function cleanBengaliText(text) {
  if (!text) return text;

  let cleaned = text;

  // 1. Specific string corrections for common corrupted words
  const corrections = [
    { bad: /বিো/g, good: "বা" },
    { bad: /নভির্জর/g, good: "নির্ভর" },
    { bad: /লো¹নর্নিং/g, good: "লার্নিং" },
    { bad: /অËর্জ{নর/g, good: "অর্জনের" },
    { bad: /Ë/g, good: "" }
  ];

  corrections.forEach(c => {
    cleaned = cleaned.replace(c.bad, c.good);
  });

  // 2. Character mapping replacements
  cleaned = cleaned.replace(/Ȟ/g, "ত"); // Ȟ -> ত
  cleaned = cleaned.replace(/ি{/g, "{");  // ি{ -> {
  cleaned = cleaned.replace(/িো/g, "া");  // িো -> া

  // 3. Move left-vowels ({ for ে, ² for ি) after the consonant or consonant cluster they precede
  // A consonant cluster is a sequence of Bengali consonants (U+0985 to U+09b9, U+09ce, etc.) optionally joined by halant (U+09cd)
  // Let's define the consonant regex: [ক-হ] + (্ + [ক-হ])*
  // Bengali consonants range: \u0985-\u09b9\u09dc-\u09df\u09fa-\u09fc
  const consonantPattern = "(?:[\\u0995-\\u09b9\\u09dc-\\u09df\\u09fa-\\u09fc\\u09a4](?:\\u09cd[\\u0995-\\u09b9\\u09dc-\\u09df\\u09fa-\\u09fc\\u09a4])*)";

  // Reorder '{' (which represents 'ে')
  // Pattern: { + consonant cluster
  const eKarRegex = new RegExp(`{(${consonantPattern})`, "g");
  cleaned = cleaned.replace(eKarRegex, "$1ে");

  // Reorder '²' (which represents 'ি')
  // Pattern: ² + consonant cluster
  const iKarRegex = new RegExp(`²(${consonantPattern})`, "g");
  cleaned = cleaned.replace(iKarRegex, "$1ি");

  // 4. Clean up duplicate vowels or leftover corrupt characters
  cleaned = cleaned.replace(/েে/g, "ে");
  cleaned = cleaned.replace(/িি/g, "ি");
  cleaned = cleaned.replace(/ো/g, "া"); // in this specific corruption context, ো maps to া

  return cleaned;
}

const input = "ই{লেকট্র²নক প্র যু²ক্তি ও ইন্টার{ন{টর ওপর ²নভির্জর ক{র দূর²শিক্ষণ বিো ঘ{র বি{স ²শিক্ষো অËর্জ{নর পদ্ধ²Ȟ{ক ই-লো¹নর্নিং বি{লে।";
console.log("Original: ", input);
console.log("Cleaned:  ", cleanBengaliText(input));
