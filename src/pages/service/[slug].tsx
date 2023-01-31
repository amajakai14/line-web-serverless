import { useRouter } from "next/router";
import { api } from "../../utils/api";

const Service = () => {
  const router = useRouter();
  const { slug } = router.query;
  if (typeof slug !== "string") return <div>404 Not Found</div>;
  const fetchData = api.channel.getChannel.useQuery(slug);
  if (fetchData.status === "loading") return <div>Loading...</div>;
  if (fetchData.status === "error") return <div>404 Not Found</div>;
  if (fetchData.data.status !== 200) return <div>404 Not Found</div>;
  return (
    <div>
      Your channel info: {fetchData.data.result?.id}. course name:{" "}
      {fetchData.data.result?.course_name}. channel status:{" "}
      {fetchData.data.result?.status}
    </div>
  );
};

export default Service;
