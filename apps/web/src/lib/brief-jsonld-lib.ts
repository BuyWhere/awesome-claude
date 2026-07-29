// Pure builder for the Weekly Brief archive page's schema.org ItemList of
// Articles, split out of the route head() so mapping can be unit-tested
// without rendering the route (mirrors changelog-jsonld-lib.ts).

type BriefIssueLike = {
  title: string;
  date: string;
  summary: string;
};

/** schema.org ItemList JSON-LD of Articles for the Weekly Brief archive. */
export function briefItemListJsonLd(issues: BriefIssueLike[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "HeyClaude Weekly Brief archive",
    itemListElement: issues.map((issue, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Article",
        headline: issue.title,
        datePublished: issue.date,
        description: issue.summary,
      },
    })),
  };
}
