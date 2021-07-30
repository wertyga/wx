import type { RootStore } from './rootStore';

export type Options<S, F> = {
	initialState?: Partial<S>;
	fetchClient?: F;
};

export interface RootState<S, F> {
	set?: (key: string, value: any) => void;
	fetch?: F;
	rootStore?: S;
	getRootStore?: () => RootStore & { get: (s: keyof S | (keyof S)[]) => any };
}

