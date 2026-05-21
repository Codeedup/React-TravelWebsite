import FilterPanel from "./FilterPanel";
import FooterTicker from "./FooterTicker";
import Header from "./Header";
import Hero from "./Hero";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

export default function MessyMyspaceApp() {
  return (
    <>
      <div className="page-noise" aria-hidden="true"></div>
      <Header />
      <main className="myspace-shell">
        <LeftSidebar />

        <section className="main-column" aria-label="Dreamroute recommender">
          <Hero />
          <FilterPanel />
        </section>

        <RightSidebar />
      </main>
      <FooterTicker />
    </>
  );
}
