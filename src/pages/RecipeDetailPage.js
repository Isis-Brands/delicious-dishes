import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { addFavorite, isFavorite, removeFavorite } from "../services/favoritesStorage";

export default function RecipeDetailPage() {
    const location = useLocation();
    const recipe = location.state?.recipe ?? null;

    const [favorite, setFavorite] = useState(recipe ? isFavorite(recipe.uri) : false);

    function handleToggleFavorite() {
        if (!recipe) return;

        if (favorite) {
            removeFavorite(recipe.uri);
            setFavorite(false);
        } else {
            addFavorite(recipe);
            setFavorite(true);
        }
    }

    if (!recipe) {
        return (
            <div className="panel">
                <h1 className="pageTitle">Recipe detail</h1>
                <p className="error">
                    No recipe data found. Please open a recipe from the Recipes list.
                </p>
                <Link to="/recipes">Back to Recipes</Link>
            </div>
        );
    }

    return (
        <div className="panel">
            <h1 className="pageTitle">{recipe.label}</h1>

            <div className="row" style={{ marginBottom: 12 }}>
                <button
                    className={`btn ${favorite ? "" : "btnPrimary"}`}
                    onClick={handleToggleFavorite}
                >
                    {favorite ? "Remove from favorites" : "Add to favorites"}
                </button>

                <Link to="/recipes" className="muted">
                    Back to Recipes
                </Link>
            </div>

            {recipe.image ? (
                <img
                    src={recipe.image}
                    alt={recipe.label}
                    style={{
                        width: "100%",
                        maxWidth: 720,
                        height: 360,
                        objectFit: "cover",
                        borderRadius: "var(--radius)",
                        border: "1px solid var(--border)",
                        display: "block",
                    }}
                />
            ) : null}

            <h2 style={{ marginTop: 18 }}>Ingredients</h2>
            <ul>
                {recipe.ingredientLines?.map((line) => (
                    <li key={line}>{line}</li>
                ))}
            </ul>

            {recipe.url ? (
                <p>
                    <a href={recipe.url} target="_blank" rel="noreferrer">
                        Original recipe website
                    </a>
                </p>
            ) : null}
        </div>
    );
}
