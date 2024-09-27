import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
} from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit';

import { createContext } from 'react';

const config = getDefaultConfig({
    appName: 'giv3',
    projectId: 'aead2177f58437ab7eb2081a27fba935',
    chains: [
      /* 
      mainnet,
      polygon,
      optimism,
      arbitrum,
      base,
      zora,
      */
      sepolia,
      ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    ssr: true,
  });

const ConfigContext = createContext(config);

export default ConfigContext;