import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
    return (
        <div>
            <header>
                <Navbar />
            </header>

            <main className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                    <Route
                        path="/favorites"
                        element={
                            <PrivateRoute>
                                <FavoritesPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </main>

            <footer className="container" style={{ paddingTop: 0, paddingBottom: 24 }}>
                <p className="muted" style={{ margin: 0 }}>
                    Delicious Dishes — recipe inspiration powered by Edamam.
                </p>
            </footer>
        </div>
    );
}