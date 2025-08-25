// Supports rich text conversion from QuillJS HTML output
function escapeString(str: string): string {
    return str.replace(/[\\"\b\f\n\r\t\v\u0000-\u001F]/g, (char) => {
        switch (char) {
            case "\\": return "\\\\";
            case "\"": return "\\\"";
            case "'": return "\\'";
            case "\b": return "\\b";
            case "\f": return "\\f";
            case "\n": return "\\n";
            case "\r": return "\\r";
            case "\t": return "\\t";
            case "\v": return "\\v";
            default:
                const code = char.charCodeAt(0);
                return `\\u${code.toString(16).padStart(4, "0")}`;
        }
    });
}
export function objectToString(obj: any, indent: number = 0): string {
    const pad = "  ".repeat(indent);

    if (obj === null) return "null";
    if (Array.isArray(obj)) {
        if (obj.length === 0) return "[]";
        return `[\n${obj
            .map((v) => pad + "  " + objectToString(v, indent + 1))
            .join(",\n")}\n${pad}]`;
    }
    if (typeof obj === "object") {
        const entries = Object.entries(obj).map(([k, v]) => {
            // Special rule for "options": always inline
            if (k === "options" && typeof v === "object" && v !== null) {
                return `${k}: { ${Object.entries(v)
                    .map(([ok, ov]) => `${ok}: ${objectToString(ov)}`)
                    .join(", ")} }`;
            }
            return `${k}: ${objectToString(v, indent + 1)}`;
        });
        if (entries.length === 0) return "{}";
        return `{\n${entries.map((e) => pad + "  " + e).join(",\n")}\n${pad}}`;
    }
    if (typeof obj === "string") return `"${escapeString(obj)}"`;
    return String(obj);
}
