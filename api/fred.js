export default async function handler(req, res) {
  const { series_id } = req.query;
  const apiKey = process.env.FRED_API_KEY;
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&file_type=json&limit=24&sort_order=desc`;
  const r = await fetch(url);
  const data = await r.json();
  res.json(data);
}
