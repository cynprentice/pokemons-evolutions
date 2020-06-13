<template>
  <div >
    <div class="row">
      <div class="col column-right">
        <router-link v-bind:to="{ name: 'Evolutions' }"> <h1>Pokémon Evolutions</h1></router-link>
      </div>
      <div class="col column-left">
        <router-link v-bind:to="{ name: 'About' }"> <p>about</p></router-link>
      </div>
     </div>
    <router-view/>
  
  </div>
</template>

<script>

</script>

<style>
body {
  font-family: sans-serif;
  background-color: white;
}

.column-right {
  float: left;
  width: 45%;
  text-align: left;
  padding: 2rem;
}

.column-left {
  float: left;
  width: 45%;
  text-align: right;
  padding: 2rem;
}


</style>
