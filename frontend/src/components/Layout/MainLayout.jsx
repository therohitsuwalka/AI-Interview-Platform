import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">

      {/* Sidebar */}

      <Sidebar />

      {/* Main Area */}

      <div className="flex flex-col flex-1 min-h-screen">

        <Navbar />

        <main className="flex-1 p-8">

          {children}

        </main>

        <Footer />

      </div>

    </div>
  );
}

export default MainLayout;