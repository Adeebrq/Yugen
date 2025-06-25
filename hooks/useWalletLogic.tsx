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
  seedPhrase: string,
  setSeedPhrase: (value: string)=> void
};

export const walletLogicContext = createContext<mnemonicType | null>(null);

export const WalletLogicProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mnemonic, setMnemonic] = useState<walletInfo[]>([]);
  const [seedPhrase, setSeedPhrase] = useState<string>("")

  useEffect(() => {
    const generateWallet = async () => {
      try {
        const seedPhrase = generateMnemonic(wordlist);
        setSeedPhrase(seedPhrase)
        const seeds = Buffer.from(mnemonicToSeedSync(seedPhrase)); 
        for (let i = 0; i < 5; i++) {

          const { key } = derivePath(`m/44'/501'/${i}'/0'`, seeds as unknown as string); // 👈 type-cast fix
          const keypair = Keypair.fromSeed(key);

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
    <walletLogicContext.Provider value={{ mnemonic, setMnemonic, setSeedPhrase , seedPhrase }}>
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
