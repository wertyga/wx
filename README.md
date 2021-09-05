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
		},
	},
	fetchClient: ApolloClient(),
};

export const ChildComponent = () => {
	const userStore =  UserStore('userStore');
	return (
      <div>
        <span>Singers...</span>
        <span>{userStore.username}</span>
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

<h3>Store class example</h3>

```
import { RootState } from 'wx/types';


type RootStore = {
    userStore: UserStore,
} 

type ProductStoreType = RootState<RootStore, ApolloClient<any>>;

class UserStore {
    fetch: ProductStoreType['fetch'];
    rootStore: ProductStoreType['rootStore'];
    
    ...Some class impliment
}
```

| Adding class props  | Option type |
| ------------- | ------------- |
| fetch  | Fetch instance  |
| rootStore  | RootStore that contain all your stores  |
