import Vue from 'vue';
import VueLazyload from 'vue-lazyload';

export default async () => {
  Vue.use(VueLazyload, {
    preLoad: 0,
    error: 'https://via.placeholder.com/300',
    loading: 'https://via.placeholder.com/300', // set loading image
    attempt: 3,
    lazyComponent: true,
    observer: true,
    throttleWait: 500
  });
};
