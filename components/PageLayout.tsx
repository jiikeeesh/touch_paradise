import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingSocial from "./FloatingSocial";

interface PageLayoutProps {
  children: React.ReactNode;
  showPadding?: boolean;
}

const PageLayout = ({ children, showPadding = true }: PageLayoutProps) => {
  return (
    <>
      <Navbar />
      <main className={`${showPadding ? "pt-20" : ""} relative min-h-screen`}>{children}</main>
      <Footer />
      <FloatingSocial />
    </>
  );
};

export default PageLayout;
