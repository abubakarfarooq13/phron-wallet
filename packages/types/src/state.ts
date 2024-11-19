export type PhronState = {
  /**
   * Version 1 of Phron snap state
   */
  v1: {
    /**
     * Account specific storage
     */
    walletState: Record<string, PhronWalletState>;
    /**
     * Current account
     */
    currentAccount: string;
    /**
     * Configuration for Phron
     */
    config: PhronConfig;
  };
};

/**
 * Configuration for Phron snap
 */
export type PhronConfig = {
  domainConfig: PhronDomainConfig;
};

/**
 * Configuration for Phron domains
 *
 * We use this to configure which config to use for which domain
 *
 */
export type PhronDomainConfig = {
  [domain: string]: PhronDomainConfigEntry;
};

/**
 * Configuration for a single Phron domain
 */
export type PhronDomainConfigEntry = {
  rpcUrl: string;
};

/**
 * Account specific storage
 */
export type PhronWalletState = {
  // TODO: Persist imported accounts
};
