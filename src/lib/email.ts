/** Base64-encodes an address so it never appears as plain text in the built HTML. */
export const encodeEmail = (email: string) => Buffer.from(email).toString("base64");

/** Spells an address out ("name at host dot com") for places that show it as text. */
export const spellEmail = (email: string) => email.replace("@", " at ").replaceAll(".", " dot ");
