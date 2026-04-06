import Navbar from "./Navbar";
import Footer from "./Footer";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">{children}</main>
      <Footer />
    </>
  );
};

export default PageLayout;
