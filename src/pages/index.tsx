import { type NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <Link href="/search">查詢已開放購買班次</Link>
      <Link href="/reserve">預約購買未開放購買班次</Link>
    </div>
  );
};

export default Home;
