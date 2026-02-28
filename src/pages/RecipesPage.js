import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import RecipeCard from "../components/RecipeCard";
import {
    getFeaturedRecipes,
    getNextPage,
    getRandomRecipe,
    searchByIngredients,
    searchRecipes,
} from "../services/edamamApi";

export default function RecipesPage() {
    const [searchParams] = useSearchParams();
    const lastAutoKeyRef = useRef("");

    const [recipes, setRecipes] = useState([]);
    const [nextHref, setNextHref] = useState(null);
    const [ingredientsText, setIngredientsText] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Cooldown to prevent spamming the API (helps with 429)
    const [cooldown, setCooldown] = useState(0);
    const cooldownRef = useRef(null);

    function startCooldown(seconds) {
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        setCooldown(seconds);
        cooldownRef.current = setInterval(() => {
            setCooldown((c) => {
                if (c <= 1) {
                    clearInterval(cooldownRef.current);
                    cooldownRef.current = null;
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
    }

    useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

    async function run(promiseFn, { append = false } = {}) {
        setErrorMsg("");
        setIsLoading(true);

        try {
            const result = await promiseFn();

            // small cooldown after each request
            startCooldown(2);

            if (result && Array.isArray(result.recipes)) {
                setRecipes((prev) => (append ? [...prev, ...result.recipes] : result.recipes));
                setNextHref(result.nextHref || null);
            } else if (result && result.uri) {
                setRecipes([result]);
                setNextHref(null);
            } else {
                setRecipes([]);
                setNextHref(null);
            }
        } catch (err) {
            console.error(err);

            const msg = err?.message || "Request failed.";

            if (msg.includes("429")) {
                setErrorMsg("API rate limit reached. Please wait 10 seconds and try again.");
                startCooldown(10);
            } else {
                setErrorMsg(msg);
            }

            setRecipes([]);
            setNextHref(null);
        } finally {
            setIsLoading(false);
        }
    }

    const blocked = isLoading || cooldown > 0;

    async function handleSearch(filters) {
        if (blocked) return;
        await run(() =>
            searchRecipes({
                query: filters.query,
                health: filters.health || undefined,
                mealType: filters.mealType || undefined,
            })
        );
    }

    async function handleFeatured() {
        if (blocked) return;
        await run(() => getFeaturedRecipes());
    }

    async function handleRandom() {
        if (blocked) return;
        await run(() => getRandomRecipe());
    }

    async function handleIngredientsSearch(e) {
        e.preventDefault();
        if (blocked) return;
        await run(() => searchByIngredients(ingredientsText));
    }

    async function handleLoadMore() {
        if (blocked) return;
        await run(() => getNextPage(nextHref), { append: true });
    }

    // Auto-search from Home via query params (deduped)
    useEffect(() => {
        const q = searchParams.get("q");
        const health = searchParams.get("health") || "";
        const mealType = searchParams.get("mealType") || "";
        if (!q) return;

        const autoKey = `${q}|${health}|${mealType}`;
        if (lastAutoKeyRef.current === autoKey) return;
        lastAutoKeyRef.current = autoKey;

        if (blocked) return;

        run(() =>
            searchRecipes({
                query: q,
                health: health || undefined,
                mealType: mealType || undefined,
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <div className="panel">
            <h1 className="pageTitle">Recipes</h1>
            <p className="lead">Search recipes via Edamam and save your favorites.</p>

            <div className="row" style={{ marginBottom: 12 }}>
                <button className="btn" onClick={handleFeatured} disabled={blocked}>
                    Featured
                </button>
                <button className="btn" onClick={handleRandom} disabled={blocked}>
                    Random
                </button>

                {cooldown > 0 ? <span className="muted">Wait {cooldown}s…</span> : null}
            </div>

            <SearchForm onSearch={handleSearch} isLoading={blocked} />

            <form onSubmit={handleIngredientsSearch} className="row" style={{ marginTop: 12 }}>
                <input
                    className="input"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    placeholder="Ingredients (comma separated) e.g. chicken, rice, broccoli"
                />
                <button className="btn" type="submit" disabled={blocked || !ingredientsText.trim()}>
                    Search by ingredients
                </button>
            </form>

            {errorMsg ? <p className="error">{errorMsg}</p> : null}
            {blocked ? <p className="muted">Loading...</p> : null}

            <section className="cardGrid">
                {recipes.map((recipe) => (
                    <div className="cardWrap" key={recipe.uri}>
                        <RecipeCard recipe={recipe} />
                    </div>
                ))}
            </section>

            {nextHref ? (
                <div style={{ marginTop: 16 }}>
                    <button className="btn" onClick={handleLoadMore} disabled={blocked}>
                        Load more
                    </button>
                </div>
            ) : null}
        </div>
    );
}