<template>
  <div>
    <div v-if="messages.length > 0" class="messages">
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
import { pokemonCardURL } from '@/common/URL.js';

export default {
  name: 'CardImage',
  
  components: {
    'load-spinner': CubeSpinner,
    'message-container': MessageContainer
  }, 
  data () {
    return {
      pokeCardResults: {},
      messages: [],
      imageURL: "",
      showLoading: false
    }
  },
  props: {
    pokedexNumber: {}
  },
created () {
    //console.log("CardImage.vue called with " + this.pokedexNumber);
    this.showLoading = true;
    let cacheLabel = 'pokeCards_' + this.pokedexNumber;
    let cacheExpiry = 15 * 60 * 1000; // 15 minutes

    if (this.$ls.get(cacheLabel)){
      console.log('pokeCard cached query detected.');
      this.pokeCardResults = this.$ls.get(cacheLabel);
       this.imageURL = this.pokeCardResults[0].imageUrl
      this.showLoading = false;
    } else {
      console.log('No pokeCard cache available. Making API request.');
      axios
        .get(pokemonCardURL, {
          params: {
            nationalPokedexNumber: this.pokedexNumber          }
        })
        .then(response => {
          try {
            this.$ls.set(cacheLabel, response.data.cards, cacheExpiry);
            console.log('New query has been cached as: ' + cacheLabel);
            } catch (domException) {
                if (['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(domException.name)) {
                  console.log("cache full " + cacheLabel + " not cached");
                }
            }
          this.pokeCardResults = response.data.cards;
          this.imageURL = this.pokeCardResults[0].imageUrl
          //console.log("the image url for " + this.pokedexNumber + " :" + this.imageURL);
          this.showLoading = false;
        })
        .catch(error => {
        this.messages.push({
          type: 'error',
          text: "Error retrieving card image: " + error.message
        });
        this.showLoading = false;
      });
    }
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