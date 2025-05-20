import { Divider } from "antd";
import CompanyCard from "../../components/client/card/company.card";
import JobCard from "../../components/client/card/job.card";
import SearchClient from "../../components/client/user.search";

const HomePage = () => {
  return (
    <div style={{ marginTop: 20 }}>
      <SearchClient />
      <Divider />
      <CompanyCard />
      <JobCard />
    </div>
  );
};

export default HomePage;
