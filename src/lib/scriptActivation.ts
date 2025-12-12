/**
 * Active tous les scripts "en attente" pour une catégorie donnée :
 * <script type="text/plain" data-cookie-category="analytics"> ... </script>
 */
export function activateScriptsForCategory(category: string) {
    const selector = `script[type="text/plain"][data-cookie-category="${category}"]`;
    const scripts = document.querySelectorAll<HTMLScriptElement>(selector);

    console.log("[CookieWall] activating scripts for", category, "found:", scripts.length);

    scripts.forEach((oldScript) => {
        const newScript = document.createElement("script");

        // copier les attributs sauf type
        for (const attr of Array.from(oldScript.attributes)) {
            if (attr.name === "type") continue;
            newScript.setAttribute(attr.name, attr.value);
        }

        if (oldScript.textContent) {
            newScript.textContent = oldScript.textContent;
        }

        oldScript.replaceWith(newScript);
    });
}

