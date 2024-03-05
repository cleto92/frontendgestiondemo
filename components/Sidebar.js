/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useContext, useEffect, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {FaUsers, FaBox, FaTools, FaBuilding, FaArrowLeft, FaTimes, FaArrowRight} from 'react-icons/fa';
import {IoPersonAddSharp} from 'react-icons/io5';
import {GoPackageDependents} from 'react-icons/go';
import {SidebarContext} from './SideBarContext';


const SideBar = () => {
  const {isOpen, setIsOpen} = useContext(SidebarContext);
  // eslint-disable-next-line no-unused-vars
  const [isFullyOpen, setIsFullyOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) {
      setIsFullyOpen(false);
    }
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsFullyOpen(false);
    } else {
      setTimeout(() => setIsFullyOpen(true), 150000);
    }
  };

  return (
    <aside className={`bg-gray-800 sm:min-h-screen p-5 transition-width duration-500 ease-in-out ${isOpen ? 'sm:w-1/3 xl:w-1/5' : 'w-20'}`}>
      <div className="flex justify-between">
        <p className={`text-white text-2xl font-black ${isOpen ? 'block' : 'hidden'}`}>
          ADMINISTRACIÓN
        </p>
        <button onClick={handleClick} className="bg-blue-800 p-2 rounded-full text-white">
          {isOpen ? <FaArrowLeft /> : <FaArrowRight /> }
        </button>
      </div>
      <nav className={`mt-10 list-none ${isOpen ? 'block' : 'hidden'}`}>
        <h2 className="text-blue-400 text-2xl font-black">
          MAYORISTAS
        </h2>
        <li className={router.pathname === '/ClientesMayoristas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/ClientesMayoristas">
            <span className="text-white font-bold block text-base">
              <FaUsers className="inline-block mr-2" /> Clientes Mayoristas
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Pedidos' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Pedidos">
            <span className="text-white font-bold block text-base">
              <FaBox className="inline-block mr-2" /> Pedidos
            </span>
          </Link>
        </li>
        <div className="mb-2">
          <h2 className="text-blue-400 text-2xl font-black">
            MINORISTAS
          </h2>
        </div>
        <li className={router.pathname === '/ClientesMinoristas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/ClientesMinoristas">
            <span className="text-white font-bold block text-base">
              <FaUsers className="inline-block mr-2" /> Clientes Minoristas
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Instalaciones' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Instalaciones">
            <span className="text-white font-bold block text-base">
              <FaBuilding className="inline-block mr-2" /> Instalaciones
            </span>
          </Link>
        </li>
        <div className="mb-3">
          <h2 className="text-blue-400 text-2xl font-black">GESTIÓN DE STOCK</h2>
        </div>
        <li className={router.pathname === '/Productos' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Productos">
            <span className="text-white font-bold block text-base">
              <GoPackageDependents className="inline-block mr-2" /> Stock
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Fallas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Fallas">
            <span className="text-white font-bold block text-base">
              <FaTimes className="inline-block mr-2 text-lg" /> Fallas
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Entradas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Entradas">
            <span className="text-white font-bold block text-base">
              <FaArrowRight className="inline-block mr-2 text-lg" /> Entradas
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Salidas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Salidas">
            <span className="text-white font-bold block text-base">
              <FaArrowLeft className="inline-block mr-2 text-lg" /> Salidas
            </span>
          </Link>
        </li>
        <h2 className="text-blue-400 text-2xl font-black">TECNICOS</h2>
        <li className={router.pathname === '/Placas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Placas">
            <span className="text-white font-bold block text-base">
              <FaTools className="inline-block mr-2" /> Reparaciones
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/FallasComponentes' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/FallasComponentes">
            <span className="text-white font-bold block text-base">
              <FaTimes className="inline-block mr-2 text-lg" /> Fallas Componentes
            </span>
          </Link>
        </li>
        <h2 className="text-blue-400 text-2xl font-black">ADMINISTRACIÓN</h2>
        <li className={router.pathname === '/NuevaCuenta' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/NuevaCuenta">
            <span className="text-white font-bold block text-base">
              <IoPersonAddSharp className="inline-block mr-2" /> Alta Usuario
            </span>
          </Link>
        </li>
      </nav>
      <nav className={`mt-10 list-none ${isOpen ? 'hidden' : 'block'}`}>
        <li className={router.pathname === '/ClientesMayoristas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/ClientesMayoristas">
            <span className="text-white font-bold block">
              <FaUsers className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Pedidos' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Pedidos">
            <span className="text-white font-bold block">
              <FaBox className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/ClientesMinoristas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/ClientesMinoristas">
            <span className="text-white font-bold block">
              <FaUsers className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Instalaciones' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Instalaciones">
            <span className="text-white font-bold block">
              <FaBuilding className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Productos' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Productos">
            <span className="text-white font-bold block">
              <GoPackageDependents className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/NuevaCuenta' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/NuevaCuenta">
            <span className="text-white font-bold block">
              <IoPersonAddSharp className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Placas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Placas">
            <span className="text-white font-bold block">
              <FaTools className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Fallas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Fallas">
            <span className="text-white font-bold block">
              <FaTools className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/FallasComponentes' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/FallasComponentes">
            <span className="text-white font-bold block">
              <FaTools className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Entradas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Entradas">
            <span className="text-white font-bold block">
              <FaTools className="inline-block mr-2" />
            </span>
          </Link>
        </li>
        <li className={router.pathname === '/Salidas' ? 'bg-blue-800 p-3' : 'p-3'}>
          <Link href="/Salidas">
            <span className="text-white font-bold block">
              <FaTools className="inline-block mr-2" />
            </span>
          </Link>
        </li>
      </nav>
    </aside>
  );
};

export default SideBar;
