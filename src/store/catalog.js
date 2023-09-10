import Api from '@/api/Axios'

const state = {
  products: [],
  resultProducts: []
};
const mutations = {
  setProductsList(state, products) {
    state.products = products;
  },
  setMoreProductsList(state, moreProducts) {
    state.products = [...state.products, ...moreProducts];
  },
  setResultProducts(state, resultProducts) {
    state.resultProducts = [...state.resultProducts, ...resultProducts]
  }
};
const actions = {
  fetchProducts({commit}, url) {
    return Api.post('archive/get_products', {
      url: url
    })
    .then((result) => {
      commit('setProductsList', result.data.products)
      commit('setResultProducts', result.data.products)
      return result.data;
    })
    .catch((error) => {
      console.log(error);
    });
  },

  fetchMoreProducts({commit}, url, page, offset, slug) {
    return Api.post('archive/load_more_products', {
      url: url,
      page: page,
      offset: offset,
      slug: slug,
    })
    .then((result) => {
      if(result.data.status !== 'nomore') {
        commit('setMoreProductsList', result.data.products)
        commit('setResultProducts', result.data.products)
      } 
      console.log(result.data, commit);
      return result.data;
    })
    .catch((error) => {
      console.log(error);
    })
  }
};
const getters = {
  products(state) {
    return state.products;
  },
  resultProducts(state) {
    return state.resultProducts
  }
};

export default {namespaced: true, state, mutations, actions, getters};