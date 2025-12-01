import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import z from 'zod';


const getWeather = tool({
    name: 'get_weather',
    description: 'find the temperature of the city which city name user give',
    parameters: z.object({
        city: z.string().describe('Name of city')
    }),
    execute: async ({ city }) => {
        try {
            const apiKey = process.env.WEATHER_API_KEY;

            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
                return { error: data.error.message };
            }

           return data;
        } catch (err) {
            return { error: 'Weather API request failed', details: err.message };
        }
    }


})

const agent = new Agent({
    name: 'Weather Report Agent',
    instructions: `
      You give weather reports for cities.
      Use the "getWeather" tool whenever the user asks for a city's weather.
    `,
    tools: [getWeather]
    
});


const Query = async (query = '') => {
    const result = await run(agent, query)

    console.log('result', result.finalOutput);
}

Query('Hi How are you I want to get the Faisalabad Weather')