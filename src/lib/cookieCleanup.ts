import type { CookieWallConfig } from "./types";

function deleteCookie(name: string) {
    const hostname = window.location.hostname;
    const domains = [hostname, "." + hostname];
    const paths = ["/"];

    domains.forEach((domain) => {
        paths.forEach((path) => {
            document.cookie =
                `${name}=; Max-Age=0; path=${path}; domain=${domain}; SameSite=Lax`;
        });
    });

    // sans domaine explicite (fallback)
    document.cookie = `${name}=; Max-Age=0; path=/;`;
}

/**
 * Supprime les cookies correspondant aux préfixes configurés
 * pour une catégorie donnée.
 */
export function clearCookiesForCategory(
    category: string,
    conf: CookieWallConfig
) {
    const prefixes = conf.cookieCleanup?.[category];
    if (!prefixes || prefixes.length === 0) return;

    const cookies = document.cookie.split(";");

    cookies.forEach((raw) => {
        const [namePart] = raw.split("=");
        const name = namePart.trim();
        if (!name) return;

        if (prefixes.some((prefix) => name.startsWith(prefix))) {
            deleteCookie(name);
            // console.log("[CookieWall] deleted cookie", name, "for category", category);
        }
    });
}
