import React, { useEffect, useState } from 'react';
import { DEFAULT_EXPLORER, FormProps } from 'src/types';
import { useUnifiedWalletContext, useWallet } from '@jup-ag/wallet-adapter';

const IntegratedTerminal = (props: {
  rpcUrl: string;
  formProps: FormProps;
  simulateWalletPassthrough: boolean;
  strictTokenList: boolean;
  defaultExplorer: DEFAULT_EXPLORER;
}) => {
  const { rpcUrl, formProps, simulateWalletPassthrough, strictTokenList, defaultExplorer } = props;
  const [isLoaded, setIsLoaded] = useState(false);

  const passthroughWalletContextState = useWallet();
  const { setShowModal } = useUnifiedWalletContext();

  const launchTerminal = async () => {
    window.Jupiter.init({
      displayMode: 'integrated',
      integratedTargetId: 'integrated-terminal',
      endpoint: rpcUrl,
      formProps,
      enableWalletPassthrough: simulateWalletPassthrough,
      passthroughWalletContextState: simulateWalletPassthrough ? passthroughWalletContextState : undefined,
      onRequestConnectWallet: () => setShowModal(true),
      strictTokenList,
      defaultExplorer,
    });
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    if (!isLoaded || !window.Jupiter.init) {
      intervalId = setInterval(() => {
        setIsLoaded(Boolean(window.Jupiter.init));
      }, 500);
    }

    if (intervalId) {
      return () => clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isLoaded && Boolean(window.Jupiter.init)) {
        launchTerminal();
      }
    }, 200);
  }, [isLoaded, simulateWalletPassthrough, props]);

  // To make sure passthrough wallet are synced
  useEffect(() => {
    if (!window.Jupiter.syncProps) return;
    window.Jupiter.syncProps({ passthroughWalletContextState });
  }, [passthroughWalletContextState, props]);

  return (
    <div className="h-full w-full rounded-2xl text-white flex flex-col items-center p-2 lg:p-4 mb-4 overflow-hidden">
      <div className="flex flex-col lg:flex-row h-full w-full overflow-auto">
        <div className="w-full h-full rounded-xl overflow-hidden flex justify-center">
          {/* Loading state */}
          {!isLoaded ? (
            <div className="flex h-full w-full overflow-auto justify-center bg-white/50 rounded-xl">
              <p className="">Loading...</p>
            </div>
          ) : null}

          <div
            id="integrated-terminal"
            className={`flex h-full w-full overflow-auto justify-center bg-white rounded-xl`}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegratedTerminal;
