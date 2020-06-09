<template>
  <div>
    <div class="messages">
      <message-container v-bind:messages="messages"></message-container>
    </div>
    <div class="card-container">
      <load-spinner v-if="showLoading"></load-spinner>
      <img class="card-image" v-bind:src="imageURL">
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
      pokemonCardURL: "https://api.pokemontcg.io/v1/cards/",
      imageURL: "",
      showLoading: false
    }
  },
  props: {
    pokedexNumber: {}
  },
created () {
      console.log("CardImage.vue called with " + this.pokedexNumber);
     this.showLoading = true;
      axios
        .get(this.pokemonCardURL, {
          params: {
            nationalPokedexNumber: this.pokedexNumber          }
        })
        .then(response => {
          this.cards = response.data.cards;
          this.imageURL = this.cards[0].imageUrl
          console.log("the image url for " + this.pokedexNumber + " :" + this.imageURL);
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
  .card-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    max-width: 250px;
  }
 
</style>