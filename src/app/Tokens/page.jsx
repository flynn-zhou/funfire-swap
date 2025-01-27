"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import axios from "axios";

//INTERNAL IMPORT
import Style from "../../styles/Tokens.module.css";
import images from "../../assets";
import { AllTokens } from "../../Components/index";
//CONTEXT
import { SwapTokenContext } from "../../Context/SwapContext";
const Tokens = () => {
  const { setLoading } = useContext(SwapTokenContext);
  const [topTokenList, setTopTokenList] = useState([]);
  const [copyAllTokenList, setCopyAllTokenList] = useState(topTokenList);
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(search);

  const onHandleSearch = (value) => {
    const filteredTokens = topTokenList.filter(({ symbol }) => {
      return symbol.toLowerCase().includes(value.toLowerCase());
    });

    console.log("filteredTokens", filteredTokens);

    if (filteredTokens.length === 0) {
      setTopTokenList(copyAllTokenList);
    } else {
      setTopTokenList(filteredTokens);
    }
  };

  const onClearSearch = () => {
    if (topTokenList.length && copyAllTokenList.length) {
      setTopTokenList(copyAllTokenList);
    }
  };

  useEffect(() => {
    const fetchTokens = async () => {
      const URL =
        // "https://gateway.thegraph.com/api/4e93311b7999e13e8c95ccb52c2d4d4c/subgraphs/id/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV";
        "https://gateway.thegraph.com/api/6d85ef3a50e316231a554e7779e88c75/subgraphs/id/HUZDsRpEVP2AvzDCyzDHtdc64dyDxx8FQjzsmqSg4H3B";
      const query = `
      {
        tokens(orderBy: volumeUSD, orderDirection: desc, first:20){
          id
          name
          symbol
           decimals
          volume
          volumeUSD
           totalSupply
           feesUSD
           txCount
           poolCount
           totalValueLockedUSD
           totalValueLocked
           derivedETH
        }
      }
      `;
      setLoading(true);
      const axiosData = await axios.post(URL, { query: query });
      console.log("axiosData: ", axiosData);
      setTopTokenList(axiosData.data.data.tokens);
      setCopyAllTokenList(axiosData.data.data.tokens);
      setLoading(false);
    };
    fetchTokens();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchItem), 1000);
    return () => clearTimeout(timer);
  }, [searchItem]);

  useEffect(() => {
    if (search) {
      onHandleSearch(search);
    } else {
      onClearSearch();
    }
  }, [search]);

  return (
    <div className={Style.Tokens}>
      <div className={Style.Tokens_box}>
        <h2>Top tokens on Uniswap</h2>
        <div className={Style.Tokens_box_header}>
          <div className={Style.Tokens_box_ethereum}>
            <p>
              <Image
                src={images.etherlogo}
                alt="ether"
                width={20}
                height={20}
              />
            </p>
            <p>Ethereum</p>
          </div>
          <div className={Style.Tokens_box_search}>
            <p>
              <Image src={images.search} alt="image" width={20} height={20} />
            </p>
            <input
              type="text"
              placeholder="Filter tokens"
              onChange={(e) => setSearchItem(e.target.value)}
              value={searchItem}
            />
          </div>
        </div>

        <AllTokens allTokenList={topTokenList} />
      </div>
    </div>
  );
};

export default Tokens;
