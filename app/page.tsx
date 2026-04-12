
import Footer from "@/components/footer";
import Header from "@/components/header";
import HomePage from "@/components/HomePage";
import ShopHours from "@/components/shop-hours";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Header />

      {/*Hero Image Section*/}
      <HomePage />


      {/*Main content*/}
      <div className="w-full h-full bg-gray-100 dark:bg-black flex flex-col items-center justify-center gap-4 p-4">
        <h2 className="text-4xl">
      Kaizen Cutz
      </h2>
      <div className="max-w-1/2 text-center">
      <p className="text-md">Precision cuts and esthetic treatments tailored for clients who care about detail, consistency, and a refined experience. Every service is focused on clean results, modern style, and a comfortable, elevated environment in Sacramento.</p>
      </div>
      <div className="flex gap-2">
      <Button>
        Book Now
      </Button>
      <Button variant={"outline"} className="shadow-md">
        View Services
      </Button>
      </div>
      </div>
      <ShopHours/>
      <Footer/>
    </div>

  );
}
