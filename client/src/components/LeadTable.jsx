export default function LeadTable({ leads, onEdit }) {
  return (
    <table className="w-full mt-4 border">
      <thead className="bg-gray-200">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>City</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {leads.map((lead) => (
          <tr key={lead._id} className="text-center">
            <td>{lead.name}</td>
            <td>{lead.email}</td>
            <td>{lead.city}</td>
            <td>{lead.status}</td>
            <td>
              <button
                onClick={() => onEdit(lead)}
                className="bg-yellow-400 px-2 py-1 rounded"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}