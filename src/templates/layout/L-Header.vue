<template>
  <header class="l-header">
    <div class="l-header__bottom u-relative">
      <div class="u-container">
        <div class="l-header__bottom-left">
          <C-Logo />
          <C-Menu :headerMenu="getHeaderMenu" v-if="getHeaderMenu.length"/>
        </div>
        <div class="l-header__bottom-right">
          <div
            class="aws-container"
            data-url="/?wc-ajax=aws_action"
            data-siteurl="http://brand.loc"
          >
            <form
              role="search"
              method="get"
              id="searchform"
              class="c-search"
              action="https://branded.com.ua"
            >
              <button type="submit" class="c-search__button">
                <svg width="15px" height="17px" class="is-search">
                  <use xlink:href="#search"></use>
                </svg>
              </button>
              <input type="hidden" name="post_type" value="product" />
              <input type="hidden" name="type_aws" value="true" />
              <input
                type="text"
                v-model="search"
                placeholder="Поиск"
                name="s"
                id="s"
              />
            </form>
          </div>
          <div class="c-service cart d-none d-sm-block">
            <div>
              <span class="c-service__count">{{getCartProducts.length}}</span>
              <svg width="20px" height="20px"><use xlink:href="#cart"></use></svg>
            </div>
            <div class="c-service__dropdown">
              <div class="l-mini-cart widget_shopping_cart_content">
        
                <p class="u-h3">Корзина</p>
                <span class="l-mini-cart__count">{{getCartProducts.length}} товар</span>
                <div v-if="getCartProducts">
                  <ul class="l-mini-cart__list">
                    <li 
                      v-for="(product, index) in getCartProducts" 
                      :key="index"
                    >

                      <div class="l-mini-cart__item" v-if="(index == 0) || product.size_attribute[0].id != getCartProducts[index-1].size_attribute[0].id">
                        <div class="l-mini-cart__item-img">
                          <a href="#">
                            <img :src="product.post_img_m"> 
                          </a>
                        </div>
                        <div class="l-mini-cart__item-info">
                          <div v-if="product.post_attr_brand" class="is-brand">{{product.post_attr_brand}}</div>
                          <span class="is-name">{{product.name}}</span>
                          <p class="is-quantity" v-if="product.quantity >= 2">Количество: <b>{{product.quantity}}</b></p>
                          <div class="l-mini-cart__item-attr">
                            <div v-if="product.size_attribute" class="is-size">
                              <span>Размер: </span>
                              <span class="is-bold">{{product.size_attribute[0].name}}</span>
                            </div>
                            <!-- {% if product.attr.size %}
                              <div class="is-size">
                                <span>{{ 'Size' | translateString('Cart - Size') }}:</span>
                                <span class="is-bold">{{product.attr.size}}</span>
                              </div>
                            {% endif %}	 -->
                            <!-- {% if product.attr.color %}
                              <div class="is-color">
                                <span>{{ 'Color' | translateString('Cart - Color') }}:</span>
                                <span class="is-bold">{{product.attr.color}}</span>
                              </div>
                            {% endif %} -->
                          </div>

                          <p class="c-price">
                            {{ product.price }} {{strings.string.currency}}
                          </p>

                        </div>
                      </div>
                    </li>
                  </ul>
                  <div class="l-mini-cart__total">
                    <span>Сумма заказа</span>
                    <span class="is-bold">{{getTotalAmount}} {{strings.string.currency}}</span>
                  </div>

                  <div class="l-mini-cart__btn">
                    <router-link :to="{name: 'checkout', params: { checkout: getCheckoutUrl } }" class="u-btn is-black">Оформление заказа</router-link>
                    <router-link :to="{name: 'cart', params: { cart: getCartUrl } }" class="is-cart">В корзину</router-link>
                  </div>
                </div>
                <div v-else>
                  <p>Корзина пуста</p>
                </div>
              </div>
            </div>
          </div>
          <div class="c-dropdown js-dropdown">
            <span class="c-dropdown__current">Помощь</span>
            <svg width="11px" height="7px" class="u-arrow"><use xlink:href="#arrow"></use></svg>
            <ul class="c-dropdown__list">
              <li><a href="https://branded.com.ua/dostavka-i-oplata">Доставка и оплата</a></li>
              <li><a href="https://branded.com.ua/vozvrat-i-obmen">Возврат и обмен</a></li>
              <li><a href="https://branded.com.ua/garantiya">Гарантия</a></li>
              <li><a href="https://branded.com.ua/reviews">Отзывы</a></li>
              <li><a href="tel:+38(066)3156536">+38 (066) 315 65 36</a></li>
            </ul>
          </div>
          <!-- <div class="c-lang js-lang">
            <div class="c-lang__current">
              {{current_lang}}
              <svg width="11px" height="7px" class="c-lang__arrow">
                <use xlink:href="#arrow"></use>
              </svg>
              
            </div>
            <div class="c-lang__sub">
              <pre v-pre>{{ this.$route }}</pre>
              {% for lang in language_code %}
                <a 
                  href="{{ lang.url }}" 
                  class="c-lang__item {% if current_lang == lang.code %}is-active {% endif %}"
                  data-lang="{{lang.code}}"
                >
                  {{ lang.code }}
                </a>
              {% endfor %}
            </div>
          </div> -->

          <div class="c-burger d-block d-sm-none"  @click="mobileMenuModal">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>

import { mapMutations, mapActions, mapGetters } from 'vuex';
import stringConfig from '@/config/stringConfig.js'
import CMenu from '@/templates/components/C-Menu.vue';
import CLogo from '@/templates/components/C-Logo.vue';

export default {
  data() {
    return {
      search: '',
      strings: stringConfig,
    }
  },

  components: {
    CMenu,
    CLogo,
  },

  mounted() {
    this.fetchCartUrl();
    this.fetchHeaderMenu();
    this.fetchMobileMenu();
    this.fetchLanguages(this.$route.path);
    this.setTotalAmount();
  },

  computed: {
    ...mapGetters({
      getCartProducts: 'cart/getCartProducts',
      getCartUrl: 'cart/getCartUrl',
      getCheckoutUrl: 'cart/getCheckoutUrl',
      getTotalAmount: 'cart/getTotalAmount',
      getHeaderMenu: 'menu/getHeaderMenu',
      getMobileMenu: 'menu/getMobileMenu',
      getLanguages: 'menu/getLanguages'
    }),
  },

  methods: {
    ...mapActions({
      fetchCartUrl: 'cart/fetchCartUrl',
      fetchHeaderMenu: 'menu/fetchHeaderMenu',
      fetchMobileMenu: 'menu/fetchMobileMenu',
      fetchLanguages: 'menu/fetchLanguages'
    }),

    ...mapMutations({
      setTotalAmount: 'cart/setTotalAmount'
    }),

    mobileMenuModal() {
      console.log('some');
      this.$popup.open('PopupMobileMenu', {menu: this.getMobileMenu})
    }
  }
}
</script>
