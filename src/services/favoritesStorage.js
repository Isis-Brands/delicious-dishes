const KEY = "favorites";

export function getFavorites() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function isFavorite(uri) {
    return getFavorites().some((r) => r.uri === uri);
}

export function addFavorite(recipe) {
    const current = getFavorites();
    if (current.some((r) => r.uri === recipe.uri)) return current;
    const updated = [recipe, ...current];
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
}

export function removeFavorite(uri) {
    const current = getFavorites();
    const updated = current.filter((r) => r.uri !== uri);
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
}