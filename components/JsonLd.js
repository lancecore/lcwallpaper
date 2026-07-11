// Renders a schema.org JSON-LD block in the page body (the officially recommended
// spot for the Pages Router — Google reads structured data anywhere in the document).
// `<` is escaped to < so a public_id containing "</script>" can't break out of
// the tag — the JSON parses back identically. (defense-in-depth: data is owner-controlled)
export default function JsonLd({ data }) {
	const json = JSON.stringify(data).replace(/</g, "\\u003c");
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	);
}
