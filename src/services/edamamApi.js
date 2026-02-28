const BASE_URL = "https://api.edamam.com/api/recipes/v2";

const APP_ID = process.env.REACT_APP_EDAMAM_APP_ID;
const APP_KEY = process.env.REACT_APP_EDAMAM_APP_KEY;

function ensureKeys() {
    if (!APP_ID || !APP_KEY) {
        throw new Error(
            "Missing Edamam API keys. Check .env and restart npm start."
        );
    }
}

function buildUrl(path, params) {
    const url = new URL(`${BASE_URL}${path}`);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, value);
        }
    });
    return url.toString();
}

async function fetchJson(url) {
    ensureKeys();
    const res = await fetch(url);

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(
            `Edamam request failed: ${res.status} ${res.statusText}${body ? " | " + body : ""}`
        );
    }

    return res.json();
}

function mapRecipes(data) {
    const recipes = data.hits?.map((hit) => hit.recipe) ?? [];
    const nextHref = data._links?.next?.href ?? null;
    return { recipes, nextHref };
}

/** Async #1 */
export async function searchRecipes({ query, health, mealType }) {
    const url = buildUrl("", {
        type: "public",
        q: query,
        app_id: APP_ID,
        app_key: APP_KEY,
        health,
        mealType,
    });

    const data = await fetchJson(url);
    return mapRecipes(data);
}

/** Async #2 */
export async function getFeaturedRecipes() {
    return searchRecipes({ query: "chicken" });
}

/** Async #3 */
export async function getNextPage(nextHref) {
    if (!nextHref) return { recipes: [], nextHref: null };
    const data = await fetchJson(nextHref);
    return mapRecipes(data);
}

/** Async #4 */
export async function searchByIngredients(ingredientsText) {
    const q = ingredientsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" ");

    if (!q) return { recipes: [], nextHref: null };
    return searchRecipes({ query: q });
}

/** Async #5 */
export async function getRandomRecipe() {
    const { recipes } = await getFeaturedRecipes();
    if (!recipes.length) return null;
    const idx = Math.floor(Math.random() * recipes.length);
    return recipes[idx];
}

/** Async #6 (optioneel/fallback) */
export async function getRecipeByUri(encodedUri) {
    const uri = decodeURIComponent(encodedUri);

    const url = buildUrl("/by-uri", {
        type: "public",
        uri,
        app_id: APP_ID,
        app_key: APP_KEY,
    });

    const data = await fetchJson(url);
    return data.hits?.[0]?.recipe ?? null;
}