<template>
  <div>
    <div class="messages">
      <message-container v-bind:messages="messages"></message-container>
    </div>
    <div class="cardImage">
      <load-spinner v-if="showLoading"></load-spinner>
      <img v-bind:src="imageURL">
      <br>
      <b>{{ name }}</b>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CubeSpinner from '@/components/CubeSpinner';
import MessageContainer from '@/components/MessageContainer';

export default {
  name: 'CardImage',
  
  components: {
    'load-spinner': CubeSpinner,
    'message-container': MessageContainer
  }, 
  data () {
    return {
      cards: {},
      messages: [],
      imageURL: "",
      showLoading: false
    }
  },
  props: {
    name: {}
  },
created () {
      console.log("CardImage.vue called with " + this.name);
     this.showLoading = true;
      axios
        .get("https://api.pokemontcg.io/v1/cards/", {
          params: {
            name: this.name          }
        })
        .then(response => {
          this.cards = response.data.cards;
          this.imageURL = this.cards[0].imageUrl
          console.log("the image url for " + this.name + " :" + this.imageURL);
          this.showLoading = false;
        })
        .catch(error => {
        this.messages.push({
          type: 'error',
          text: error.message
        });
        this.showLoading = false;
       
      });
}
}
</script>

<style scoped>
  .cardImage {
    display: inline-block;
    width: 100px;
  }
 
</style>