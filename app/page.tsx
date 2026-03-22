
import Footer from "@/components/footer";
import Header from "@/components/header";
import HomePage from "@/components/HomePage";

export default function Home() {
  return (
    <div>
      <Header />

      {/*Hero Image Section*/}
      <HomePage />


      {/*Main content*/}
      <div className="w-full h-full bg-gray-100 dark:bg-black flex flex-col items-center justify-center gap-4 p-4">
        <h2>
        Barber Shop Website
      </h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil numquam suscipit illo, minima earum velit consequatur repellendus quos minus dolores odio at placeat assumenda fuga. Architecto maiores error ab libero.
            </p>
      </div>
      <Footer/>
    </div>

  );
}
