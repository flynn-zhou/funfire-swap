'use client'
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

//IMPORT INTERNAL
import Style from "./NavBar.module.css";
import images from "../../assets";
import { Model, TokenList } from "../index";

//CONTEXT
import { SwapTokenContext } from "../../Context/SwapContext";

import PuffLoader from "react-spinners/PuffLoader";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const override = {
  position: "absolute",
  top: 100,
  left: `calc(45% - 25px)`,
  top: `calc(50% - 25px)`,
  display: "block",
  margin: "0 auto",
  // borderColor: "red",
};

const NavBar = () => {
  const { 
    ether, 
    account, 
    networkConnect, 
    connectWallet, 
    tokenData, 
    loading, 
    setLoading,
    openError,
    setOpenError,
    error,
    sentTokenToGuest
   } =
    useContext(SwapTokenContext);

  const notify = (message) => toast(message);

  const menuItems = [
    {
      name: "Swap",
      link: "/",
    },
    {
      name: "Tokens",
      link: "/Tokens",
    },
    {
      name: "Pools",
      link: "/Pools",
    },
  ];
  //USESTATE
  const [openModel, setOpenModel] = useState(false);
  const [openTokenBox, setOpenTokenBox] = useState(false);
  let [color, setColor] = useState("#4C5773");
  let [isOpenRequestToken , setIsOpenRequestToken] = useState(false)


  useEffect(() => {
    if (openError) {
      notify(error)
      setTimeout(() => {
        setOpenError(false)
      }, 500)
    }
  }, [openError])

  // console.log('tokenData', tokenData);
  return (
    <div className={Style.NavBar}>
      <div className={Style.NavBar_box}>
        <div className={Style.NavBar_box_left}>
          {/* //LOGO IMAGE  */}
          <div>
            <Image src={images.uniswap} alt="logo" width={50} height={50}  className={Style.NavBar_box_left_img}/>
          </div>
          {/* MENU ITEMS */}

          <div className={Style.NavBar_box_left_menu}>
            {menuItems.map((el, i) => (
              <Link key={i + 1} href={{ pathname: `${el.link}` }}>
                <p className={Style.NavBar_box_left_menu_item}>{el.name}</p>
              </Link>
            ))}
            {
            <p 
              onClick={() => setIsOpenRequestToken(!isOpenRequestToken)}
              className={Style.NavBar_box_left_menu_requestTokens}
              >Faucet</p>
            }
          </div>
        </div>
        {/* //Middle SECTION */}
        <div className={Style.NavBar_box_middle}>
          <div className={Style.NavBar_box_middle_search}>
            <div className={Style.NavBar_box_middle_search_img}>
              <Image src={images.search} alt="search" width={20} height={20} />
            </div>
            {/* //INPUT SECTION */}
            <input type="text" placeholder="Search Tokens" />
          </div>
        </div>
        {/* //RIGHT SECTION */}
        <div className={Style.NavBar_box_right}>
          <div className={Style.NavBar_box_right_box}>
            <div className={Style.NavBar_box_right_box_img}>
              <Image src={images.ether} alt="NetWork" height={30} width={30} />
            </div>
            <p>{networkConnect}</p>
          </div>
          {account ? (
            <button onClick={() => setOpenTokenBox(true)}>
              {account.slice(0, 20)}..
            </button>
          ) : (
            <button onClick={() => setOpenModel(true)}>Connect</button>
          )}

          {openModel && (
            <Model setOpenModel={setOpenModel} connectWallet={connectWallet} />
          )}
        </div>
      </div>

      {/* //TOTENLIST COMPONENT */}
      {openTokenBox && (
        <TokenList tokenData={tokenData} setOpenTokenBox={setOpenTokenBox} />
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="dark"
      // hideProgressBar={false}
      // newestOnTop={false}
      // closeOnClick
      // rtl={false}
      // pauseOnFocusLoss
      // draggable
      // pauseOnHover
      // theme="light"
      // transition="Bounce"
      />

      {
        loading &&

        <div style={{ width: '100%', height: '100vh', position: 'fixed', zIndex: '22222222'}}>
          <PuffLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>

      }
        {
          isOpenRequestToken &&
          <div className={Style.request_token_modal}>
              <div>This will send 100 POP, SHO and RAY tokens to your sepolia account for testing purpose.</div>
              <div className={Style.request_token_modal_buttons}>
              < button
                  onClick={() => setIsOpenRequestToken(false)}
                  className={Style.request_token_modal_buttons_cancel}
                >
                  Cancel
                </button>
                <button
                  onClick={() => sentTokenToGuest(setIsOpenRequestToken)}
                  className={Style.request_token_modal_buttons_ok}
                >
                  Confirm
                </button>
              </div>
          </div>
        }
    </div>
  );
};

export default NavBar;
