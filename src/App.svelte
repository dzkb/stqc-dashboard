<script>
  import { onMount } from "svelte";
  import Grid from "gridjs-svelte";
  import { PluginPosition } from "gridjs";

  import RefreshCheckboxPlugin from "./plugins/RefreshCheckboxPlugin";

  // Bound grid instance
  let gridInstance;

  // State used for storing rows
  let currentRows = [];

  // Used for handling table updates
  let shouldUpdate = true;
  let setShouldUpdate = (newValue) => {
    shouldUpdate = newValue;
  };

  // Maps rows to be used in grid
  let processRows = (rows) =>
    rows.map((row) => [
      row.id,
      row.date,
      row.time,
      row.code1,
      row.code2,
      row.event,
      row.osp,
    ]);

  const config = {
    columns: ["Lp.", "Data", "Czas", "Kod 1", "Kod 2", "Wiadomość", "OSP"],
    data: [],
    pagination: {
      enabled: true,
      limit: 100,
      summary: true,
      resetPageOnUpdate: false,
    },
    search: {
      enabled: true,
    },
    sort: true,
    plugins: [
      {
        id: "checkboxPlugin",
        component: RefreshCheckboxPlugin,
        position: PluginPosition.Header,
        props: {
          setShouldUpdate: setShouldUpdate,
        },
      },
    ],
  };

  let updateRows = (grid) =>{
    let url = process.env.API_URL;
    if (currentRows.length > 0) {
      let latestId = currentRows[0][0];
      url += "?id=" + latestId;
    }

    if (shouldUpdate) {
      fetch(url)
      .then((response) => response.json())
      .then((rows) => {
        if (rows.length != currentRows.length) {
          currentRows = [...processRows(rows), ...currentRows];
          grid
            .updateConfig({
              data: currentRows,
            })
            .forceRender();
        }
      });
    }
  }

  onMount(() => {
    setInterval(() => updateRows(gridInstance), 3000);
    updateRows(gridInstance);
  });
</script>

<main>
  <h1>STQC Log</h1>
  <Grid {...config} bind:instance={gridInstance} />

  <style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
  </style>
</main>

<style>
  main {
    max-width: none;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
