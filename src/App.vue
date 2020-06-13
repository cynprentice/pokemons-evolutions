<template>
  <div >
    <div class="row">
      <div class="col column-left">
        <router-link v-bind:to="{ name: 'Evolutions' }"> <h1>Pokémon Evolutions</h1></router-link>
      </div>
      <div class="col column-right">
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


h2,
h3 {
  font-family: sans-serif;
  text-align: center;
  text-transform: uppercase;
}

ul {
  list-style-type: none;
  padding: 0px;
}

a {
text-decoration: none;
}

.row {
  margin: 1rem;
}
/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}


.column-left {
  float: left;
  width: 70%;
  text-align: left;
  
  
}
.column-right {
  float: left;
  width: 20%;
  text-align: right;
  
}



.form {
  margin: 2rem 4rem;
}

.column-1 {
  float: left;
  width: 100%;
}


.column-2 {
  float: left;
  width: 40%;
  padding: 2rem;
}
.column-3 {
  float: left;
  width: 33.33%;
}

</style>
