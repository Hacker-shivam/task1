export default function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow-md p-5 rounded-xl">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}