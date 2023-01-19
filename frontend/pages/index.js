import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';

const inter = Inter({ subsets: ["latin"] });

const Logo = () => (<div>the logo</div>)
export default function Home() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <Head>
        <title>Increment decrement app</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Logo/>
      <ConnectButton />
    </>
  );
}
