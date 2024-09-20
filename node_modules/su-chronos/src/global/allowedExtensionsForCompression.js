
const allowedExtensionsForCompression = (path) => {
    if (path.endsWith(".html") || path.endsWith(".css") ||
        path.endsWith(".js") || path.endsWith(".mjs") ||
        path.endsWith(".cjs") || path.endsWith(".json") ||
        path.endsWith(".svg") || path.endsWith(".xml") ||
        path.endsWith(".xhtml") || path.endsWith(".yml") ||
        path.endsWith(".yaml") || path.endsWith(".md") ||
        path.endsWith(".env") || path.endsWith(".txt") ||
        path.endsWith(".toml") || path.endsWith(".md")
    ) return true
    else return false
}

export default allowedExtensionsForCompression;
