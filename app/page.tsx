import Portfolio from "./portfolio";

export default function Home() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Miller Santos",
    alternateName: "millersantosbr",
    jobTitle: "Desenvolvedor de produtos digitais com IA",
    address: {
      "@type": "PostalAddress",
      addressRegion: "Alagoas",
      addressCountry: "BR",
    },
    email: "mailto:elvismillerfreitas@gmail.com",
    sameAs: [
      "https://github.com/millersantosbr",
      "https://www.linkedin.com/in/miller-santos",
    ],
    knowsAbout: [
      "Inteligência artificial",
      "Desenvolvimento web",
      "Suporte de TI",
      "Cloud computing",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Portfolio />
    </>
  );
}
