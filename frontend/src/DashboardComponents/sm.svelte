<script lang="ts">
   export let title:string;
   export let viz:any;
</script>

<div id="dashComp" class="sm">
   <div class="Title">{title}</div>
   <div class="vizCont">
      <svelte:component this={viz} />
   </div>
   
</div>

<style>
   .sm {
      width: 360px;
      height: 360px;
      
   }

   .vizCont {
      text-align: center;

   }
   
</style>