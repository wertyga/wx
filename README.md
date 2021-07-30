 <h3>This is the simplest state manager, based on React hooks</h3> 

```javascript
npm install --save wx
```

```javascript
import { DraggableContainer } from 'wx';
import { UserStore } from './stores';

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

<RootStoreProvider stores={stores} options={options}>
  {children}
</RootStoreProvider>
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
