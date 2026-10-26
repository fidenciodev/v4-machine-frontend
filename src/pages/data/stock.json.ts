import type { APIRoute } from 'astro';
import stock from '../../data/stock.json';

export const prerender = true;
export const GET: APIRoute = () => new Response(JSON.stringify(stock), {
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});
