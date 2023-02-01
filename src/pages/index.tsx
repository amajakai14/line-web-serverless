import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { TNavbar } from "../components/Navbar";
import Navbar from "../components/Navbar";
import { api } from "../utils/api";

const linkList: TNavbar = [
  { uri: "#", text: "Products" },
  { uri: "/login", text: "Login" },
  { uri: "/staff", text: "Staff" },
  { uri: "/admin", text: "Admin" },
  { uri: "#", text: "Contact Us" },
];

const Home: NextPage = () => {
  const [file, setFile] = useState<any>(null);
  let availableMenu: TNavbar;
  const session = useSession();
  const mutation = api.menu.uploadImage.useMutation();
  if (session.status === "loading") return <div>Loading...</div>;
  if (session.data?.user) {
    availableMenu = linkList.filter((link) => link.text !== "Login");
  } else {
    availableMenu = linkList.filter(
      (link) => link.text !== "Staff" && link.text !== "Admin"
    );
  }

  const onFileChange = (e: React.FormEvent<HTMLFormElement>) => {
    setFile(e.currentTarget.files?.[0]);
  };

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      console.log("file not found ...");
      return;
    }
    const url = await createPresignUrl();
    const result = await fetch(url, {
      method: "PUT",
      body: file,
    });
    const x = await result.json();
    console.log(x);
  };

  const createPresignUrl = async () => {
    return await mutation.mutateAsync();
  };

  return (
    <>
      <Head>
        <title>Restaurant Manager</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <Navbar linkList={availableMenu} />
        <form onSubmit={uploadImage}>
          <div>Upload Image</div>
          <input onChange={(e) => onFileChange(e)} type="file" />
          <button type="submit">upload file</button>
        </form>
        <div className="px-4 pt-2 md:px-10 md:pt-10">
          <FirstImpression />
        </div>
      </main>
    </>
  );
};

export default Home;

const FirstImpression: React.FC = () => {
  return (
    <>
      <div className="sm:flex">
        <div className="w-3/4 sm:w-1/2">
          <h1 className="text-start text-lg font-extrabold sm:text-2xl md:text-3xl lg:text-6xl">
            Build customer relations a great experience with{" "}
            <span className="whitespace-nowrap text-red-600">real-time</span>{" "}
            interactive mobile order
          </h1>
          <GetStarted className={"hidden pt-8 text-start sm:block"} />
        </div>
        <div className="w-full items-center sm:w-1/2">
          <div className="relative h-80 w-full px-4 text-center sm:h-80 sm:px-0  md:text-start">
            <Image
              alt="sample_mobile-order"
              src={
                "https://storage.googleapis.com/studio-design-asset-files/projects/9YWyeXebWM/s-886x1748_v-fms_webp_ba47268b-45d4-4007-8443-315243957c4a_middle.webp"
              }
              fill={true}
              className="object-contain pt-4 pb-4 sm:py-0"
            />
          </div>
        </div>
      </div>
      <GetStarted className={"pt-2 text-center sm:hidden"} />
    </>
  );
};

const GetStarted = ({ className }: { className: string | undefined }) => {
  return (
    <div className={className}>
      <Link
        href={"#"}
        className="rounded-md bg-violet-700 p-4 hover:bg-violet-800"
      >
        <span className="text-white">Get Started</span>
      </Link>
    </div>
  );
};
