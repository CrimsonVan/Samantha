import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.less'
import { AliveScope } from 'react-activation'
import KeepAlive from 'react-activation'

KeepAlive.defaultProps = {
  ...(KeepAlive as any).defaultProps,
  autoFreeze: false,
  saveScrollPosition: false
}

// import store from './store/index.ts'
// import { Provider } from 'react-redux'
// import { PersistGate } from 'redux-persist/integration/react'
// import { persistor } from './store/index.ts'

//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <App />
//     </PersistGate>
//   </Provider>
// )
createRoot(document.getElementById('root')!).render(
  <AliveScope>
    <App />
  </AliveScope>
)
