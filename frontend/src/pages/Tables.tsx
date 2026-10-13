import React, { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { apiService } from '../services/api';

const Tables: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [pendingConfirmation, setPendingConfirmation] = useState<
    { message: string; confirmLabel: string; onConfirm: () => void } | undefined
  >(undefined);

  const remoteOperationHandler = async (operation: () => Promise<any>, successMessage: string) => {
    try {
      setLoading(true);
      setMessage(undefined);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await operation();
      setMessage(successMessage);
    } catch (error: any) {
      setMessage(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTables = () => {
    return remoteOperationHandler(() => apiService.createTables(), 'Tables created successfully');
  };

  const handleInsertData = () => {
    return remoteOperationHandler(
      () => apiService.populateTables(),
      'Sample data inserted successfully',
    );
  };

  const handleDeleteData = () => {
    setPendingConfirmation({
      message: 'Are you sure you want to delete all data?',
      confirmLabel: 'Delete Data',
      onConfirm: () =>
        remoteOperationHandler(() => apiService.deleteTables(), 'Data deleted successfully'),
    });
  };

  const handleDropTables = () => {
    setPendingConfirmation({
      message: 'Are you sure you want to drop all tables? This cannot be undone',
      confirmLabel: 'Drop Tables',
      onConfirm: () =>
        remoteOperationHandler(() => apiService.dropTables(), 'Tables dropped successfully'),
    });
  };

  return (
    <div className="container">
      <div className="card">
        {loading ? (
          <div className="loading">
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '10px',
                }}
              ></div>
              Processing...
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <div className="actions" style={{ gap: '10px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={handleCreateTables} disabled={loading}>
                Create Tables
              </button>
              <button className="btn btn-success" onClick={handleInsertData} disabled={loading}>
                Insert Data
              </button>
              <button className="btn btn-warning" onClick={handleDeleteData} disabled={loading}>
                Delete Data
              </button>
              <button className="btn btn-danger" onClick={handleDropTables} disabled={loading}>
                Drop Tables
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className={message.includes('Error') ? 'error' : 'success'}>{message}</div>
        )}
      </div>

      <ConfirmModal
        isOpen={pendingConfirmation !== undefined}
        message={pendingConfirmation?.message ?? ''}
        confirmLabel={pendingConfirmation?.confirmLabel}
        onConfirm={() => {
          pendingConfirmation?.onConfirm();
          setPendingConfirmation(undefined);
        }}
        onCancel={() => setPendingConfirmation(undefined)}
      />

      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Tables;
