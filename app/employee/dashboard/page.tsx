import EmployeePortfolioManager from "@/components/EmployeePortfolioManager";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SignOut } from "@/components/signout-btn";
 
export default function EmployeeDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <Header />
 
      {/* title - same black banner as the other pages */}
      <section className="bg-black px-6 py-14 text-center text-white md:py-16">
        <h1 className="text-4xl font-extrabold uppercase tracking-widest md:text-6xl">Dashboard</h1>
      </section>
 
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="mb-8 flex justify-end">
          <SignOut />
        </div>
        <EmployeePortfolioManager />
      </main>
 
      <Footer />
    </div>
  );
}
