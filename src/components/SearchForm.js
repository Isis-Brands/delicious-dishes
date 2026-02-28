import { useState } from "react";

export default function SearchForm({ onSearch, isLoading }) {
    const [query, setQuery] = useState("");
    const [health, setHealth] = useState("");
    const [mealType, setMealType] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        onSearch({
            query,
            health: health || "",
            mealType: mealType || "",
        });
    }

    return (
        <form onSubmit={handleSubmit} className="row">
            <input
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search recipes... (e.g. pasta)"
                required
            />

            <select className="select" value={health} onChange={(e) => setHealth(e.target.value)}>
                <option value="">No diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="gluten-free">Gluten-free</option>
            </select>

            <select className="select" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="">All meal types</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
            </select>

            <button className="btn btnPrimary" type="submit" disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
            </button>
        </form>
    );
}