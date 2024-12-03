import { envSchema, hourlyForecastSchema, pointsSchemaPartial } from "./schema.ts"
import type {HourlyPredictions} from "./schema.ts"
import { parseEnv } from "jsr:@keawade/zod-env";
import { dayOfYear, isLeap, difference, HOUR, MINUTE, SECOND } from "@std/datetime";


function reportUpcomingCold(predictions: HourlyPredictions[]) {

}

Deno.cron("check for it being cold enough to run pipes", "0 0 * * *",  async ()=> {
  const env = parseEnv(envSchema);

  const getGrid = await fetch(`https://api.weather.gov/points/${env.LATITUDE},${env.LONGITUDE}`, {redirect: 'follow'})
  const getHourly = fetch(pointsSchemaPartial.parse(getGrid).properties.forecastHourly, {redirect: 'follow'})

  const forecast = hourlyForecastSchema.parse(await getHourly)

  const now  = new Date()
  const upcomingCold: HourlyPredictions[] = []

  for (const prediction of forecast.properties.periods) {
    if (prediction.temperature <= 15) {
      const howLong = difference(new Date(prediction.startTime), now).hours
      if (howLong === undefined) {
        throw Error("couldn't calculate how long until it'll be cold, but it's coming!")
      }
      upcomingCold.push(prediction)
    }
  }

  reportUpcomingCold(upcomingCold)
})
