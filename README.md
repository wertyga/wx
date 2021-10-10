<h3>This is the simplest state manager, based on React hooks</h3>

```javascript
npm install --save @wertyga/wx
```

```javascript
import { getOrInitialStores, useStores } from '@wertyga/wx';

const stores = {
	UserStore,
};

const options = {
	initialState: {
		userStore: {
			username: 'Frank Sinatra', 
            age: 51,
		},
	},
	fetchClient: ApolloClient(),
};

type RootStore = {
	userStore: UserStore,
}
export const ChildComponent = () => {
	const { userStore } = useStores<RootStore>('userStore');
	return (
		<div>
			<span>Singers...</span>
			<span>{userStore.username}</span>
		</div>
	);
};

// To make re-render component only if was changed particular properties of store
// You can pass an array of dependencies (propperties of store)
export const ChildComponent = () => {
	// Component will never do re-render if userStore.username was changed
	const { userStore } = useStores<RootStore, RootStore['userStore']>('userStore', ['age']);
	return (
		<div>
			<span>Singers...</span>
			<span>{userStore.username}</span>
			<span>{userStore.age}</span>
		</div>
	);
};
// Or you can pass "false" to make no react of store changing
export const ChildComponent = () => {
	// Component will never do re-render if any propperty of userStore was changed
	const { userStore } = useStores<RootStore>('userStore', false);
	return (
		<div>
			<span>Singers...</span>
			<span>{userStore.username}</span>
			<span>{userStore.age}</span>
		</div>
	);
};

export const SomeComponent = () => {
	getOrInitialStores(stores, options);
	return (
		<div>
			...Some logic here
		</div>
	);
};
```
| Properties of hook | Values of properties |
| ------------- | ------------- |
| first parameter  | name of store that you want to get  |
| second parameter  | Array of store props that you want to observe OR false to disable this  |

<h3>Store class example</h3>

```
import { RootState, observe } from '@wertyga/wx';

type ProductStoreType = RootState<RootStore, ApolloClient<any>>;

class UserStore {
    fetch: ProductStoreType['fetch'];
    rootStore: ProductStoreType['rootStore'];
    @observe('defaultValue') username: string // This prop will be reactive in your React component
    
    ...Some class impliment
}
```

| Adding class props  | Option type |
| ------------- | ------------- |
| fetch  | Fetch instance  |
| rootStore  | RootStore that contain all your stores  |
