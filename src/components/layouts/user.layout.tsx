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
      <div>
        <Outlet />
      </div>
      <UserFooter />
    </div>
  );
};

export default UserLayout;
