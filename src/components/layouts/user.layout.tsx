import { Outlet } from "react-router";
import UserHeader from "../client/user.header";
import UserFooter from "../client/user.footer";

const UserLayout = () => {
  // const location = useLocation();
  // const rootRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (rootRef && rootRef.current) {
  //     rootRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }

  // }, [location]);

  return (
    <div>
      <UserHeader />
      <div className="container mx-auto">
        <Outlet />
      </div>
      <UserFooter />
    </div>
  );
};

export default UserLayout;
