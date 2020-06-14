<template>
  <div>
   
    <div class="card-container">
      <load-spinner v-if="showLoading"></load-spinner>
     <div v-if="messages.length > 0" class="messages">
      <message-container v-bind:messages="messages"></message-container>
    </div>
      <carousel :per-page="1" >
      <slide v-for="card in pokeCardResults" :key="card.id">
             <img class="card-image" v-bind:src="card.imageUrlHiRes">
              <p class="card-caption"> <strong>Set:</strong> {{card.set}} <strong>ID:</strong> {{card.id}} </p>
         <p class="card-caption"><strong>Rarity:</strong> {{card.rarity}}<strong> Artist:</strong> {{card.artist}}</p>
    </slide>
        </carousel>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CubeSpinner from '@/components/CubeSpinner';
import MessageContainer from '@/components/MessageContainer';
import { pokemonCardURL } from '@/common/URL.js';

export default {
  name: 'CardCarousel',
  
  components: {
    'load-spinner': CubeSpinner,
    'message-container': MessageContainer
  }, 
  data () {
    return {
      pokeCardResults: {},
      messages: [],
      showLoading: false
    }
  },
  props: {
    pokedexNumber: {}
  },

  created () {
    this.showLoading = true;
    //console.log("CardCarousel.vue called with " + this.pokedexNumber);
    let cacheLabel = 'pokeCards_' + this.pokedexNumber;
    let cacheExpiry = 15 * 60 * 1000; // 15 minutes

    if (this.$ls.get(cacheLabel)){
      console.log('pokeCard cached query detected.');
      this.pokeCardResults = this.$ls.get(cacheLabel);
      this.showLoading = false;
    } else {
      console.log('No pokeCard cache available. Making API request.');
      axios
        .get(pokemonCardURL, {
          params: {
            nationalPokedexNumber: this.pokedexNumber
          }
        })
        .then(response => {
          try{
            this.$ls.set(cacheLabel, response.data.cards, cacheExpiry);
            console.log('New query has been cached as: ' + cacheLabel);
          } catch (domException) {
              if (['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(domException.name)) {
                console.log("cache full. " + cacheLabel + " not cached");
              }
          }
          this.pokeCardResults = response.data.cards;
          this.showLoading = false;
        })
        .catch(error => {
        this.messages.push({
          type: 'error',
          text: "Error retrieving card carousel images: " + error.message
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
    max-width: 550px;
  }

  .card-caption {
    text-align: center;
  }
 
</style>