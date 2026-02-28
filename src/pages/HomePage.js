import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const navigate = useNavigate();

    function goToRecipes(query, health = "", mealType = "") {
        const params = new URLSearchParams();
        params.set("q", query);
        if (health) params.set("health", health);
        if (mealType) params.set("mealType", mealType);

        navigate(`/recipes?${params.toString()}`);
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="panel" style={{ width: "100%", maxWidth: 820 }}>
                <h1 className="pageTitle">Delicious Dishes</h1>
                <p className="lead">Pick what fits your mood and get recipes instantly.</p>

                <div className="row" style={{ marginTop: 12 }}>
                    <button className="btn btnComfort" onClick={() => goToRecipes("comfort food", "", "Dinner")}>
                        Comfort
                    </button>

                    <button className="btn btnQuick" onClick={() => goToRecipes("quick")}>
                        Quick
                    </button>

                    <button className="btn btnHealthy" onClick={() => goToRecipes("salad", "vegetarian")}>
                        Healthy (veg)
                    </button>
                </div>

                <p style={{ marginTop: 16 }}>
                    Or go to <strong>Recipes</strong> to search yourself.
                </p>
            </div>
        </div>
    );
}