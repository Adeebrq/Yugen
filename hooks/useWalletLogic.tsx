"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// importing different versions of this as i want to do it on the client side
import { generateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { derivePath } from "ed25519-hd-key";

import { Keypair} from "@solana/web3.js";

type walletInfo = {
  publicKey: string;
  secretKey: string;
};

type mnemonicType = {
  mnemonic?: walletInfo[];
  setMnemonic: (value: walletInfo[]) => void;
};

export const walletLogicContext = createContext<mnemonicType | null>(null);

export const WalletLogicProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mnemonic, setMnemonic] = useState<walletInfo[]>([]);

  useEffect(() => {
    const generateWallet = async () => {
      try {
        const seedphrase = generateMnemonic(wordlist);
        const seeds = mnemonicToSeedSync(seedphrase).toString();
        for (let i = 0; i < 6; i++) {

          const keys = derivePath(`m/44'/501'/${i}'/0'`, seeds);
          const keypair = Keypair.fromSeed(keys.key);

          setMnemonic((prev) => [
            ...prev,
            {
              publicKey: keypair.publicKey.toBase58(),
              secretKey: Buffer.from(keypair.secretKey).toString("hex"),
            },
          ]);
        }
      } catch (error) {
        console.log("An error occured");
      }
    };
    generateWallet();
  }, []);

  return (
    <walletLogicContext.Provider value={{ mnemonic, setMnemonic }}>
      {children}
    </walletLogicContext.Provider>
  );
};

export const walletContext = () => {
  const context = useContext(walletLogicContext);
  if (!context)
    throw new Error("Provider must be used inside the provider hook");
  return context;
};

// use client pages dont allow async functions directly hence we use it inside a useeffect() line 18
