import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* En-tête de la page */}
      <Navbar cartCount={0} wishlistCount={0} />

      {/* Contenu principal de la page */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-800">Bienvenue sur LaKavern</h1>
        <p className="text-gray-600 mt-2">
          Retrouvez nos fournitures et équipements scolaires à Dakar.
        </p>
      </main>

      {/* Pied de page placé sous le contenu principal */}
      <Footer />
    </div>
  );
}

export default App;