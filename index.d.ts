
import * as React from "react";

export interface PlaidMetadata {
    institution: {
        name: string;
        institution_id: string;
    }

    account?: {
        id: string;
        name: string;
    }
}

export type ProductType = 'auth' | 'transactions' | 'identity';
export interface IPlaidLinkProps {
    clientName: string;
    env: 'sandbox' | 'development' | 'production';
    publicKey: string;
    product: ProductType[];
    autoOpen?: boolean;

    institution?: string;
    token?: string;
    selectAccount?: boolean;
    webhook?: string;

    onSuccess: (public_token: string, metadata: PlaidMetadata) => void;

    onExit?: () => void;
    onLoad?: () => void;
    loadingRender?: () => JSX.Element;
    errorRender?: () => JSX.Element;
}

export class PlaidLink extends React.PureComponent<IPlaidLinkProps, any> {}
