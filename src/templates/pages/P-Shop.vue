<template>
  <main class="p-shop">
    <div class="u-container">
      <C-Breadcrumb />
      <div class="p-shop__flex">
        <div class="p-shop__sidebar">
          
        </div>
        <div class="p-shop__catalog">
          <section class="l-shop" data-categories="Женщинам" data-cat-id="17">
            <h1 class="u-h2">Женщинам</h1>
            <L-Filter-Block />
            <div v-if="products" class="l-shop__product">
              <div class="row js-load-more">
                <div
                  v-for="product in products"
                  :key="product.id"
                  class="col-lg-3 col-md-4 col-sm-6 col-6 u-col"
                >
                  <C-Product :product="product" />
                </div>
              </div>
            </div>
            <C-Pagination 
              :category-slug-from-route="categorySlugFromRoute" 
              :count-products="productsCount" 
              :current-page="currentPage"
            />
          </section>
        </div>
      </div>
    </div>
    <L-Subscribe />
  </main>
</template>

<script>

import LSubscribe from '@/templates/layout/L-Subscribe.vue'
import LFilterBlock from '@/templates/layout/L-Filter-block.vue'

import CProduct from '@/templates/components/C-Product.vue'
import CPagination from '@/templates/components/C-Pagination.vue'
import CBreadcrumb from '@/templates/components/C-Breadcrumbs.vue'

// import Api from '@/api/Axios'

import { mapActions, mapMutations, mapGetters } from 'vuex';

export default {
  name: "App",

  components: {
    LFilterBlock,
    LSubscribe,
    CProduct,
    CPagination,
    CBreadcrumb
  },

  beforeDestroy() {
    this.setProductsList([]);
  },

  mounted() {
    this.fetchProducts({
      url: this.$route.fullPath, 
      page: this.currentPage,
      slug: this.categorySlugFromRoute,
      offset: 0
    }).then(result => {
      console.log(result);
    })
  },

  computed: {
    ...mapGetters({
      products: 'catalog/products',
      productsCount: 'catalog/productsCount',
    }),

    offset() {
      return 16 * this.currentPage;
    },
    
    categorySlugFromRoute() { return this.$route.params.subcategorySlug || this.$route.params.categorySlug },
    currentPage() { 
      const queryPage = this.$route?.query?.page;
      const currentPageNumber = Number(queryPage) || 1;

      return currentPageNumber;
    }
  },

  methods: {
    ...mapMutations({
      setProductsList: 'catalog/setProductsList'
    }),

    ...mapActions({
      fetchProducts: 'catalog/fetchProducts'
    }),
  }
}
</script>