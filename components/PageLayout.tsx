import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingSocial from "./FloatingSocial";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">{children}</main>
      <Footer />
      <FloatingSocial />
    </>
  );
};

export default PageLayout;
