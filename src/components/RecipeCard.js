import { Link } from "react-router-dom";

export default function RecipeCard({ recipe }) {
    const encoded = encodeURIComponent(recipe.uri);

    return (
        <article
            style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                background: "var(--surface)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
        >
            {recipe.image ? (
                <img
                    src={recipe.image}
                    alt={recipe.label}
                    style={{
                        width: "100%",
                        height: 160,
                        objectFit: "cover",
                        display: "block",
                    }}
                />
            ) : null}

            <div style={{ padding: 12 }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>{recipe.label}</h3>

                <p style={{ margin: "0 0 10px", color: "var(--muted)" }}>
                    {recipe.cuisineType?.[0] ? `Cuisine: ${recipe.cuisineType[0]}` : ""}
                </p>

                <Link to={`/recipes/${encoded}`} state={{ recipe }}>
                    Bekijk recept
                </Link>
            </div>
        </article>
    );
}