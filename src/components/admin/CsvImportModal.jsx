import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { parseCsvText, downloadCsvFile } from '../../utils/csvHelper';
import { parseResponseJson } from '../../utils/apiHelper';
import { formatCurrency } from '../../utils/formatters';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Sparkles,
  Package,
  Layers
} from 'lucide-react';

export default function CsvImportModal({ isOpen, onClose, onSuccess }) {
  const { adminToken } = useAdminAuth();
  const [file, setFile] = useState(null);
  const [parsedProducts, setParsedProducts] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [importReport, setImportReport] = useState(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    processFile(selected);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (fileObj) => {
    if (!fileObj.name.endsWith('.csv')) {
      setErrorMsg('Please select a valid .csv file');
      return;
    }
    setFile(fileObj);
    setErrorMsg(null);
    setImportReport(null);
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        const rows = parseCsvText(text);
        if (rows.length === 0) {
          setErrorMsg('No valid product records found in the CSV file. Please check the format.');
        } else {
          setParsedProducts(rows);
        }
      } catch (err) {
        console.error('Error parsing CSV file:', err);
        setErrorMsg('Failed to parse CSV file: ' + err.message);
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsText(fileObj);
  };

  const handleDownloadSampleTemplate = async () => {
    try {
      const res = await fetch('/api/products/sample-template-csv');
      const csvText = await res.text();
      downloadCsvFile('Prem_Mobile_Bulk_Product_Template.csv', csvText);
    } catch (e) {
      alert('Failed to download template');
    }
  };

  const handleExecuteImport = async () => {
    if (parsedProducts.length === 0) return;
    setIsUploading(true);
    setErrorMsg(null);
    setImportReport(null);

    try {
      const res = await fetch('/api/products/bulk-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ products: parsedProducts })
      });

      const data = await parseResponseJson(res);
      if (data.success) {
        setImportReport(data.report);
        if (typeof onSuccess === 'function') onSuccess();
      } else {
        setErrorMsg(data.message || 'Bulk import failed');
      }
    } catch (err) {
      setErrorMsg('Network error executing bulk import');
    } finally {
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setParsedProducts([]);
    setErrorMsg(null);
    setImportReport(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative border border-slate-100 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-slate-800">CSV Bulk Product Import</h2>
              <p className="text-xs text-slate-500">Add or update 50+ store accessories in seconds via spreadsheet</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Report Alert */}
        {importReport && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Bulk Import Execution Summary:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-semibold pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-slate-400 block text-[10px] uppercase">Processed</span>
                <span className="text-slate-800 font-extrabold text-lg">{importReport.totalProcessed}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-emerald-600 block text-[10px] uppercase">Created New</span>
                <span className="text-emerald-700 font-extrabold text-lg">+{importReport.createdCount}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
                <span className="text-blue-600 block text-[10px] uppercase">Updated</span>
                <span className="text-blue-700 font-extrabold text-lg">{importReport.updatedCount}</span>
              </div>
            </div>
            {importReport.errorsCount > 0 && (
              <div className="pt-2 text-xs text-rose-700 font-medium">
                ⚠️ {importReport.errorsCount} rows encountered errors during import.
              </div>
            )}
          </div>
        )}

        {/* File Drag-and-Drop / Upload Box */}
        {!importReport && (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center bg-slate-50 hover:bg-emerald-50/30 transition cursor-pointer relative"
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-700 text-sm">
                {file ? file.name : 'Click to Browse or Drag & Drop .CSV File Here'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Supports standard CSV exports from Excel, Google Sheets, or Apple Numbers
              </p>
            </div>

            {/* Template Download Bar */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 text-xs font-semibold text-slate-600">
              <span>Need the proper CSV column format?</span>
              <button
                onClick={handleDownloadSampleTemplate}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-emerald-700 font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV Template</span>
              </button>
            </div>
          </div>
        )}

        {/* Pre-Import Data Preview Table */}
        {parsedProducts.length > 0 && !importReport && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pre-Import Preview ({parsedProducts.length} Items Found)</span>
              </h3>

              <button
                onClick={resetModal}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear File
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-x-auto max-h-64">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-3">Status</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Regular Price</th>
                    <th className="p-3">Offer Price</th>
                    <th className="p-3">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {parsedProducts.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          p.id ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.id ? 'UPDATE ITEM' : 'NEW ITEM'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{p.name}</td>
                      <td className="p-3 text-slate-500">{p.category || 'Accessories'}</td>
                      <td className="p-3 font-semibold">{formatCurrency(p.regularPrice || p.price || 0)}</td>
                      <td className="p-3 font-bold text-emerald-600">{formatCurrency(p.offerPrice || p.regularPrice || 0)}</td>
                      <td className="p-3">{p.stock || 10} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            Close
          </button>

          {parsedProducts.length > 0 && !importReport && (
            <button
              disabled={isUploading}
              onClick={handleExecuteImport}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing Products...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>IMPORT {parsedProducts.length} PRODUCTS NOW</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
