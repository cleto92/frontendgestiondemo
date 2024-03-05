/* eslint-disable max-len */
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';


const Index = () => {
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>
      <div className="h-screen">
        <nav className="bg-blue-500 p-4 flex justify-between">
          <h1 className="text-white text-2xl font-bold">Panel Macro Vapore</h1>
          <div>
            <Link className="text-white text-2xl font-bold" href="/Login">Login</Link>
          </div>
        </nav>
        <div className="bg-white h-full justify-center"></div>
      </div>
    </>
  );
};

export default Index;
