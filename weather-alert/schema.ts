import { z } from "npm:zod";

const hourlyPredictions = z.object({
    number: z.number(),
    name: z.string(),
    startTime: z.string().datetime({offset: true}),
    endTime: z.string().datetime({offset: true}),
    isDaytime: z.boolean(),
    temperature: z.number(),
    temperatureUnit: z.string(),
    temperatureTrend: z.string(),
    probabilityOfPrecipitation: z.object({
      unitCode: z.string(),
      value: z.number()
    }),
    dewpoint: z.object({ unitCode: z.string(), value: z.number() }),
    relativeHumidity: z.object({ unitCode: z.string(), value: z.number() }),
    windSpeed: z.string(),
    windDirection: z.string(),
    icon: z.string(),
    shortForecast: z.string(),
    detailedForecast: z.string()
  })

export const hourlyForecastSchema = z.object({
    properties: z.object({
      units: z.string(),
      forecastGenerator: z.string(),
      generatedAt: z.string(),
      updateTime: z.string(),
      validTimes: z.string(),
      elevation: z.object({ unitCode: z.string(), value: z.number() }),
      periods: z.array(
        hourlyPredictions
      )
    })
  })
  
export const envSchema = z.object({
    LATITUDE: z.string().refine((arg)=> {
      const numVersion = Number(arg)
      return !Number.isNaN(numVersion) && numVersion >= -90 && numVersion <= 90
    }, {message: "Should be a coordinate, ideally to 4 decimal points"}),
    LONGITUDE: z.string().refine((arg)=> {
      const numVersion = Number(arg)
      return !Number.isNaN(numVersion) && numVersion >= -180 && numVersion <= 180
    }, {message: "Should be a coordinate, ideally to 4 decimal points"}),
  });

export const pointsSchemaPartial = z.object({
    properties: z.object({
        forecast: z.string(),
        forecastHourly: z.string(),
        forecastGridData: z.string(),
    })
})

export type HourlyPredictions = z.output<typeof hourlyPredictions>