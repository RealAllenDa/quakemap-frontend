import { Store } from 'vuex'
import { initializeStores } from '~/assets/hnapi-store'

const initializer = (store: Store<any>) => initializeStores(store)
export const plugins = [initializer]
export * from '~/assets/hnapi-store'
