<script>
   import SM from "./sm.svelte"
   import WD from "./wd.svelte"
   import TA from "./ta.svelte"

   import Number from "../DataViz/number.svelte"
</script>

<h4 class="PageTitle">The Dashboard</h4>
<button class="btn">Here's a button</button>

<div class="dashboard">
   <div class="dashboardContainer">      
   
      <SM title={"Test number"} viz={Number}/>
      <WD />
      <WD />
      <SM title={"Test number 2"} viz={Number}/>
      <SM  title={"Test number 3"} viz={Number} />
   </div>
</div>


<style>
   .dashboardContainer {
      display: flex;
      flex-wrap: wrap;
      
   }

   .btn {
      background-color: #54D334;
      border: #54D334;
      width: 140px;
      height: 40px;
      
   }

   :global(#dashComp) {
      border-radius: 30px;
 
      margin: 30px;
      
      background-color: #2a2e32;
      color: white;
      padding: 30px;

      border-style: solid;
      border-width: 1px;
      border-color: #2a2e32;
   }

   :global(#dashComp:hover) {
      /*background-image: linear-gradient( #25ff80bd  ,#2a2e32 30%);*/
      border-color: #54D334;
   }

   :global(.Title) {
      font-size: 30px;
      font-weight: medium;
   }

   .PageTitle {
      font-size: 45px;
      margin-left: 30px;
   }
</style>