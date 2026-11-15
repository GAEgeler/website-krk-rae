import yaml from "js-yaml";

export default function (eleventyConfig) {
  // Inhalte liegen als YAML in src/_data/seite.yml
  eleventyConfig.addDataExtension("yml", (text) => yaml.load(text));

  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/bilder");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.ignores.add("src/admin/**");
  eleventyConfig.addPassthroughCopy({ "src/htaccess.txt": ".htaccess" });
  // Redaktions-Login: fest installierte Version vom eigenen Server, kein fremdes CDN
  eleventyConfig.addPassthroughCopy({ "node_modules/@sveltia/cms/dist/sveltia-cms.js": "admin/sveltia-cms.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@sveltia/cms/dist/chunks": "admin/chunks" }, { filter: (p) => !p.endsWith(".map") });
  // Schriften werden selbst gehostet (keine Verbindung zu Google)
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource-variable/figtree/files/figtree-latin-wght-normal.woff2": "fonts/figtree.woff2",
    "node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2": "fonts/newsreader.woff2",
  });

  // Strukturierte Daten (schema.org) für Suchmaschinen und KI-Assistenten
  eleventyConfig.addFilter("jsonld", (seite) => {
    const e = seite.einstellungen || {};
    const url = (e.domain || "").replace(/\/$/, "") + "/";
    const sauber = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== "" && v != null && !(Array.isArray(v) && !v.length)));
    const angebote = ((seite.angebot || {}).liste || []).filter((a) => a.sichtbar !== false);
    const graph = [
      sauber({
        "@type": "ProfessionalService",
        "@id": url + "#praxis",
        name: e.praxisname,
        url,
        description: e.beschreibung,
        email: e.email,
        telephone: e.telefon,
        areaServed: e.ort || "Schweiz",
        address: e.ort ? { "@type": "PostalAddress", addressLocality: e.ort, addressCountry: "CH" } : "",
        founder: e.person ? { "@id": url + "#person" } : "",
        hasOfferCatalog: angebote.length
          ? { "@type": "OfferCatalog", name: "Angebot", itemListElement: angebote.map((a) => ({ "@type": "Offer", itemOffered: sauber({ "@type": "Service", name: a.titel, description: a.text }) })) }
          : "",
      }),
    ];
    if (e.person) graph.push(sauber({ "@type": "Person", "@id": url + "#person", name: e.person, jobTitle: e.berufsbezeichnung, worksFor: { "@id": url + "#praxis" } }));
    const fragen = ((seite.fragen || {}).liste || []).filter((f) => f.frage && f.antwort);
    if (fragen.length) graph.push({ "@type": "FAQPage", mainEntity: fragen.map((f) => ({ "@type": "Question", name: f.frage, acceptedAnswer: { "@type": "Answer", text: f.antwort } })) });
    return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
  });

  return { dir: { input: "src", output: "_site" }, htmlTemplateEngine: "njk" };
}
