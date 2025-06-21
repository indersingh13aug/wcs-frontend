import { useEffect, useState } from 'react';
import axios from '../services/axios';

function GSTReceiptPage() {
  const [invoices, setInvoices] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    // Fetch list of invoices
    axios.get('/invoices')
      .then(res => setInvoices(res.data))
      .catch(err => console.error("Failed to load invoices:", err));
  }, []);

  const handleSearch = () => {
    if (selectedId) {
      axios.get(`/generate-receipt/${selectedId}`, {
        responseType: 'blob'
      }).then(res => {
        const fileURL = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        setPdfUrl(fileURL);
      }).catch(err => {
        console.error("Failed to load PDF:", err);
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">View GST Receipt</h1>

      <div className="flex items-center gap-4 mb-6">
        <select
          className="border px-4 py-2 rounded w-full"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Select Receipt --</option>
          {invoices.map(invoice => (
            <option key={invoice.id} value={invoice.id}>
              {invoice.invoice_number} - {invoice.client_name}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          title="GST PDF"
          style={{ border: '1px solid #ccc' }}
        />
      ) : (
        <p className="text-gray-500">No receipt loaded yet.</p>
      )}
    </div>
  );
}

export default GSTReceiptPage;
