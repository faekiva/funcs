Deno.cron("check for it being cold enough to run pipes", { hour: { every: 1 } },  async ()=> {
  const data = fetch()
} )