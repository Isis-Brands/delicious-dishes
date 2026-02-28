import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { getFavorites, removeFavorite } from "../services/favoritesStorage";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    function handleRemove(uri) {
        const updated = removeFavorite(uri);
        setFavorites(updated);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="panel">
                <h1 className="pageTitle" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span aria-hidden="true" style={{ fontSize: 28 }}>💜</span>
                    Favorites
                </h1>
                <p className="lead">Your saved recipes appear here.</p>
            </div>

            {favorites.length === 0 ? (
                <div className="panel" style={{ textAlign: "center", padding: 28 }}>
                    <div aria-hidden="true" style={{ fontSize: 54, marginBottom: 8 }}>♡</div>
                    <p className="muted" style={{ margin: 0 }}>
                        Start adding recipes to your favorites by clicking <strong>Add to favorites</strong> on a recipe detail page.
                    </p>
                </div>
            ) : (
                <div className="panel">
                    <section className="cardGrid">
                        {favorites.map((recipe) => (
                            <div className="cardWrap" key={recipe.uri}>
                                <RecipeCard recipe={recipe} />
                                <button
                                    className="btn"
                                    style={{ marginTop: 10 }}
                                    onClick={() => handleRemove(recipe.uri)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </section>
                </div>
            )}
        </div>
    );
}