import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/assets/hnapi-axios'

const accessor: Plugin = ({ $axios }) => {
  initializeAxios($axios)
}

export default accessor
