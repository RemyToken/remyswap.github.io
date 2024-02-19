import { UnifiedWalletButton, UnifiedWalletProvider } from '@jup-ag/wallet-adapter';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import AppHeader from 'src/components/AppHeader/AppHeader';
import Footer from 'src/components/Footer/Footer';

import { SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import CodeBlocks from 'src/components/CodeBlocks/CodeBlocks';
import FormConfigurator from 'src/components/FormConfigurator';
import { IFormConfigurator, INITIAL_FORM_CONFIG, JUPITER_DEFAULT_RPC } from 'src/constants';
import IntegratedTerminal from 'src/content/IntegratedTerminal';
import { IInit } from 'src/types';
import V2SexyChameleonText from 'src/components/SexyChameleonText/V2SexyChameleonText';
import V2FeatureButton from 'src/components/V2FeatureButton';
import {TradingViewData} from 'src/components/TradingView';

const isDevNodeENV = process.env.NODE_ENV === 'development';
const isDeveloping = isDevNodeENV && typeof window !== 'undefined';
// In NextJS preview env settings
const isPreview = Boolean(process.env.NEXT_PUBLIC_IS_NEXT_PREVIEW);
if ((isDeveloping || isPreview) && typeof window !== 'undefined') {
  // Initialize an empty value, simulate webpack IIFE when imported
  (window as any).Jupiter = {};

  // Perform local fetch on development, and next preview
  Promise.all([import('../library'), import('../index')]).then((res) => {
    const [libraryProps, rendererProps] = res;

    (window as any).Jupiter = libraryProps;
    (window as any).JupiterRenderer = rendererProps;
  });
}

export default function App({ Component, pageProps }: AppProps) {
  const [tab, setTab] = useState<IInit['displayMode']>('integrated');

  // Cleanup on tab change
  useEffect(() => {
    if (window.Jupiter._instance) {
      window.Jupiter._instance = null;
    }
  }, [tab]);

  const rpcUrl = useMemo(() => JUPITER_DEFAULT_RPC, []);

  const { watch, reset, setValue, formState } = useForm<IFormConfigurator>({
    defaultValues: INITIAL_FORM_CONFIG,
  });

  const watchAllFields = watch();

  // Solflare wallet adapter comes with Metamask Snaps supports
  const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter(), new SolflareWalletAdapter()], []);

  const ShouldWrapWalletProvider = useMemo(() => {
    return watchAllFields.simulateWalletPassthrough
      ? ({ children }: { children: ReactNode }) => (
          <UnifiedWalletProvider
            wallets={wallets}
            config={{
              env: 'mainnet-beta',
              autoConnect: true,
              metadata: {
                name: 'Jupiter Terminal',
                description: '',
                url: 'https://terminal.jup.ag',
                iconUrls: [''],
              },
              theme: 'jupiter',
            }}
          >
            {children}
          </UnifiedWalletProvider>
        )
      : React.Fragment;
  }, [watchAllFields.simulateWalletPassthrough]);

  return (
    <>
      <DefaultSeo
        title={'Remy Swap'}
        openGraph={{
          type: 'website',
          locale: 'en',
          title: 'Jupiter Terminal',
          description: 'Jupiter Terminal: An open-sourced, lite version of Jupiter that provides end-to-end swap flow.',
          url: 'https://terminal.jup.ag/',
          site_name: 'Jupiter Terminal',
          images: [
            {
              url: `https://og.jup.ag/api/jupiter`,
              alt: 'Jupiter Aggregator',
            },
          ],
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: 'jup.ag',
          handle: '@JupiterExchange',
        }}
      />

      <div>
        <div>
          <AppHeader />

          <div className="">

            <div className="flex justify-center">
              <div className="max-w-6xl mt-12 rounded-xl flex flex-col md:flex-row w-full md:p-4 relative">
                {/* Desktop configurator */}

                  <div className="mt-8 md:mt-0 md:ml-4 h-full w-full rounded-xl flex flex-col">

                    <div className="flex flex-grow items-center justify-center text-white/75">
                      <IntegratedTerminal
                          rpcUrl={rpcUrl}
                          formProps={watchAllFields.formProps}
                          simulateWalletPassthrough={watchAllFields.simulateWalletPassthrough}
                          strictTokenList={watchAllFields.strictTokenList}
                          defaultExplorer={watchAllFields.defaultExplorer}
                        />
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <iframe id="dextools-widget" title="DEXTools Trading Chart" width="500" height="400" src="https://www.dextools.io/widget-chart/en/solana/pe-light/5WGYajM1xtLy3QrLHGSX4YPwsso3jrjEsbU1VivUErzk?theme=light&chartType=2&chartResolution=30&drawingToolbars=false"></iframe>

        

        <div className="w-full mt-12">
          <Footer />
        </div>
      </div>
    </>
  );
}
