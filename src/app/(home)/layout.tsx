import { Navbar } from "./Navbar";

interface Props {
  children: React.ReactNode;
}
const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
