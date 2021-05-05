<script lang="ts">
   let curNum:number = 30;

   setInterval(() => {
      curNum = Math.floor(Math.random() * 10) 
   }, 500)
</script>

<div id="numberContainer">
   <div id="numberViz">{curNum}</div>
   <h4>Miles an hour</h4>
</div>


<style>
   #numberContainer {
      text-align: center;
      padding-top: 50px;

   }

   #numberViz {
      font-size:150px;
      font-weight: bold;
      text-align: center;
      
   }

   h4 {
      margin-left:auto;
      font-size: 30px;
   }
</style>