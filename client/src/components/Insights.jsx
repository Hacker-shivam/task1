// src/components/Insights.jsx
export default function Insights({ data }) {
  if (!data) return null;

  return (
    <div className="grid md:grid-cols-4 gap-4">

      <div className="bg-purple-100 p-4 rounded shadow">
        <h3 className="text-gray-600">Total Leads</h3>
        <p className="text-xl font-bold">{data.total_leads}</p>
      </div>

      <div className="bg-green-100 p-4 rounded shadow">
        <h3 className="text-gray-600">Conversion Rate</h3>
        <p className="text-xl font-bold">{data.conversion_rate}%</p>
      </div>

      <div className="bg-blue-100 p-4 rounded shadow">
        <h3 className="text-gray-600">Top City</h3>
        <p className="text-xl font-bold">{data.top_city}</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded shadow">
        <h3 className="text-gray-600">Top Service</h3>
        <p className="text-xl font-bold">{data.top_service}</p>
      </div>

    </div>
  );
}