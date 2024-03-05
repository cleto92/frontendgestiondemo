/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {useContext} from 'react';
import Head from 'next/head';
import SideBar from './Sidebar';
import {useRouter} from 'next/router';
import Header from './Header';
import {SidebarContext} from './SideBarContext';

const Layout = ({children}) => {
  const router = useRouter();
  const {isOpen} = useContext(SidebarContext);

  return (
    <>
      <Head>

          <title>CRM - ADMINISTRACION DE CLIENTES</title>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css"
          integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg=="
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>
      {router.pathname === '/Login' ? (
        <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
          <div>{children}</div>
        </div>
      ) : (
        <div className="bg-gray 200 min-h-screen">
          <div className="flex min-h-screen">
            <SideBar />
            <main
              className={
                isOpen ?
                  'sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5' :
                  'w-full sm:min-h-screen p-5'
              }
            >
              <Header />
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
