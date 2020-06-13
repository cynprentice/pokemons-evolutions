<template>
  <div>
   
    <div class="card-container">
      <load-spinner v-if="showLoading"></load-spinner>
     <div v-if="messages.length > 0" class="messages">
      <message-container v-bind:messages="messages"></message-container>
    </div>
      <carousel :per-page="1" >
      <slide v-for="card in cards" :key="card.id">
             <img class="card-image" v-bind:src="card.imageUrl">
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
      showLoading: false
    }
  },
  props: {
    pokedexNumber: {}
  },
created () {
      console.log("CardCarousel.vue called with " + this.pokedexNumber);
     this.showLoading = true;
      axios
        .get(this.pokemonCardURL, {
          params: {
            nationalPokedexNumber: this.pokedexNumber
          }
        })
        .then(response => {
          this.cards = response.data.cards;
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
</script>

<style scoped>
  .card-image {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
    max-width: 250px;
  }

  .card-caption {
    text-align: center;
  }
 
</style>